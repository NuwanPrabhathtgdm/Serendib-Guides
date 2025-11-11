import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import ReviewList from '../components/ReviewList';
import RatingStats from '../components/RatingStats';
import './ReviewPages.css';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getMyReviews();
      setReviews(response.reviews || []);
      calculateUserStats(response.reviews || []);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      setError('Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = (userReviews) => {
    if (!userReviews.length) {
      setStats(null);
      return;
    }

    const totalReviews = userReviews.length;
    const averageRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    userReviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    setStats({
      averageRating,
      totalReviews,
      ratingDistribution
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewAPI.deleteReview(reviewId);
      setReviews(prev => prev.filter(review => review._id !== reviewId));
      calculateUserStats(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const handleUpdateReview = async (reviewId, updateData) => {
    try {
      const response = await reviewAPI.updateReview(reviewId, updateData);
      setReviews(prev => prev.map(review => 
        review._id === reviewId ? { ...review, ...response.review } : review
      ));
      fetchUserReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="reviews-page">
            <div className="loading">Loading your reviews...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="reviews-page">
          <div className="reviews-header">
            <h1>My Reviews</h1>
            <p>Reviews I've written for services</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {stats && (
            <div className="user-stats-section">
              <h2>My Review Summary</h2>
              <RatingStats 
                averageRating={stats.averageRating}
                totalReviews={stats.totalReviews}
                ratingDistribution={stats.ratingDistribution}
              />
            </div>
          )}

          <div className="reviews-content">
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <h3>No Reviews Yet</h3>
                <p>You haven't written any reviews yet. Complete a booking to leave your first review!</p>
              </div>
            ) : (
              <ReviewList 
                reviews={reviews}
                onDeleteReview={handleDeleteReview}
                onUpdateReview={handleUpdateReview}
                showServiceInfo={true}
                editable={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReviews;