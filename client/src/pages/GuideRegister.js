import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GuideRegister = () => {
  const [formData, setFormData] = useState({
    guideId: '',
    experience: '',
    languages: ['English'],
    specialties: [],
    bio: '',
    hourlyRate: '',
    dailyRate: '',
    locations: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { guideId, experience, languages, specialties, bio, hourlyRate, dailyRate, locations } = formData;

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

  const onLanguageAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      if (!languages.includes(e.target.value)) {
        setFormData({
          ...formData,
          languages: [...languages, e.target.value]
        });
      }
      e.target.value = '';
    }
  };

  const removeLanguage = (language) => {
    setFormData({
      ...formData,
      languages: languages.filter(lang => lang !== language)
    });
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

      const res = await axios.post('http://localhost:5000/api/guides/register', body, config);
      
      setMessage('Guide profile created successfully! Redirecting...');
      
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

  const commonLanguages = ['English', 'Sinhala', 'Tamil', 'Hindi', 'Chinese', 'Japanese', 'Korean', 'French', 'German', 'Spanish'];
  const commonSpecialties = ['History', 'Wildlife', 'Adventure', 'Culture', 'Beaches', 'Trekking', 'Photography', 'Food', 'Religious', 'Ayurveda'];
  const commonLocations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Bentota', 'Mirissa', 'Ella', 'Nuwara Eliya', 'Sigiriya', 'Anuradhapura', 'Polonnaruwa', 'Yala', 'Udawalawe'];

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', color: 'var(--dark-blue)', marginBottom: '2rem' }}>
            Become a Serendib Guide
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Government Guide ID *
                </label>
                <input
                  type="text"
                  name="guideId"
                  value={guideId}
                  onChange={onChange}
                  required
                  placeholder="e.g., SLG2024001"
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
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={experience}
                  onChange={onChange}
                  required
                  min="0"
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
                Languages You Speak *
              </label>
              <div style={{ marginBottom: '0.5rem' }}>
                {languages.map(language => (
                  <span
                    key={language}
                    style={{
                      display: 'inline-block',
                      background: 'var(--light-blue)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      margin: '0.25rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        marginLeft: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type a language and press Enter"
                onKeyPress={onLanguageAdd}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                Common languages: {commonLanguages.join(', ')}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Specialties
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                {commonSpecialties.map(specialty => (
                  <label key={specialty} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={specialties.includes(specialty)}
                      onChange={() => onArrayChange('specialties', specialty)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {specialty}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                About You (Bio)
              </label>
              <textarea
                name="bio"
                value={bio}
                onChange={onChange}
                rows="4"
                placeholder="Tell tourists about your experience, expertise, and what makes your tours special..."
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

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Locations You Cover
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
              {loading ? 'Registering Guide Profile...' : 'Complete Guide Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuideRegister;