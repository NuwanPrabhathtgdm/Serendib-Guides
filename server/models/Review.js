const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking reference is required']
  },
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
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ booking: 1 }, { unique: true });
reviewSchema.index({ guide: 1, createdAt: -1 });
reviewSchema.index({ service: 1, rating: -1 });
reviewSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for star rating display
reviewSchema.virtual('starRating').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

// Static method to get average rating for a guide
reviewSchema.statics.getAverageRating = async function(guideName) {
  const result = await this.aggregate([
    { $match: { guide: guideName, isPublic: true } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  return result.length > 0 ? {
    average: Math.round(result[0].averageRating * 10) / 10,
    count: result[0].count
  } : { average: 0, count: 0 };
};

// Static method to get public reviews
reviewSchema.statics.getPublicReviews = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('booking', 'date service');
};

module.exports = mongoose.model('Review', reviewSchema);