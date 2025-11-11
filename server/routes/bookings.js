const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// GET /api/bookings - Get all bookings (with optional filters)
router.get('/', auth, async (req, res) => {
  try {
    const { status, guide, customer, page = 1, limit = 50 } = req.query;
    
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (guide) filter.guide = new RegExp(guide, 'i');
    if (customer) filter.customer = new RegExp(customer, 'i');
    
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments(filter);
    
    res.json({
      data: bookings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/bookings/:id - Update booking
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, guide, date, time, notes, reviewed } = req.body;
    
    const updateFields = { updatedAt: Date.now() };
    if (status) updateFields.status = status;
    if (guide) updateFields.guide = guide;
    if (date) updateFields.date = date;
    if (time) updateFields.time = time;
    if (notes !== undefined) updateFields.notes = notes;
    if (reviewed !== undefined) updateFields.reviewed = reviewed;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/bookings - Create new booking
router.post('/', auth, async (req, res) => {
  try {
    const {
      service,
      guide,
      customer,
      customerEmail,
      customerPhone,
      date,
      time,
      duration,
      total,
      notes
    } = req.body;
    
    const booking = new Booking({
      service,
      guide,
      customer,
      customerEmail,
      customerPhone,
      date,
      time,
      duration,
      total,
      notes,
      status: 'pending'
    });
    
    await booking.save();
    
    res.status(201).json({
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message) 
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/bookings/user/:userId - Get user's bookings
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let filter = { customerEmail: req.params.userId };
    if (status && status !== 'all') filter.status = status;
    
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments(filter);
    
    res.json({
      data: bookings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/bookings/:id/status - Update only status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;