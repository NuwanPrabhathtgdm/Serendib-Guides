const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
require('./models/User');
require('./models/Guide');
require('./models/Vehicle');
require('./models/Review');
require('./models/Booking');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.log('❌ MongoDB connection error:', error.message);
  }
};

connectDB();

// Basic route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to Serendib Guides API!',
    version: '1.0.0'
  });
});

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/guides', require('./routes/guides'));
app.use('/api/vehicles', require('./routes/vehicles'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});