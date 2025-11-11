import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover the Island of Jewels</h1>
          <div className="hero-subtitle">Serendib Guides</div>
          <p>
            Connect directly with verified local guides and vehicle services. 
            Experience the real Sri Lanka through the eyes of those who know it best.
          </p>
          <div className="cta-buttons">
            <Link to="/guides" className="btn-white">
              Find a Guide
            </Link>
            <Link to="/vehicles" className="btn-outline">
              Find a Vehicle
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Serendib Guides?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Verified Professionals</h3>
              <p>
                All guides and drivers are verified with official IDs and background checks 
                for your safety and peace of mind.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Real Reviews</h3>
              <p>
                Read genuine reviews from fellow travelers and share your own experiences 
                to help others choose the best services.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Direct Communication</h3>
              <p>
                Communicate directly with service providers to create personalized 
                Sri Lankan experiences tailored to your interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="features" style={{background: '#f8fafc'}}>
        <div className="container">
          <h2 className="section-title">The Meaning Behind Our Name</h2>
          <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
            <p style={{fontSize: '1.2rem', lineHeight: '1.8', color: '#666', marginBottom: '2rem'}}>
              <strong style={{color: 'var(--dark-blue)'}}>"Serendib"</strong> is the ancient Arabic and Persian name for Sri Lanka, meaning 
              <em style={{color: 'var(--ocean-blue)'}}> "island of jewels"</em>. This name was popularized in the West through the Persian fairy tale 
              "The Three Princes of Serendip", which gave us the word <strong style={{color: 'var(--dark-blue)'}}>"serendipity"</strong>.
            </p>
            <p style={{fontSize: '1.2rem', lineHeight: '1.8', color: '#666'}}>
              Just like the princes who made fortunate discoveries by chance, we hope your journey with 
              Serendib Guides leads to wonderful, unexpected experiences in beautiful Sri Lanka.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;