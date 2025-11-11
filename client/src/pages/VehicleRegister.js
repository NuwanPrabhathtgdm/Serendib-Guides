import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VehicleRegister = () => {
  const [formData, setFormData] = useState({
    vehicleType: 'car',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    licensePlate: '',
    capacity: '',
    amenities: [],
    hourlyRate: '',
    dailyRate: '',
    driverName: '',
    driverPhone: '',
    locations: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const {
    vehicleType, vehicleModel, vehicleYear, licensePlate, capacity,
    amenities, hourlyRate, dailyRate, driverName, driverPhone, locations
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onArrayChange = (field, value) => {
    if (formData[field].includes(value)) {
      setFormData({
        ...formData,
        [field]: formData[field].filter(item => item !== value)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...formData[field], value]
      });
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

      const body = JSON.stringify(formData);

      const res = await axios.post('http://localhost:5000/api/vehicles/register', body, config);
      
      setMessage('Vehicle registered successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    { value: 'car', label: 'Car (1-4 passengers)' },
    { value: 'van', label: 'Van (5-12 passengers)' },
    { value: 'suv', label: 'SUV (4-7 passengers)' },
    { value: 'tuktuk', label: 'TukTuk (1-3 passengers)' },
    { value: 'bus', label: 'Bus (13+ passengers)' }
  ];

  const amenitiesList = [
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'charging-ports', label: 'Charging Ports' },
    { value: 'english-speaking-driver', label: 'English Speaking Driver' },
    { value: 'child-seats', label: 'Child Seats' },
    { value: 'cooler', label: 'Cooler/Refrigerator' }
  ];

  const commonLocations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Airport', 'Bentota', 'Mirissa', 'Ella', 'Nuwara Eliya', 'Sigiriya'];

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', color: 'var(--dark-blue)', marginBottom: '2rem' }}>
            Register Your Vehicle
          </h1>
          
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

          <form onSubmit={onSubmit} style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Vehicle Type *
              </label>
              <select
                name="vehicleType"
                value={vehicleType}
                onChange={onChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                {vehicleTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={vehicleModel}
                  onChange={onChange}
                  required
                  placeholder="e.g., Toyota Hiace"
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
                  Vehicle Year *
                </label>
                <input
                  type="number"
                  name="vehicleYear"
                  value={vehicleYear}
                  onChange={onChange}
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  License Plate *
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={licensePlate}
                  onChange={onChange}
                  required
                  placeholder="e.g., CAB1234"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Passenger Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={capacity}
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
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Amenities & Features
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {amenitiesList.map(amenity => (
                  <label key={amenity.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={amenities.includes(amenity.value)}
                      onChange={() => onArrayChange('amenities', amenity.value)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {amenity.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Hourly Rate (USD) *
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={hourlyRate}
                  onChange={onChange}
                  required
                  min="0"
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
                  Daily Rate (USD) *
                </label>
                <input
                  type="number"
                  name="dailyRate"
                  value={dailyRate}
                  onChange={onChange}
                  required
                  min="0"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Driver Name *
                </label>
                <input
                  type="text"
                  name="driverName"
                  value={driverName}
                  onChange={onChange}
                  required
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
                  Driver Phone *
                </label>
                <input
                  type="tel"
                  name="driverPhone"
                  value={driverPhone}
                  onChange={onChange}
                  required
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

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Service Locations
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                {commonLocations.map(location => (
                  <label key={location} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={locations.includes(location)}
                      onChange={() => onArrayChange('locations', location)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {location}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--light-blue)',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Registering Vehicle...' : 'Register Vehicle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleRegister;