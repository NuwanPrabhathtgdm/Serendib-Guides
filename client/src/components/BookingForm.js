import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ serviceType, serviceId, serviceName, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    specialRequests: '',
    location: '',
    contactPhone: '',
    numberOfPeople: 1
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { startDate, endDate, specialRequests, location, contactPhone, numberOfPeople } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // This is a simplified calculation - actual rates would come from the service
    if (hours <= 8) {
      return hours * (serviceType === 'guide' ? 15 : 20); // Sample rates
    } else {
      return days * (serviceType === 'guide' ? 100 : 120); // Sample rates
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
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
        serviceType,
        serviceId,
        ...formData
      });

      const res = await axios.post('http://localhost:5000/api/bookings', body, config);
      
      setMessage('Booking created successfully!');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Booking failed. Please try again.'
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
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--dark-blue)', margin: 0 }}>Book {serviceName}</h2>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={startDate}
                onChange={onChange}
                required
                min={new Date().toISOString().slice(0, 16)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={endDate}
                onChange={onChange}
                required
                min={startDate || new Date().toISOString().slice(0, 16)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Number of People *
            </label>
            <input
              type="number"
              name="numberOfPeople"
              value={numberOfPeople}
              onChange={onChange}
              required
              min="1"
              max="50"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Service Location *
            </label>
            <input
              type="text"
              name="location"
              value={location}
              onChange={onChange}
              required
              placeholder="Where will the service take place?"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Contact Phone *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={contactPhone}
              onChange={onChange}
              required
              placeholder="Your contact number"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={specialRequests}
              onChange={onChange}
              rows="3"
              placeholder="Any special requirements or requests..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          {startDate && endDate && (
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontWeight: '500', color: 'var(--dark-blue)' }}>
                Estimated Total: ${calculateTotal()}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                Final amount will be confirmed based on service rates
              </div>
            </div>
          )}

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
              disabled={loading}
              style={{
                flex: 1,
                background: 'var(--light-blue)',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;