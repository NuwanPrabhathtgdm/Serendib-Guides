// client/src/components/ReviewList.js
import React from 'react';
import StarRating from './StarRating';

const ReviewList = ({ reviews, type }) => {
  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="review-list">
      <div className="rating-summary">
        <h3>Reviews & Ratings</h3>
        <div className="average-rating">
          <span className="rating-number">{calculateAverageRating()}</span>
          <StarRating rating={calculateAverageRating()} />
          <span className="review-count">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="reviews-container">
        {reviews.map(review => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <strong>{review.touristId?.name || 'Anonymous'}</strong>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;