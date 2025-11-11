// server/models/ReviewEligibility.js
const mongoose = require('mongoose');

const reviewEligibilitySchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide'
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  eligibleForReview: {
    type: Boolean,
    default: true
  },
  reviewSubmitted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReviewEligibility', reviewEligibilitySchema);