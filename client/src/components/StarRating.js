import React, { useState } from 'react';

const StarRating = ({ rating, onRatingChange, editable = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const handleClick = (value) => {
    if (editable && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (editable) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizes[size]} ${
            editable ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={!editable}
        >
          {star <= displayRating ? (
            <span className="text-yellow-400">★</span>
          ) : (
            <span className="text-gray-300">★</span>
          )}
        </button>
      ))}
      {rating > 0 && !editable && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;