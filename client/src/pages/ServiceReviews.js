import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import ReviewList from '../components/ReviewList';
import RatingStats from '../components/RatingStats';
import './ReviewPages.css';

const ServiceReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchServiceReviews();
  }, [filter]);

  const fetchServiceReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getMyServiceReviews();
      
      let filteredReviews = response.reviews || [];
      if (filter === 'guide') {
        filteredReviews = filteredReviews.filter(review => review.serviceType === 'guide');
      } else if (filter === 'vehicle') {
        filteredReviews = filteredReviews.filter(review => review.serviceType === 'vehicle');
      }
      
      setReviews(filteredReviews);
      calculateServiceStats(filteredReviews);
    } catch (error) {
      console.error('Error fetching service reviews:', error);
      setError('Failed to load service reviews');
    } finally {
      setLoading(false);
    }
  };

  const calculateServiceStats = (serviceReviews) => {
    if (!serviceReviews.length) {
      setStats(null);
      return;
    }

    const totalReviews = serviceReviews.length;
    const averageRating = serviceReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    serviceReviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    const guideReviews = serviceReviews.filter(review => review.serviceType === 'guide');
    const vehicleReviews = serviceReviews.filter(review => review.serviceType === 'vehicle');

    setStats({
      averageRating,
      totalReviews,
      ratingDistribution,
      guideReviews: guideReviews.length,
      vehicleReviews: vehicleReviews.length
    });
  };

  const handleReply = async (reviewId, replyText) => {
    try {
      const response = await reviewAPI.updateReview(reviewId, { 
        ownerReply: replyText,
        repliedAt: new Date().toISOString()
      });
      
      setReviews(prev => prev.map(review => 
        review._id === reviewId ? { ...review, ...response.review } : review
      ));
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="reviews-page">
            <div className="loading">Loading service reviews...</div>
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
            <h1>Service Reviews</h1>
            <p>Reviews for my guide services and vehicles</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="reviews-filter">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Reviews ({reviews.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'guide' ? 'active' : ''}`}
              onClick={() => setFilter('guide')}
            >
              Guide Services ({stats?.guideReviews || 0})
            </button>
            <button 
              className={`filter-btn ${filter === 'vehicle' ? 'active' : ''}`}
              onClick={() => setFilter('vehicle')}
            >
              Vehicles ({stats?.vehicleReviews || 0})
            </button>
          </div>

          {stats && (
            <div className="service-stats-section">
              <h2>Performance Summary</h2>
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
                <p>Your services haven't received any reviews yet.</p>
              </div>
            ) : (
              <ReviewList 
                reviews={reviews}
                onReply={handleReply}
                showUserInfo={true}
                showReplyForm={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceReviews;