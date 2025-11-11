import React, { useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

const ReviewForm = ({ booking, service, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    wouldRecommend: true,
    strengths: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { rating, title, comment, wouldRecommend, strengths } = formData;

  const strengthOptions = service.type === 'guide' 
    ? ['knowledge', 'communication', 'punctuality', 'friendliness', 'professionalism']
    : ['vehicle-condition', 'driving-skills', 'punctuality', 'professionalism'];

  const strengthLabels = {
    knowledge: 'Knowledgeable',
    communication: 'Good Communication',
    punctuality: 'Punctual',
    friendliness: 'Friendly',
    professionalism: 'Professional',
    'vehicle-condition': 'Vehicle Condition',
    'driving-skills': 'Driving Skills'
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onRatingChange = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const onStrengthToggle = (strength) => {
    if (strengths.includes(strength)) {
      setFormData({
        ...formData,
        strengths: strengths.filter(s => s !== strength)
      });
    } else {
      setFormData({
        ...formData,
        strengths: [...strengths, strength]
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setMessage('Please provide a rating');
      return;
    }

    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      };

      const body = JSON.stringify({
        bookingId: booking._id,
        targetType: service.type,
        targetId: service.id,
        rating,
        title,
        comment,
        wouldRecommend,
        strengths
      });

      const res = await axios.post('http://localhost:5000/api/reviews', body, config);
      
      setMessage('Review submitted successfully! Thank you for your feedback.');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to submit review. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--dark-blue)', margin: 0 }}>Leave a Review</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--dark-blue)' }}>
            {service.type === 'guide' ? service.name : service.name}
          </h3>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Service Date: {new Date(booking.startDate).toLocaleDateString()}
          </p>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: message.includes('successful') ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${message.includes('successful') ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            color: message.includes('successful') ? '#065f46' : '#991b1b'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {/* Rating Section */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500', fontSize: '1.1rem' }}>
              How would you rate your experience?
            </label>
            <StarRating
              rating={rating}
              onRatingChange={onRatingChange}
              editable={true}
              size="lg"
            />
            <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
              {rating === 0 && 'Click on a star to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </div>
          </div>

          {/* Recommendation */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Would you recommend this {service.type}?
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="wouldRecommend"
                  value="true"
                  checked={wouldRecommend === true}
                  onChange={() => setFormData({ ...formData, wouldRecommend: true })}
                  style={{ marginRight: '0.5rem' }}
                />
                Yes
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="wouldRecommend"
                  value="false"
                  checked={wouldRecommend === false}
                  onChange={() => setFormData({ ...formData, wouldRecommend: false })}
                  style={{ marginRight: '0.5rem' }}
                />
                No
              </label>
            </div>
          </div>

          {/* Strengths */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              What stood out? (Select all that apply)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {strengthOptions.map(strength => (
                <label key={strength} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={strengths.includes(strength)}
                    onChange={() => onStrengthToggle(strength)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {strengthLabels[strength]}
                </label>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Review Title
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="Summarize your experience"
              maxLength="100"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Review Comment */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Detailed Review
            </label>
            <textarea
              name="comment"
              value={comment}
              onChange={onChange}
              rows="4"
              placeholder="Share details of your experience with this service..."
              maxLength="500"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {comment.length}/500 characters
            </div>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: 'transparent',
                color: '#6b7280',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              style={{
                flex: 1,
                background: rating === 0 ? '#9ca3af' : 'var(--light-blue)',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: (loading || rating === 0) ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;