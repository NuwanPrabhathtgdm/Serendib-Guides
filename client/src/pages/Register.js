import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'tourist'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { name, email, password, phone, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({
        name,
        email,
        password,
        phone,
        role
      });

      const res = await axios.post('http://localhost:5000/api/auth/register', body, config);
      
      setMessage('Registration successful! Redirecting...');
      localStorage.setItem('token', res.data.data.token);
      
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

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', color: 'var(--dark-blue)', marginBottom: '2rem' }}>
            Join Serendib Guides
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
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={name}
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={email}
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
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
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={onChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                I want to join as *
              </label>
              <select
                name="role"
                value={role}
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
                <option value="tourist">Tourist (Looking for services)</option>
                <option value="guide">Tour Guide</option>
                <option value="vehicle-owner">Vehicle Owner</option>
              </select>
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--light-blue)', textDecoration: 'none' }}>
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;