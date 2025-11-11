const { mockData, nextBookingId, nextReviewId, generateId } = require('./mockData');

class MockDB {
  constructor() {
    this.users = [...mockData.users];
    this.bookings = [...mockData.bookings];
    this.reviews = [...mockData.reviews];
  }

  // User methods
  findUserById(id) {
    return this.users.find(user => user._id === id);
  }

  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  createUser(userData) {
    const user = {
      _id: generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  // Booking methods
  findBookings() {
    return this.bookings.map(booking => ({
      ...booking,
      user: this.findUserById(booking.user)
    }));
  }

  findBookingById(id) {
    const booking = this.bookings.find(b => b._id === id);
    if (booking) {
      return {
        ...booking,
        user: this.findUserById(booking.user)
      };
    }
    return null;
  }

  createBooking(bookingData) {
    const booking = {
      _id: generateId(),
      ...bookingData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookings.push(booking);
    return this.findBookingById(booking._id);
  }

  updateBookingStatus(id, status) {
    const bookingIndex = this.bookings.findIndex(b => b._id === id);
    if (bookingIndex !== -1) {
      this.bookings[bookingIndex].status = status;
      this.bookings[bookingIndex].updatedAt = new Date();
      return this.findBookingById(id);
    }
    return null;
  }

  // Review methods
  findReviews() {
    return this.reviews.map(review => ({
      ...review,
      user: this.findUserById(review.user),
      booking: this.findBookingById(review.booking)
    }));
  }

  findReviewsByUser(userId) {
    return this.reviews
      .filter(review => review.user === userId)
      .map(review => ({
        ...review,
        user: this.findUserById(review.user),
        booking: this.findBookingById(review.booking)
      }));
  }

  findServiceReviews() {
    return this.reviews
      .filter(review => review.isPublic)
      .map(review => ({
        ...review,
        user: this.findUserById(review.user),
        booking: this.findBookingById(review.booking)
      }));
  }

  findReviewByBooking(bookingId) {
    return this.reviews.find(review => review.booking === bookingId);
  }

  createReview(reviewData) {
    const review = {
      _id: generateId(),
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reviews.push(review);
    return this.findReviewById(review._id);
  }

  findReviewById(id) {
    const review = this.reviews.find(r => r._id === id);
    if (review) {
      return {
        ...review,
        user: this.findUserById(review.user),
        booking: this.findBookingById(review.booking)
      };
    }
    return null;
  }

  updateReview(id, updateData) {
    const reviewIndex = this.reviews.findIndex(r => r._id === id);
    if (reviewIndex !== -1) {
      this.reviews[reviewIndex] = {
        ...this.reviews[reviewIndex],
        ...updateData,
        updatedAt: new Date()
      };
      return this.findReviewById(id);
    }
    return null;
  }

  deleteReview(id) {
    const reviewIndex = this.reviews.findIndex(r => r._id === id);
    if (reviewIndex !== -1) {
      this.reviews.splice(reviewIndex, 1);
      return true;
    }
    return false;
  }
}

module.exports = new MockDB();