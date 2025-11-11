import React from 'react';
import './EmptyState.css';

export const NoBookingsEmptyState = ({ onRefresh }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📅</div>
      <h3>No Bookings Found</h3>
      <p>There are no bookings to display at the moment. Check back later or refresh to see new bookings.</p>
      <button onClick={onRefresh} className="btn btn-primary">
        Refresh Bookings
      </button>
    </div>
  );
};

export const SearchEmptyState = ({ onClearSearch }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <h3>No Results Found</h3>
      <p>No bookings match your search criteria. Try adjusting your search terms or filters.</p>
      <button onClick={onClearSearch} className="btn btn-secondary">
        Clear Search
      </button>
    </div>
  );
};

export const NoServiceReviewsEmptyState = ({ onRefresh }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">⭐</div>
      <h3>No Reviews Yet</h3>
      <p>There are no service reviews to display. Reviews will appear here once customers submit them.</p>
      <button onClick={onRefresh} className="btn btn-primary">
        Refresh Reviews
      </button>
    </div>
  );
};

export const ErrorEmptyState = ({ message, onRetry }) => {
  return (
    <div className="empty-state error">
      <div className="empty-state-icon">⚠️</div>
      <h3>Something Went Wrong</h3>
      <p>{message || 'An error occurred while loading data. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
};