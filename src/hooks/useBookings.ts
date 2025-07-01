
import { useState, useEffect } from 'react';
import { Booking } from '../types/booking';
import { supabaseBookingService } from '../services/supabaseBookingService';
import { useAuth } from '../contexts/AuthContext';

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (user) {
      try {
        const userBookings = await supabaseBookingService.getUserBookings(user.id);
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setBookings([]);
      }
    } else {
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const cancelBooking = async (bookingId: string) => {
    await supabaseBookingService.cancelBooking(bookingId);
    fetchBookings(); // Refresh bookings
  };

  return {
    bookings,
    loading,
    refetch: fetchBookings,
    cancelBooking
  };
};
