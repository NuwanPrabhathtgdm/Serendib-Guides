const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    required: [true, 'Please add vehicle type'],
    enum: ['car', 'van', 'tuktuk', 'bus', 'suv']
  },
  vehicleModel: {
    type: String,
    required: [true, 'Please add vehicle model']
  },
  vehicleYear: {
    type: Number,
    required: [true, 'Please add vehicle year'],
    min: 1990,
    max: new Date().getFullYear() + 1
  },
  licensePlate: {
    type: String,
    required: [true, 'Please add license plate number'],
    unique: true,
    uppercase: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please add passenger capacity'],
    min: 1
  },
  amenities: [{
    type: String,
    enum: ['ac', 'wifi', 'charging-ports', 'english-speaking-driver', 'child-seats', 'cooler']
  }],
  photos: [{
    type: String
  }],
  hourlyRate: {
    type: Number,
    required: [true, 'Please add hourly rate'],
    min: 0
  },
  dailyRate: {
    type: Number,
    required: [true, 'Please add daily rate'],
    min: 0
  },
  driverName: {
    type: String,
    required: [true, 'Please add driver name']
  },
  driverPhone: {
    type: String,
    required: [true, 'Please add driver phone number']
  },
  locations: [{
    type: String
  }],
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

module.exports = mongoose.model('Vehicle', vehicleSchema);