import React from 'react';
import './LoadingSpinner.css';

export const SkeletonBookingCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-line medium"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-line long" style={{marginTop: '15px', height: '15px', width: '40%'}}></div>
    </div>
  );
};

export const SkeletonReviewCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line" style={{height: '15px', width: '30%', marginBottom: '15px'}}></div>
      <div className="skeleton-line long"></div>
      <div className="skeleton-line long"></div>
      <div className="skeleton-line medium"></div>
      <div className="skeleton-line short" style={{marginTop: '15px'}}></div>
    </div>
  );
};

export const SkeletonText = ({ lines = 1, width = '100%' }) => {
  return (
    <div>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="skeleton-line"
          style={{ width, marginBottom: index === lines - 1 ? 0 : '8px' }}
        ></div>
      ))}
    </div>
  );
};