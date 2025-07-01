
import { useState, useEffect } from "react";
import { Star, ThumbsUp, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { reviewService } from "@/services/reviewService";
import { HotelService } from "@/services/hotelService";

interface ReviewWithHotel {
  id: string;
  hotel_id: string;
  hotel_name: string;
  user_id: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<ReviewWithHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const hotels = await HotelService.getAllHotels();
      const allReviews: ReviewWithHotel[] = [];

      for (const hotel of hotels.slice(0, 10)) {
        try {
          const hotelReviews = await reviewService.getHotelReviews(hotel.id);
          const reviewsWithHotel = hotelReviews.map(review => ({
            ...review,
            hotel_name: hotel.name
          }));
          allReviews.push(...reviewsWithHotel);
        } catch (error) {
          console.error(`Error fetching reviews for hotel ${hotel.id}:`, error);
        }
      }

      setReviews(allReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Reviews</h1>
          <p className="text-gray-600">Read what our guests have to say about their stays</p>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {review.hotel_name}
                      </h3>
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating)}
                        <Badge className="ml-2 bg-red-600">
                          {review.rating}/5
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Guest Review
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.comment}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reviewService.updateHelpfulCount(review.id, true)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful ({review.helpful_count})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h2>
            <p className="text-gray-600">Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
