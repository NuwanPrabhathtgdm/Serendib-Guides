import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => {
  return (
    <div className={`spinner-container ${size}`}>
      <div className="spinner"></div>
    </div>
  );
};

export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="inline-loader">
      <div className="inline-spinner"></div>
      <span>{text}</span>
    </div>
  );
};

export const ButtonLoader = () => {
  return (
    <div className="button-loader">
      <div className="button-spinner"></div>
    </div>
  );
};

// Add the missing SkeletonBookingCard export
export const SkeletonBookingCard = () => {
  return (
    <div className="skeleton-booking-card">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-text-short"></div>
      <div className="skeleton-line skeleton-button"></div>
    </div>
  );
};

export default LoadingSpinner;