import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../services/api';
import LoadingSpinner, { InlineLoader, SkeletonReviewCard } from '../components/LoadingSpinner';
import { NoServiceReviewsEmptyState, SearchEmptyState } from '../components/EmptyState';
import './ManageReviewsPage.css';

const ManageReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Fetch service reviews
  const fetchServiceReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await reviewsAPI.getAll(); // Example: GET /reviews
      setReviews(response.data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceReviews();
  }, []);

  const handleRefreshReviews = () => {
    fetchServiceReviews();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleToggleVisibility = async (reviewId, isPublic) => {
    try {
      await reviewsAPI.update(reviewId, { isPublic: !isPublic });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isPublic: !isPublic } : r))
      );
    } catch (err) {
      console.error('Failed to update review visibility:', err);
      alert('Error updating review visibility');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewsAPI.delete(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Error deleting review');
    }
  };

  // ✅ Filtering & Searching
  const filteredReviews =
    filter === 'all'
      ? reviews
      : reviews.filter((review) => (filter === 'public' ? review.isPublic : !review.isPublic));

  const searchedReviews = searchTerm
    ? filteredReviews.filter(
        (review) =>
          review.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.guide.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredReviews;

  // ✅ Render states
  if (loading) {
    return (
      <div className="manage-reviews-page">
        <LoadingSpinner text="Loading service reviews..." />
        <div className="reviews-grid">
          {[...Array(6)].map((_, i) => (
            <SkeletonReviewCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-reviews-page error-state">
        <p className="error-text">{error}</p>
        <button className="btn btn-refresh" onClick={handleRefreshReviews}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="manage-reviews-page">
      {/* ===== Header ===== */}
      <div className="page-header">
        <h1>Service Reviews Management</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={handleClearSearch} className="btn btn-clear-search">
                ✕
              </button>
            )}
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="public">Public Only</option>
            <option value="private">Private Only</option>
          </select>

          <button
            onClick={handleRefreshReviews}
            className="btn btn-refresh"
            disabled={loading}
          >
            {loading ? <InlineLoader text="Refreshing..." /> : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* ===== Reviews Grid ===== */}
      <div className="reviews-grid">
        {searchedReviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <h3>{review.service}</h3>
              <span className={`status-badge ${review.isPublic ? 'public' : 'private'}`}>
                {review.isPublic ? 'Public' : 'Private'}
              </span>
            </div>

            <p className="review-comment">"{review.comment}"</p>

            <div className="review-footer">
              <span className="review-guide">By: {review.guide}</span>
              <div className="review-actions">
                <button
                  className="btn btn-toggle"
                  onClick={() => handleToggleVisibility(review.id, review.isPublic)}
                >
                  {review.isPublic ? 'Make Private' : 'Make Public'}
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Empty States ===== */}
      {searchedReviews.length === 0 && !loading && !error && (
        searchTerm ? (
          <SearchEmptyState onClearSearch={handleClearSearch} />
        ) : (
          <NoServiceReviewsEmptyState onRefresh={handleRefreshReviews} />
        )
      )}
    </div>
  );
};

export default ManageReviewsPage;
