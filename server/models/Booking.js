const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  guide: {
    type: String,
    required: [true, 'Guide name is required'],
    trim: true
  },
  customer: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  time: {
    type: String,
    required: [true, 'Booking time is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 hour']
  },
  total: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  reviewed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ customerEmail: 1, createdAt: -1 });
bookingSchema.index({ guide: 1, date: 1 });
bookingSchema.index({ service: 1 });

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Virtual for display status
bookingSchema.virtual('displayStatus').get(function() {
  return this.status.charAt(0).toUpperCase() + this.status.slice(1);
});

// Instance method to check if booking can be reviewed
bookingSchema.methods.canBeReviewed = function() {
  return this.status === 'completed' && !this.reviewed;
};

// Instance method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

// Static method to get bookings by status
bookingSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get bookings by customer email
bookingSchema.statics.getByCustomer = function(email) {
  return this.find({ customerEmail: email }).sort({ createdAt: -1 });
};

// Static method to get bookings by guide
bookingSchema.statics.getByGuide = function(guideName) {
  return this.find({ guide: new RegExp(guideName, 'i') }).sort({ createdAt: -1 });
};

// Static method to get today's bookings
bookingSchema.statics.getTodaysBookings = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    date: {
      $gte: today,
      $lt: tomorrow
    }
  }).sort({ time: 1 });
};

// Middleware to update updatedAt before save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Transform output to include virtuals and remove version
bookingSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Booking', bookingSchema);