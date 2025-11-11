import React, { useState, useEffect } from 'react';
import { bookingAPI, reviewAPI } from '../services/api';
import LoadingSpinner, { InlineLoader } from '../components/LoadingSpinner';
import { NoBookingsEmptyState, SearchEmptyState } from '../components/EmptyState';
import './BookingsPage.css';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateBooking(bookingId, { status: newStatus });
      
      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating booking:', err);
    }
  };

  const handleSubmitReview = async (bookingId) => {
    try {
      await reviewAPI.submitReview({
        bookingId,
        ...reviewData
      });
      
      // Update booking to mark as reviewed
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, reviewed: true } : booking
        )
      );
      
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      setError('Failed to submit review');
      console.error('Error submitting review:', err);
    }
  };

  const handleRefreshBookings = () => {
    fetchBookings();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  // Filter bookings based on status
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  // Search through filtered bookings
  const searchedBookings = searchTerm 
    ? filteredBookings.filter(booking =>
        booking.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guide?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredBookings;

  // Stats calculation
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="page-header">
          <h1>Bookings Management</h1>
        </div>
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h1>Bookings Management</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={handleClearSearch}
                className="btn btn-clear-search"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            onClick={handleRefreshBookings} 
            className="btn btn-refresh"
            disabled={loading}
          >
            {loading ? <InlineLoader text="Refreshing..." /> : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bookings-stats">
        <div className="stat-card">
          <h3>Total</h3>
          <span className="stat-number">{totalBookings}</span>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <span className="stat-number pending">{pendingBookings}</span>
        </div>
        <div className="stat-card">
          <h3>Confirmed</h3>
          <span className="stat-number confirmed">{confirmedBookings}</span>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <span className="stat-number completed">{completedBookings}</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="btn-close-error">✕</button>
        </div>
      )}

      {/* Bookings Grid */}
      <div className="bookings-grid">
        {searchedBookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <h3>{booking.service}</h3>
              <span className={`status-badge ${booking.status}`}>
                {booking.status}
              </span>
            </div>
            
            <div className="booking-details">
              <p><strong>Booking ID:</strong> {booking.id}</p>
              <p><strong>Guide:</strong> {booking.guide}</p>
              <p><strong>Customer:</strong> {booking.customer}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <p><strong>Duration:</strong> {booking.duration} hours</p>
              <p><strong>Total:</strong> ${booking.total}</p>
            </div>

            <div className="booking-actions">
              {booking.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                    className="btn btn-confirm"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                </>
              )}
              
              {booking.status === 'confirmed' && (
                <button 
                  onClick={() => handleStatusUpdate(booking.id, 'completed')}
                  className="btn btn-complete"
                >
                  Mark Complete
                </button>
              )}
              
              {booking.status === 'completed' && !booking.reviewed && (
                <button 
                  onClick={() => openReviewModal(booking)}
                  className="btn btn-review"
                >
                  Add Review
                </button>
              )}
              
              {booking.reviewed && (
                <span className="reviewed-badge">Reviewed ✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty States */}
      {searchedBookings.length === 0 && !loading && !error && (
        searchTerm ? (
          <SearchEmptyState onClearSearch={handleClearSearch} />
        ) : (
          <NoBookingsEmptyState onRefresh={handleRefreshBookings} />
        )
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Submit Review for {selectedBooking?.service}</h2>
            <div className="review-form">
              <div className="form-group">
                <label>Rating:</label>
                <select 
                  value={reviewData.rating}
                  onChange={(e) => setReviewData(prev => ({ 
                    ...prev, 
                    rating: parseInt(e.target.value) 
                  }))}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} ★</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Comment:</label>
                <textarea 
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ 
                    ...prev, 
                    comment: e.target.value 
                  }))}
                  placeholder="Share your experience..."
                  rows="4"
                />
              </div>
              <div className="modal-actions">
                <button 
                  onClick={() => handleSubmitReview(selectedBooking.id)}
                  className="btn btn-primary"
                >
                  Submit Review
                </button>
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;