import { bookingAPI, reviewAPI } from './api';

export const bookingService = {
  /**
   * Complete a booking and create review eligibility
   */
  completeBooking: async (bookingId) => {
    try {
      console.log('Completing booking:', bookingId);
      
      const response = await bookingAPI.completeBooking(bookingId);
      
      console.log('Booking completion response:', response);
      
      if (response.success) {
        return {
          success: true,
          booking: response.booking,
          reviewEligibility: response.reviewEligibility,
          message: response.message
        };
      } else {
        return {
          success: false,
          error: response.message || 'Failed to complete booking'
        };
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to complete booking'
      };
    }
  },

  /**
   * Check if user can review a booking
   */
  checkReviewEligibility: async (bookingId) => {
    try {
      const response = await reviewAPI.getReviewEligibility(bookingId);
      return {
        success: true,
        eligible: response.eligible,
        reviewEligibility: response.reviewEligibility,
        message: response.message
      };
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to check review eligibility'
      };
    }
  },

  /**
   * Get user's active bookings
   */
  getActiveBookings: async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      return {
        success: true,
        bookings: response.bookings || []
      };
    } catch (error) {
      console.error('Error fetching active bookings:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch bookings'
      };
    }
  },

  /**
   * Get booking details
   */
  getBookingDetails: async (bookingId) => {
    try {
      const response = await bookingAPI.getBooking(bookingId);
      return {
        success: true,
        booking: response.booking
      };
    } catch (error) {
      console.error('Error fetching booking details:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch booking details'
      };
    }
  }
};

export default bookingService;