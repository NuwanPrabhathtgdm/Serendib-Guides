export const validateReview = (rating, comment) => {
  const errors = {};
  
  if (!rating || rating < 1 || rating > 5) {
    errors.rating = 'Please select a rating between 1 and 5 stars';
  }
  
  if (!comment || comment.trim().length === 0) {
    errors.comment = 'Review comment is required';
  } else if (comment.trim().length < 10) {
    errors.comment = 'Review comment must be at least 10 characters';
  } else if (comment.trim().length > 500) {
    errors.comment = 'Review comment cannot exceed 500 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBooking = (service, guide, date, duration) => {
  const errors = {};
  
  if (!service || service.trim().length === 0) {
    errors.service = 'Service is required';
  }
  
  if (!guide || guide.trim().length === 0) {
    errors.guide = 'Guide name is required';
  }
  
  if (!date) {
    errors.date = 'Booking date is required';
  } else if (new Date(date) < new Date()) {
    errors.date = 'Booking date cannot be in the past';
  }
  
  if (!duration || duration < 1) {
    errors.duration = 'Duration must be at least 1 hour';
  } else if (duration > 24) {
    errors.duration = 'Duration cannot exceed 24 hours';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};