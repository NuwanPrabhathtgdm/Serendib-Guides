const express = require('express');
const cors = require('cors');

// Mock database data
const mockData = {
  users: [
    {
      _id: '657a983b4e5d6c8f9a1b2c3d',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    }
  ],
  bookings: [
    {
      _id: '1',
      user: '657a983b4e5d6c8f9a1b2c3d',
      service: 'Cultural Tour',
      guide: 'Sarah Johnson',
      date: new Date('2024-12-15'),
      duration: 4,
      totalPrice: 120,
      status: 'completed',
      specialRequests: 'Vegetarian lunch preferred',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '2',
      user: '657a983b4e5d6c8f9a1b2c3d',
      service: 'Mountain Hiking',
      guide: 'Mike Chen',
      date: new Date('2024-12-20'),
      duration: 6,
      totalPrice: 180,
      status: 'completed',
      specialRequests: 'Need hiking poles',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '3',
      user: '657a983b4e5d6c8f9a1b2c3d',
      service: 'City Walk',
      guide: 'Emma Wilson',
      date: new Date('2024-12-25'),
      duration: 3,
      totalPrice: 90,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  reviews: [
    {
      _id: '1',
      user: '657a983b4e5d6c8f9a1b2c3d',
      booking: '1',
      service: 'Cultural Tour',
      guide: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing tour! Sarah was very knowledgeable about local history and culture. Highly recommended!',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

console.log('✅ Mock Database Connected - No MongoDB required');

// Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working with Mock Database!', 
    timestamp: new Date(),
    database: 'MockDB (No MongoDB required)'
  });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json(mockData.bookings.map(booking => ({
    ...booking,
    user: mockData.users.find(u => u._id === booking.user)
  })));
});

// Complete booking
app.put('/api/bookings/:id/complete', (req, res) => {
  const booking = mockData.bookings.find(b => b._id === req.params.id);
  if (booking) {
    booking.status = 'completed';
    booking.updatedAt = new Date();
    res.json(booking);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
});

// Check if booking can be reviewed
app.get('/api/bookings/:id/can-review', (req, res) => {
  const booking = mockData.bookings.find(b => b._id === req.params.id);
  const existingReview = mockData.reviews.find(r => r.booking === req.params.id);
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const canReview = booking.status === 'completed' && !existingReview;
  res.json({ canReview, booking });
});

// Get user reviews
app.get('/api/reviews/my-reviews', (req, res) => {
  const userReviews = mockData.reviews
    .filter(review => review.user === '657a983b4e5d6c8f9a1b2c3d')
    .map(review => ({
      ...review,
      user: mockData.users.find(u => u._id === review.user),
      booking: mockData.bookings.find(b => b._id === review.booking)
    }));
  res.json(userReviews);
});

// Get service reviews
app.get('/api/reviews/service-reviews', (req, res) => {
  const serviceReviews = mockData.reviews
    .filter(review => review.isPublic)
    .map(review => ({
      ...review,
      user: mockData.users.find(u => u._id === review.user),
      booking: mockData.bookings.find(b => b._id === review.booking)
    }));
  res.json(serviceReviews);
});

// Create review
app.post('/api/reviews', (req, res) => {
  const { bookingId, rating, comment, service, guide } = req.body;
  
  const booking = mockData.bookings.find(b => b._id === bookingId);
  if (!booking || booking.status !== 'completed') {
    return res.status(400).json({ message: 'Cannot review this booking' });
  }

  const existingReview = mockData.reviews.find(r => r.booking === bookingId);
  if (existingReview) {
    return res.status(400).json({ message: 'Review already exists for this booking' });
  }

  const newReview = {
    _id: Date.now().toString(),
    user: '657a983b4e5d6c8f9a1b2c3d',
    booking: bookingId,
    service,
    guide,
    rating,
    comment,
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockData.reviews.push(newReview);
  
  const createdReview = {
    ...newReview,
    user: mockData.users.find(u => u._id === newReview.user),
    booking: mockData.bookings.find(b => b._id === newReview.booking)
  };

  res.status(201).json(createdReview);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'mock',
    bookings: mockData.bookings.length,
    reviews: mockData.reviews.length,
    users: mockData.users.length
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`🗄️  Using Mock Database - No MongoDB installation needed`);
  console.log(`🔗 API Test: http://localhost:${PORT}/api/test`);
});