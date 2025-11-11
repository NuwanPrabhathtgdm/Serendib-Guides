// Mock data that works without MongoDB
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
    },
    {
      _id: '4',
      user: '657a983b4e5d6c8f9a1b2c3d',
      service: 'Wildlife Safari',
      guide: 'David Brown',
      date: new Date('2024-12-30'),
      duration: 8,
      totalPrice: 250,
      status: 'pending',
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
    },
    {
      _id: '2',
      user: '657a983b4e5d6c8f9a1b2c3d',
      booking: '2',
      service: 'Mountain Hiking',
      guide: 'Mike Chen',
      rating: 4,
      comment: 'Great hike with beautiful views. Mike was very professional and safety-conscious.',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

// Helper functions
let nextBookingId = 5;
let nextReviewId = 3;

const generateId = () => Date.now().toString();

module.exports = {
  mockData,
  nextBookingId,
  nextReviewId,
  generateId
};