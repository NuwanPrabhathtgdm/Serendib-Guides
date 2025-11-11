const express = require('express');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('booking', 'service guide date')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's reviews
router.get('/my-reviews', async (req, res) => {
  try {
    // In real app, get user ID from auth
    const reviews = await Review.find({ user: '657a983b4e5d6c8f9a1b2c3d' })
      .populate('booking', 'service guide date')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get service reviews (for guide/admin)
router.get('/service-reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ isPublic: true })
      .populate('user', 'name')
      .populate('booking', 'service guide date')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new review
router.post('/', async (req, res) => {
  try {
    const { bookingId, rating, comment, service, guide } = req.body;

    // Verify booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot review this booking' });
    }

    // Check for existing review
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = await Review.create({
      user: '657a983b4e5d6c8f9a1b2c3d', // Demo user ID
      booking: bookingId,
      service,
      guide,
      rating,
      comment,
    });

    const createdReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('booking', 'service guide date');

    res.status(201).json(createdReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update review
router.put('/:id', async (req, res) => {
  try {
    const { rating, comment, isPublic } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment, isPublic },
      { new: true }
    ).populate('user', 'name').populate('booking', 'service guide date');

    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (review) {
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;