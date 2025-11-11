const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guideId: {
    type: String,
    required: [true, 'Please add your government issued guide ID'],
    unique: true,
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
    min: 0
  },
  languages: [{
    type: String,
    required: true
  }],
  specialties: [{
    type: String
  }],
  bio: {
    type: String,
    maxlength: 500
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Please add your hourly rate'],
    min: 0
  },
  dailyRate: {
    type: Number,
    required: [true, 'Please add your daily rate'],
    min: 0
  },
  locations: [{
    type: String
  }],
  photo: {
    type: String,
    default: ''
  },
  idDocument: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Guide', guideSchema);