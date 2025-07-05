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





export async function checkOfferRedemption(userId: string, offerCode: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('offer_redemptions')
      .select('*')
      .eq('user_id', userId)
      .eq('offer_code', offerCode)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors
    
    if (error) {
      console.error('Error checking offer redemption:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking offer redemption:', error);
    return false;
  }
}

export async function redeemOffer(userId: string, offerCode: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('offer_redemptions')
      .insert([{ user_id: userId, offer_code: offerCode }]);
    
    if (error) {
      // Check if it's a duplicate key error (already redeemed)
      if (error.code === '23505' || error.message.includes('duplicate')) {
        return false; // Already redeemed
      }
      console.error('Error redeeming offer:', error);
      throw error;
    }
    
    return true; // Successfully redeemed
  } catch (error) {
    console.error('Exception redeeming offer:', error);
    throw error;
  }
}
