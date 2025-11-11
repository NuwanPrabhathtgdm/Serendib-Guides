import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#2c3e50', padding: '1rem', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ margin: 0 }}>Serendib Guides</h2>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          <a href="/guides" style={{ color: 'white', textDecoration: 'none' }}>Guides</a>
          <a href="/vehicles" style={{ color: 'white', textDecoration: 'none' }}>Vehicles</a>
          <a href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;