
import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  images?: string[];
  user_name?: string;
}

interface ReviewCardProps {
  review: Review;
  onHelpfulClick?: (reviewId: string) => void;
}

const ReviewCard = ({ review, onHelpfulClick }: ReviewCardProps) => {
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpfulClick = () => {
    setIsHelpful(!isHelpful);
    onHelpfulClick?.(review.id);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get initials from user name
  const getInitials = (userName?: string) => {
    if (userName && userName !== 'Anonymous User') {
      return userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return 'GU';
  };

  const displayName = review.user_name || 'Guest User';

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold">
              {getInitials(review.user_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900 text-lg">{displayName}</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600 ml-2">({review.rating}/5)</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed text-base">{review.comment}</p>
            
            {review.images && review.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelpfulClick}
                className={`flex items-center space-x-1 hover:bg-gray-100 ${
                  isHelpful ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${isHelpful ? "fill-current" : ""}`} />
                <span>Helpful ({review.helpful_count || 0})</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
