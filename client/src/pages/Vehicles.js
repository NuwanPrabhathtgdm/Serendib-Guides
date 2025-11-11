import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookingForm from '../components/BookingForm';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    vehicleType: '',
    location: '',
    minCapacity: '',
    maxRate: ''
  });
  // Add these two lines for booking
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(res.data.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    return (
      (!filters.vehicleType || vehicle.vehicleType === filters.vehicleType) &&
      (!filters.location || vehicle.locations.includes(filters.location)) &&
      (!filters.minCapacity || vehicle.capacity >= parseInt(filters.minCapacity)) &&
      (!filters.maxRate || vehicle.hourlyRate <= parseInt(filters.maxRate))
    );
  });

  const vehicleTypeLabels = {
    car: 'Car',
    van: 'Van',
    suv: 'SUV',
    tuktuk: 'TukTuk',
    bus: 'Bus'
  };

  const allLocations = [...new Set(vehicles.flatMap(vehicle => vehicle.locations))].sort();

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Loading vehicles...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ color: 'var(--dark-blue)', marginBottom: '2rem', textAlign: 'center' }}>
          Find Your Perfect Vehicle
        </h1>

        {/* Filters */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--dark-blue)' }}>Filter Vehicles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Vehicle Type</label>
              <select
                value={filters.vehicleType}
                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                <option value="">All Types</option>
                {Object.entries(vehicleTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                <option value="">All Locations</option>
                {allLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Min Capacity</label>
              <input
                type="number"
                value={filters.minCapacity}
                onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
                min="1"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Max Hourly Rate ($)</label>
              <input
                type="number"
                value={filters.maxRate}
                onChange={(e) => setFilters({ ...filters, maxRate: e.target.value })}
                min="0"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
          Found {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
        </div>

        {/* Vehicles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {filteredVehicles.map(vehicle => (
            <div key={vehicle._id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }} className="card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--dark-blue)', margin: 0 }}>
                  {vehicleTypeLabels[vehicle.vehicleType]} • {vehicle.vehicleModel}
                </h3>
                <div style={{
                  background: 'var(--light-blue)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {vehicle.capacity} seats
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  <strong>Driver:</strong> {vehicle.driverName} • {vehicle.driverPhone}
                </div>
                <div style={{ color: '#6b7280' }}>
                  <strong>Year:</strong> {vehicle.vehicleYear} • <strong>Plate:</strong> {vehicle.licensePlate}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {vehicle.amenities.map(amenity => (
                    <span key={amenity} style={{
                      background: 'var(--sky-blue)',
                      color: 'var(--dark-blue)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {amenity.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Service Areas</div>
                  <div style={{ fontWeight: '500' }}>{vehicle.locations.join(', ')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Rates</div>
                  <div style={{ fontWeight: '500' }}>${vehicle.hourlyRate}/hr • ${vehicle.dailyRate}/day</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#f59e0b', marginRight: '0.25rem' }}>⭐</span>
                  <span style={{ fontWeight: '500' }}>{vehicle.rating || 'New'}</span>
                  {vehicle.totalReviews > 0 && (
                    <span style={{ color: '#6b7280', marginLeft: '0.25rem' }}>
                      ({vehicle.totalReviews} review{vehicle.totalReviews !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedService({
                      id: vehicle._id,
                      type: 'vehicle',
                      name: `${vehicleTypeLabels[vehicle.vehicleType]} • ${vehicle.vehicleModel}`
                    });
                    setShowBookingForm(true);
                  }}
                  style={{
                    background: 'var(--light-blue)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'var(--ocean-blue)'}
                  onMouseOut={(e) => e.target.style.background = 'var(--light-blue)'}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <h3>No vehicles found matching your criteria</h3>
            <p>Try adjusting your filters or check back later for new vehicles.</p>
          </div>
        )}

        {/* Add this section for booking form */}
        {showBookingForm && selectedService && (
          <BookingForm
            serviceType={selectedService.type}
            serviceId={selectedService.id}
            serviceName={selectedService.name}
            onClose={() => {
              setShowBookingForm(false);
              setSelectedService(null);
            }}
            onSuccess={() => {
              // Refresh data or show success message
              fetchVehicles(); // Refresh the vehicles list
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Vehicles;