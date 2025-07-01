
import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingRequest, GuestDetails } from "@/types/booking";

export const supabaseBookingService = {
  async createBooking(bookingData: BookingRequest): Promise<Booking> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create a booking');
    }

    // Get hotel details
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', bookingData.hotelId)
      .single();

    if (hotelError || !hotel) {
      throw new Error('Hotel not found');
    }

    // Calculate number of nights
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = hotel.price * nights;

    const bookingToInsert = {
      user_id: user.id,
      hotel_id: bookingData.hotelId,
      hotel_name: hotel.name,
      location: hotel.location,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      guests: bookingData.guests,
      room_type: bookingData.roomType || 'Deluxe',
      amount: totalAmount,
      status: 'confirmed',
      image: hotel.image,
      guest_details: bookingData.guestDetails as any, // Cast to Json type
      payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingToInsert)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }

    return {
      id: data.id,
      hotelId: data.hotel_id,
      hotelName: data.hotel_name,
      location: data.location,
      checkIn: data.check_in,
      checkOut: data.check_out,
      guests: data.guests,
      roomType: data.room_type,
      amount: data.amount,
      status: data.status as Booking['status'],
      paymentId: data.payment_id,
      image: data.image,
      createdAt: data.created_at,
      userId: data.user_id,
      guestDetails: (data.guest_details as unknown as GuestDetails) || {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      roomDetails: {
        view: 'City View',
        bedType: 'King',
        smoking: false,
        wifi: true,
        airConditioning: true,
        minibar: true
      },
      amenities: hotel.amenities || [],
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      loyaltyPoints: Math.floor(totalAmount * 0.1)
    };
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    return (data || []).map(booking => ({
      id: booking.id,
      hotelId: booking.hotel_id,
      hotelName: booking.hotel_name,
      location: booking.location,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      guests: booking.guests,
      roomType: booking.room_type,
      amount: booking.amount,
      status: booking.status as Booking['status'],
      paymentId: booking.payment_id,
      image: booking.image,
      createdAt: booking.created_at,
      userId: booking.user_id,
      guestDetails: (booking.guest_details as unknown as GuestDetails) || {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      roomDetails: {
        view: 'City View',
        bedType: 'King',
        smoking: false,
        wifi: true,
        airConditioning: true,
        minibar: true
      },
      amenities: [],
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      loyaltyPoints: Math.floor(booking.amount * 0.1)
    }));
  },

  async cancelBooking(bookingId: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      throw new Error(`Failed to cancel booking: ${error.message}`);
    }
  }
};
