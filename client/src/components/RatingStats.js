// client/src/components/RatingStats.js
import React from 'react';
import StarRating from './StarRating';

const RatingStats = ({ reviews }) => {
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => distribution[review.rating]++);
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <div className="rating-stats">
      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map(stars => (
          <div key={stars} className="rating-bar">
            <span className="stars-label">{stars} stars</span>
            <div className="bar-container">
              <div 
                className="bar-fill"
                style={{ 
                  width: `${(distribution[stars] / totalReviews) * 100 || 0}%` 
                }}
              ></div>
            </div>
            <span className="count-label">({distribution[stars]})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingStats;