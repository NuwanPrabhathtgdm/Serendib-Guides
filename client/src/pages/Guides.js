import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookingForm from '../components/BookingForm';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minExperience: '',
    maxRate: '',
    language: '',
    specialty: ''
  });
  // Add these two lines for booking
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/guides');
      setGuides(res.data.data);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter(guide => {
    return (
      (!filters.location || guide.locations.includes(filters.location)) &&
      (!filters.minExperience || guide.experience >= parseInt(filters.minExperience)) &&
      (!filters.maxRate || guide.hourlyRate <= parseInt(filters.maxRate)) &&
      (!filters.language || guide.languages.includes(filters.language)) &&
      (!filters.specialty || guide.specialties.includes(filters.specialty))
    );
  });

  const allLocations = [...new Set(guides.flatMap(guide => guide.locations))].sort();
  const allLanguages = [...new Set(guides.flatMap(guide => guide.languages))].sort();
  const allSpecialties = [...new Set(guides.flatMap(guide => guide.specialties))].sort();

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Loading guides...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ color: 'var(--dark-blue)', marginBottom: '2rem', textAlign: 'center' }}>
          Find Your Perfect Guide
        </h1>

        {/* Filters */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--dark-blue)' }}>Filter Guides</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Min Experience (Years)</label>
              <input
                type="number"
                value={filters.minExperience}
                onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                min="0"
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

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                <option value="">All Languages</option>
                {allLanguages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Specialty</label>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                <option value="">All Specialties</option>
                {allSpecialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
          Found {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''}
        </div>

        {/* Guides Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {filteredGuides.map(guide => (
            <div key={guide._id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }} className="card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--dark-blue)', margin: 0 }}>{guide.user?.name}</h3>
                <div style={{
                  background: 'var(--light-blue)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {guide.experience}+ years
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {guide.languages.map(language => (
                    <span key={language} style={{
                      background: 'var(--sky-blue)',
                      color: 'var(--dark-blue)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {language}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {guide.specialties.map(specialty => (
                    <span key={specialty} style={{
                      background: '#f3f4f6',
                      color: '#4b5563',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>
                {guide.bio || 'Experienced tour guide ready to show you the best of Sri Lanka.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Locations</div>
                  <div style={{ fontWeight: '500' }}>{guide.locations.join(', ')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Rates</div>
                  <div style={{ fontWeight: '500' }}>${guide.hourlyRate}/hr • ${guide.dailyRate}/day</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#f59e0b', marginRight: '0.25rem' }}>⭐</span>
                  <span style={{ fontWeight: '500' }}>{guide.rating || 'New'}</span>
                  {guide.totalReviews > 0 && (
                    <span style={{ color: '#6b7280', marginLeft: '0.25rem' }}>
                      ({guide.totalReviews} review{guide.totalReviews !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedService({
                      id: guide._id,
                      type: 'guide',
                      name: guide.user?.name
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

        {filteredGuides.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <h3>No guides found matching your criteria</h3>
            <p>Try adjusting your filters or check back later for new guides.</p>
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
              fetchGuides(); // Refresh the guides list
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Guides;