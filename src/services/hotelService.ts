
import { supabase } from "@/integrations/supabase/client";

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  original_price?: number;
  rating: number;
  total_reviews: number;
  description?: string;
  image: string;
  images?: string[];
  amenities: string[];
  discount: number;
  availability?: string;
  created_at?: string;
  updated_at?: string;
}

export class HotelService {
  static async getAllHotels(): Promise<Hotel[]> {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }

    return data || [];
  }

  static async getHotelById(id: string): Promise<Hotel | null> {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching hotel:', error);
      return null;
    }

    return data;
  }

  static async searchHotels(filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
  }): Promise<Hotel[]> {
    let query = supabase.from('hotels').select('*');

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }

    return data || [];
  }

  static async addHotel(hotel: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>): Promise<Hotel> {
    const { data, error } = await supabase
      .from('hotels')
      .insert([hotel])
      .select()
      .single();

    if (error) {
      console.error('Error adding hotel:', error);
      throw error;
    }

    return data;
  }
}
