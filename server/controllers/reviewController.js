const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Guide = require('../models/Guide');
const Vehicle = require('../models/Vehicle');
const ReviewEligibility = require('../models/ReviewEligibility');

// @desc    Check review eligibility
// @route   GET /api/reviews/eligibility/:bookingId
// @access  Private
const checkReviewEligibility = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.tourist.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.json({
        success: false,
        eligible: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.json({
        success: false,
        eligible: false,
        message: 'You have already reviewed this booking'
      });
    }

    res.json({
      success: true,
      eligible: true,
      message: 'Eligible for review',
      booking: {
        id: booking._id,
        guide: booking.guide,
        vehicle: booking.vehicle,
        startDate: booking.startDate
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const {
      bookingId,
      targetType,
      targetId,
      rating,
      title,
      comment,
      wouldRecommend,
      strengths
    } = req.body;

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.tourist.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    // Verify target exists and is part of the booking
    let target;
    if (targetType === 'guide') {
      target = await Guide.findById(targetId);
      if (!target || target._id.toString() !== booking.guide.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Guide not part of this booking'
        });
      }
    } else if (targetType === 'vehicle') {
      target = await Vehicle.findById(targetId);
      if (!target || target._id.toString() !== booking.vehicle.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Vehicle not part of this booking'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      booking: bookingId,
      targetType,
      targetId,
      rating,
      title: title || `Review for ${targetType}`,
      comment,
      wouldRecommend: wouldRecommend !== undefined ? wouldRecommend : true,
      strengths: strengths || [],
      serviceDate: booking.startDate
    });

    // Update target's average rating
    await updateTargetRating(targetType, targetId);

    // Populate the review with user details
    await review.populate('user', 'name profilePhoto');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/:targetType/:targetId
// @access  Public
const getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate target type
    if (!['guide', 'vehicle'].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type'
      });
    }

    // Build query
    const query = {
      targetType,
      targetId,
      isPublic: true
    };

    // Get reviews with pagination
    const reviews = await Review.find(query)
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Review.countDocuments(query);

    // Get rating statistics
    const stats = await Review.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          },
          recommendationRate: {
            $avg: { $cond: ['$wouldRecommend', 1, 0] }
          }
        }
      }
    ]);

    const statistics = stats.length > 0 ? {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution: {
        5: stats[0].ratingDistribution.filter(r => r === 5).length,
        4: stats[0].ratingDistribution.filter(r => r === 4).length,
        3: stats[0].ratingDistribution.filter(r => r === 3).length,
        2: stats[0].ratingDistribution.filter(r => r === 2).length,
        1: stats[0].ratingDistribution.filter(r => r === 1).length
      },
      recommendationRate: Math.round(stats[0].recommendationRate * 100)
    } : {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {5:0,4:0,3:0,2:0,1:0},
      recommendationRate: 0
    };

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('targetId')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews for my services (guides/vehicles)
// @route   GET /api/reviews/my-services
// @access  Private
const getMyServiceReviews = async (req, res) => {
  try {
    const user = req.user;
    let serviceReviews = [];

    if (user.role === 'guide') {
      const guide = await Guide.findOne({ user: user.id });
      if (guide) {
        serviceReviews = await Review.find({ 
          targetType: 'guide', 
          targetId: guide._id 
        })
        .populate('user', 'name profilePhoto')
        .populate('booking')
        .sort({ createdAt: -1 });
      }
    } else if (user.role === 'vehicle-owner') {
      const vehicle = await Vehicle.findOne({ user: user.id });
      if (vehicle) {
        serviceReviews = await Review.find({ 
          targetType: 'vehicle', 
          targetId: vehicle._id 
        })
        .populate('user', 'name profilePhoto')
        .populate('booking')
        .sort({ createdAt: -1 });
      }
    }

    res.json({
      success: true,
      count: serviceReviews.length,
      data: serviceReviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update review
    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name profilePhoto');

    // Update target's average rating if rating changed
    if (req.body.rating) {
      await updateTargetRating(review.targetType, review.targetId);
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const targetType = review.targetType;
    const targetId = review.targetId;

    await Review.findByIdAndDelete(req.params.id);

    // Update target's average rating
    await updateTargetRating(targetType, targetId);

    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to update target's average rating
const updateTargetRating = async (targetType, targetId) => {
  try {
    const stats = await Review.aggregate([
      {
        $match: {
          targetType,
          targetId,
          isPublic: true
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const newRating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
    const totalReviews = stats.length > 0 ? stats[0].totalReviews : 0;

    if (targetType === 'guide') {
      await Guide.findByIdAndUpdate(targetId, {
        rating: newRating,
        totalReviews: totalReviews
      });
    } else if (targetType === 'vehicle') {
      await Vehicle.findByIdAndUpdate(targetId, {
        rating: newRating,
        totalReviews: totalReviews
      });
    }
  } catch (error) {
    console.error('Error updating target rating:', error);
  }
};

module.exports = {
  checkReviewEligibility,
  createReview,
  getReviews,
  getMyReviews,
  getMyServiceReviews,
  updateReview,
  deleteReview
};