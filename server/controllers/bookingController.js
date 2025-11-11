const Booking = require('../models/Booking');
const ReviewEligibility = require('../models/ReviewEligibility');

// Complete booking and create review eligibility
const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    console.log('Completing booking:', bookingId);

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking is already completed
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already completed'
      });
    }

    // Update booking status to completed
    booking.status = 'completed';
    booking.completedAt = new Date();
    await booking.save();

    // Create review eligibility for this booking
    const reviewEligibility = new ReviewEligibility({
      booking: bookingId,
      user: booking.user,
      service: booking.service,
      serviceType: booking.serviceType,
      eligible: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    await reviewEligibility.save();

    console.log('Booking completed successfully:', bookingId);
    console.log('Review eligibility created:', reviewEligibility._id);

    res.json({
      success: true,
      message: 'Booking completed successfully',
      booking: {
        _id: booking._id,
        status: booking.status,
        completedAt: booking.completedAt,
        serviceType: booking.serviceType,
        service: booking.service
      },
      reviewEligibility: {
        _id: reviewEligibility._id,
        booking: reviewEligibility.booking,
        eligible: reviewEligibility.eligible,
        expiresAt: reviewEligibility.expiresAt
      }
    });

  } catch (error) {
    console.error('Error completing booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing booking',
      error: error.message
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID from auth middleware

    const bookings = await Booking.find({ user: userId })
      .populate('service')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings: bookings.map(booking => ({
        _id: booking._id,
        serviceType: booking.serviceType,
        serviceDetails: booking.service,
        status: booking.status,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt,
        completedAt: booking.completedAt,
        hasReview: false // You can update this based on actual review check
      }))
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings',
      error: error.message
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('service')
      .populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking',
      error: error.message
    });
  }
};

// Create a new booking (if needed)
const createBooking = async (req, res) => {
  try {
    const { serviceId, serviceType, startDate, endDate, totalPrice, userDetails } = req.body;

    const booking = new Booking({
      user: req.user.id, // From auth middleware
      service: serviceId,
      serviceType,
      startDate,
      endDate,
      totalPrice,
      userDetails,
      status: 'pending'
    });

    await booking.save();
    await booking.populate('service');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking',
      error: error.message
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status',
      error: error.message
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking',
      error: error.message
    });
  }
};

module.exports = {
  completeBooking,
  getUserBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking
};