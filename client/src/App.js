import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import GuideRegister from './pages/GuideRegister';
import VehicleRegister from './pages/VehicleRegister';
import Guides from './pages/Guides';
import Vehicles from './pages/Vehicles';
import BookingsPage from './pages/BookingsPage';
import UserReviews from './pages/UserReviews';
import ServiceReviews from './pages/ServiceReviews';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/become-guide" element={<GuideRegister />} />
            <Route path="/register-vehicle" element={<VehicleRegister />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/my-reviews" element={<UserReviews />} />
            <Route path="/manage-reviews" element={<ServiceReviews />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;