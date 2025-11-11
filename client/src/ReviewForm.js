import React, { useState } from 'react';
import { validateReview } from '../utils/validation';
import './ReviewForm.css';

const ReviewForm = ({ booking, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateReview(rating, comment);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Clear previous errors
    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit({
        bookingId: booking._id,
        service: booking.service,
        guide: booking.guide,
        rating,
        comment: comment.trim()
      });
      
      // Reset form on success
      setRating(5);
      setComment('');
    } catch (error) {
      setErrors({ submit: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // Clear rating error when user selects a rating
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    // Clear comment error when user starts typing
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: '' }));
    }
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <h2>Write a Review</h2>
        <div className="booking-info">
          <h3>{booking.service}</h3>
          <p>with {booking.guide}</p>
          <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* Rating Input */}
          <div className="form-group">
            <label htmlFor="rating">Rating *</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= rating ? 'active' : ''}`}
                  onClick={() => handleRatingChange(star)}
                  disabled={isSubmitting}
                >
                  ⭐
                </button>
              ))}
            </div>
            <div className="rating-text">
              {rating === 5 ? 'Excellent' : 
               rating === 4 ? 'Good' : 
               rating === 3 ? 'Average' : 
               rating === 2 ? 'Poor' : 'Terrible'}
            </div>
            {errors.rating && <span className="error-message">{errors.rating}</span>}
          </div>

          {/* Comment Input */}
          <div className="form-group">
            <label htmlFor="comment">Review Comment *</label>
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Share your experience with this service and guide..."
              rows="5"
              disabled={isSubmitting}
              className={errors.comment ? 'error' : ''}
            />
            <div className="character-count">
              {comment.length}/500 characters
            </div>
            {errors.comment && <span className="error-message">{errors.comment}</span>}
          </div>

          {/* Submit Error */}
          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;