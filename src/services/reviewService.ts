
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  user_id: string;
  hotel_id: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  images?: string[];
  booking_id?: string;
  user_name?: string;
}

export const reviewService = {
  async getHotelReviews(hotelId: string): Promise<Review[]> {
    try {
      // First get the reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('id, user_id, hotel_id, rating, comment, helpful_count, created_at, images, booking_id')
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        throw new Error(`Failed to fetch reviews: ${reviewsError.message}`);
      }

      if (!reviewsData || reviewsData.length === 0) {
        return [];
      }

      // Get all unique user IDs
      const userIds = [...new Set(reviewsData.map(review => review.user_id))];

      // Fetch all profiles in one query
      let profilesMap: { [key: string]: { first_name?: string; last_name?: string } } = {};
      
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);

        if (!profilesError && profilesData) {
          profilesData.forEach(profile => {
            profilesMap[profile.id] = {
              first_name: profile.first_name,
              last_name: profile.last_name
            };
          });
        }
      } catch (error) {
        console.warn('Failed to fetch profiles, using default names:', error);
      }

      // Map reviews with user names
      const reviewsWithUserNames: Review[] = reviewsData.map(review => {
        const profile = profilesMap[review.user_id];
        const userName = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          : 'Guest User';

        return {
          ...review,
          helpful_count: review.helpful_count || 0,
          images: review.images || [],
          user_name: userName || 'Guest User'
        };
      });

      return reviewsWithUserNames;
    } catch (error) {
      console.error('Error fetching hotel reviews:', error);
      throw error;
    }
  },

  async checkExistingReview(hotelId: string): Promise<Review | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking existing review:', error);
      return null;
    }

    return data;
  },

  async checkUserBookingStatus(hotelId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    // Check if user has any booking for this hotel (not just completed)
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, check_in, check_out, status')
      .eq('hotel_id', hotelId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error checking booking status:', error);
      return false;
    }

    // User must have at least one booking to write a review
    return bookings && bookings.length > 0;
  },

  async createReview(review: {
    hotel_id: string;
    rating: number;
    comment: string;
    booking_id?: string;
  }): Promise<Review> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create a review');
    }

    // Check if user has booked this hotel
    const hasBooking = await this.checkUserBookingStatus(review.hotel_id);
    if (!hasBooking) {
      throw new Error('You can only review hotels that you have booked.');
    }

    // Check if user already reviewed this hotel - UNIQUE REVIEW PER USER
    const existingReview = await this.checkExistingReview(review.hotel_id);
    if (existingReview) {
      throw new Error('You have already reviewed this hotel. Each user can only submit one review per hotel.');
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...review,
        user_id: user.id,
        helpful_count: 0
      })
      .select('id, user_id, hotel_id, rating, comment, helpful_count, created_at, images, booking_id')
      .single();

    if (error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }

    return {
      ...data,
      helpful_count: data.helpful_count || 0,
      images: data.images || []
    };
  },

  async updateHelpfulCount(reviewId: string, increment: boolean): Promise<void> {
    const { data: currentReview, error: fetchError } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch current helpful count:', fetchError);
      return;
    }

    const newCount = Math.max(0, (currentReview.helpful_count || 0) + (increment ? 1 : -1));

    const { error } = await supabase
      .from('reviews')
      .update({ helpful_count: newCount })
      .eq('id', reviewId);

    if (error) {
      console.error('Failed to update helpful count:', error);
    }
  },

  async getReviewStats(hotelId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('hotel_id', hotelId);

    if (error) {
      throw new Error(`Failed to fetch review stats: ${error.message}`);
    }

    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews?.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    };
  }
};
