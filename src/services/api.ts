// API Service Layer - Ready for Supabase Integration
// This will be the central place for all API calls

import { supabase } from "@/integrations/supabase/client";

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  amenities: string[];
  description?: string;
  availability?: string;
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Mock API functions - Replace with actual Supabase calls
export const apiService = {
  // Hotel APIs
  async searchHotels(location?: string, checkIn?: string, checkOut?: string, guests?: string): Promise<Hotel[]> {
    console.log('API: Searching hotels', { location, checkIn, checkOut, guests });
    // TODO: Replace with actual Supabase query
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            name: "OYO 123 Premium Hotel",
            location: `Sector 15, ${location || "Mumbai"}`,
            price: 2499,
            originalPrice: 3999,
            rating: 4.2,
            reviews: 128,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
            amenities: ["WiFi", "AC", "TV", "Parking"],
            availability: "Available"
          }
        ]);
      }, 1000);
    });
  },

  async getHotelById(id: string): Promise<Hotel | null> {
    console.log('API: Getting hotel by ID', id);
    // TODO: Replace with actual Supabase query
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id,
          name: "OYO 123 Premium Hotel",
          location: "Sector 15, Mumbai, Maharashtra",
          price: 2499,
          originalPrice: 3999,
          rating: 4.2,
          reviews: 128,
          description: "Experience luxury and comfort at our premium hotel.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"
          ],
          amenities: ["WiFi", "AC", "TV", "Parking"]
        });
      }, 1000);
    });
  },

  // Booking APIs
  async createBooking(bookingData: any): Promise<Booking> {
    console.log('API: Creating booking', bookingData);
    // TODO: Replace with actual Supabase insert
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: `BK${Date.now()}`,
          hotelId: bookingData.hotelId,
          hotelName: "OYO 123 Premium Hotel",
          location: "Mumbai, Maharashtra",
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          status: 'confirmed',
          amount: bookingData.amount,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
        });
      }, 2000);
    });
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    console.log('API: Getting user bookings', userId);
    // TODO: Replace with actual Supabase query
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: "BK001",
            hotelId: "1",
            hotelName: "OYO 123 Premium Hotel",
            location: "Mumbai, Maharashtra",
            checkIn: "2024-07-15",
            checkOut: "2024-07-17",
            guests: 2,
            status: "confirmed",
            amount: 4998,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
          }
        ]);
      }, 1000);
    });
  },

  // Auth APIs
  async login(email: string, password: string): Promise<User> {
    console.log('API: User login', email);
    // TODO: Replace with actual Supabase auth
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: "user123",
          email,
          firstName: "John",
          lastName: "Doe"
        });
      }, 1000);
    });
  },

  async signup(userData: any): Promise<User> {
    console.log('API: User signup', userData);
    // TODO: Replace with actual Supabase auth
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: "user123",
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        });
      }, 1000);
    });
  }
};

// Supabase configuration will go here once connected
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'your-project-url'
// const supabaseKey = 'your-anon-key'
// export const supabase = createClient(supabaseUrl, supabaseKey)

export async function checkOfferRedemption(userId: string, offerCode: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('offer_redemptions')
    .select('*')
    .eq('user_id', userId)
    .eq('offer_code', offerCode)
    .single();
  return !!data;
}

export async function redeemOffer(userId: string, offerCode: string): Promise<boolean> {
  // Try to insert, if unique constraint fails, already redeemed
  const { error } = await supabase
    .from('offer_redemptions')
    .insert([{ user_id: userId, offer_code: offerCode }]);
  if (!error) return true;
  if (error.code === '23505' || error.message.includes('duplicate')) return false;
  throw error;
}
