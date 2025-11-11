import React, { useState } from 'react';
import { bookingService } from '../services/bookingService';
import '../styles/ReviewStyles.css';

const BookingCompletion = ({ bookingId, onCompletion, showReviewPrompt }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompleteBooking = async () => {
    if (!window.confirm('Are you sure you want to mark this booking as completed?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await bookingService.completeBooking(bookingId);
      
      if (response.success) {
        // Show success message
        alert('Booking completed successfully! You can now leave a review.');
        
        // Notify parent component
        if (onCompletion) {
          onCompletion(response.booking, response.reviewEligibility);
        }
        
        // Show review prompt if function provided
        if (showReviewPrompt) {
          showReviewPrompt(bookingId);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error completing booking');
      console.error('Error completing booking:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-completion">
      <button 
        onClick={handleCompleteBooking}
        disabled={loading}
        className="btn-complete-booking"
      >
        {loading ? 'Completing...' : 'Complete Booking'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default BookingCompletion;