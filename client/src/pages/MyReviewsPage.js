import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../services/api';
import LoadingSpinner, { InlineLoader, ButtonLoader, SkeletonReviewCard } from '../components/LoadingSpinner';
import { NoReviewsEmptyState } from '../components/EmptyState';
import './MyReviewsPage.css';

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await reviewsAPI.getMyReviews();
      setReviews(response.data);
    } catch (err) {
      setError('Failed to load your reviews. Please try again.');
      console.error('Reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    setActionLoading(reviewId);
    try {
      await reviewsAPI.delete(reviewId);
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (err) {
      setError('Failed to delete review. Please try again.');
      console.error('Delete error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditReview = async (reviewId, updatedData) => {
    setActionLoading(reviewId);
    try {
      const response = await reviewsAPI.update(reviewId, updatedData);
      setReviews(reviews.map(review => 
        review._id === reviewId ? response.data : review
      ));
    } catch (err) {
      setError('Failed to update review. Please try again.');
      console.error('Update error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewBookings = () => {
    window.location.href = '/bookings';
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Loading State
  if (loading) {
    return (
      <div className="my-reviews-page">
        <h1>My Reviews</h1>
        <div className="reviews-list">
          <SkeletonReviewCard />
          <SkeletonReviewCard />
        </div>
      </div>
    );
  }

  // Error State (when no reviews exist)
  if (error && reviews.length === 0) {
    return (
      <div className="my-reviews-page">
        <h1>My Reviews</h1>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Reviews</h3>
          <p>{error}</p>
          <button onClick={fetchMyReviews} className="btn btn-retry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reviews-page">
      <div className="page-header">
        <h1>My Reviews</h1>
        <button 
          onClick={fetchMyReviews} 
          className="btn btn-refresh"
          disabled={loading}
        >
          {loading ? <InlineLoader text="Refreshing..." /> : '🔄 Refresh'}
        </button>
      </div>

      {error && reviews.length > 0 && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <div>
                <h3>{review.service} with {review.guide}</h3>
                <p className="review-date">
                  Booked on {new Date(review.booking?.date).toLocaleDateString()}
                </p>
              </div>
              <div className="review-actions">
                <button 
                  className="btn btn-edit"
                  onClick={() => {
                    const newComment = prompt('Edit your review:', review.comment);
                    const newRating = prompt('Edit your rating (1-5):', review.rating);
                    if (newComment && newRating) {
                      handleEditReview(review._id, {
                        comment: newComment,
                        rating: parseInt(newRating)
                      });
                    }
                  }}
                  disabled={actionLoading === review._id}
                >
                  {actionLoading === review._id ? <ButtonLoader /> : 'Edit'}
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => handleDeleteReview(review._id)}
                  disabled={actionLoading === review._id}
                >
                  {actionLoading === review._id ? <ButtonLoader /> : 'Delete'}
                </button>
              </div>
            </div>
            <div className="review-rating">
              {renderStars(review.rating)}
              <span className="rating-text">({review.rating}/5)</span>
            </div>
            <p className="review-comment">{review.comment}</p>
            <div className="review-meta">
              <span>Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Use the imported EmptyState component */}
      {reviews.length === 0 && !loading && !error && (
        <NoReviewsEmptyState onViewBookings={handleViewBookings} />
      )}
    </div>
  );
};

export default MyReviewsPage;