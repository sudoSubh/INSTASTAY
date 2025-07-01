
import { supabase } from "@/integrations/supabase/client";

export interface FavoriteHotel {
  id: string;
  user_id: string;
  hotel_id: string;
  hotel_name: string;
  location: string;
  price: number;
  original_price?: number;
  rating: number;
  image: string;
  amenities: string[];
  added_on: string;
  created_at: string;
}

export const favoritesService = {
  async getUserFavorites(): Promise<FavoriteHotel[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    // Get favorites with explicit typing
    const { data: favoritesData, error: favError } = await supabase
      .from('favorites')
      .select('id, user_id, hotel_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (favError) {
      console.error('Error fetching favorites:', favError);
      return [];
    }

    // Get hotel details for each favorite
    const favoriteHotels: FavoriteHotel[] = [];
    for (const fav of favoritesData || []) {
      const { data: hotelData } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', fav.hotel_id)
        .single();

      if (hotelData) {
        favoriteHotels.push({
          id: fav.id,
          user_id: fav.user_id,
          hotel_id: fav.hotel_id,
          hotel_name: hotelData.name || 'Unknown Hotel',
          location: hotelData.location || 'Unknown Location',
          price: hotelData.price || 0,
          original_price: hotelData.original_price,
          rating: hotelData.rating || 0,
          image: hotelData.image || '',
          amenities: hotelData.amenities || [],
          added_on: fav.created_at,
          created_at: fav.created_at
        });
      }
    }
    return favoriteHotels;
  },

  async addToFavorites(hotelId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to add favorites');
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('hotel_id', hotelId)
      .single();

    if (existing) {
      throw new Error('Hotel is already in favorites');
    }

    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        hotel_id: hotelId
      });

    if (error) {
      console.error('Error adding to favorites:', error);
      throw new Error(`Failed to add to favorites: ${error.message}`);
    }
  },

  async removeFromFavorites(hotelId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('hotel_id', hotelId);

    if (error) {
      console.error('Error removing from favorites:', error);
      throw new Error(`Failed to remove from favorites: ${error.message}`);
    }
  },

  async isFavorite(hotelId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('hotel_id', hotelId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking favorite status:', error);
      return false;
    }

    return !!data;
  }
};
