import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Users, 
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import ReviewCard from "@/components/ReviewCard";
import WriteReviewModal from "@/components/WriteReviewModal";
import { supabase } from "@/integrations/supabase/client";
import { reviewService } from "@/services/reviewService";
import { favoritesService } from "@/services/favoritesService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  original_price?: number;
  rating: number;
  total_reviews: number;
  description: string;
  image: string;
  images: string[];
  amenities: string[];
  discount?: number;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
}

const HotelDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Date selection states
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined
  );
  const [guests, setGuests] = useState(searchParams.get('guests') || '1');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
      fetchReviews();
      checkFavoriteStatus();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setHotel(data);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      toast({
        title: "Error",
        description: "Failed to load hotel details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;
    
    try {
      const reviewsData = await reviewService.getHotelReviews(id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!id || !user) return;
    
    try {
      const isFav = await favoritesService.isFavorite(id);
      setIsFavorited(isFav);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add hotels to your favorites.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      if (isFavorited) {
        await favoritesService.removeFromFavorites(id);
        setIsFavorited(false);
        toast({
          title: "Removed from Favorites",
          description: "Hotel has been removed from your favorites.",
        });
      } else {
        await favoritesService.addToFavorites(id);
        setIsFavorited(true);
        toast({
          title: "Added to Favorites",
          description: "Hotel has been added to your favorites.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update favorites.",
        variant: "destructive",
      });
    }
  };

  const handleCheckInSelect = (date: Date | undefined) => {
    if (date) {
      setCheckInDate(date);
      
      // If check-out is before or same as check-in, clear it
      if (checkOutDate && date >= checkOutDate) {
        setCheckOutDate(undefined);
      }
      
      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      newParams.set('checkIn', format(date, 'yyyy-MM-dd'));
      if (checkOutDate && date < checkOutDate) {
        newParams.set('checkOut', format(checkOutDate, 'yyyy-MM-dd'));
      } else {
        newParams.delete('checkOut');
      }
      setSearchParams(newParams);
      setIsCheckInOpen(false);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    if (date) {
      setCheckOutDate(date);
      
      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      newParams.set('checkOut', format(date, 'yyyy-MM-dd'));
      if (checkInDate) {
        newParams.set('checkIn', format(checkInDate, 'yyyy-MM-dd'));
      }
      setSearchParams(newParams);
      setIsCheckOutOpen(false);
    }
  };

  const handleGuestsChange = (newGuests: string) => {
    setGuests(newGuests);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('guests', newGuests);
    setSearchParams(newParams);
  };

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book this hotel.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const params = new URLSearchParams();
    if (checkInDate) params.set('checkIn', format(checkInDate, 'yyyy-MM-dd'));
    if (checkOutDate) params.set('checkOut', format(checkOutDate, 'yyyy-MM-dd'));
    params.set('guests', guests);
    
    navigate(`/book/${id}?${params.toString()}`);
  };

  const handleNextImage = () => {
    if (hotel && hotel.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === hotel.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (hotel && hotel.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? hotel.images.length - 1 : prev - 1
      );
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      'Free WiFi': Wifi,
      'Parking': Car,
      'Restaurant': Coffee,
      'AC': Users,
      'Gym': Users,
      'Pool': Users,
      'Spa': Users,
    };
    
    const IconComponent = iconMap[amenity] || Users;
    return <IconComponent className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel not found</h1>
          <Button onClick={() => navigate('/hotels')}>Back to Hotels</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
            <img
              src={hotel.images && hotel.images.length > 0 ? hotel.images[currentImageIndex] : hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            
            {hotel.images && hotel.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {hotel.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {hotel.discount && (
              <Badge className="absolute top-4 left-4 bg-red-600 text-white text-lg px-3 py-1">
                {hotel.discount}% OFF
              </Badge>
            )}
            
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFavoriteToggle}
                className="bg-white bg-opacity-90"
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="secondary" size="sm" className="bg-white bg-opacity-90">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hotel Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{hotel.location}</span>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  {renderStars(hotel.rating)}
                  <span className="ml-2 font-semibold">{hotel.rating}</span>
                </div>
                <span className="text-gray-600">
                  {hotel.total_reviews} reviews
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {getAmenityIcon(amenity)}
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    Reviews ({reviews.length})
                  </h3>
                  <Button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Write a Review
                  </Button>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onHelpfulClick={(reviewId) => {
                          reviewService.updateHelpfulCount(reviewId, true);
                        }}
                      />
                    ))}
                    {reviews.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline">View All Reviews</Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No reviews yet. Be the first to review!</p>
                    <Button
                      onClick={() => setShowReviewModal(true)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Write the First Review
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    {hotel.original_price && (
                      <span className="text-lg text-gray-500 line-through mr-2">
                        ₹{hotel.original_price}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-red-600">
                      ₹{hotel.price}
                    </span>
                    <span className="text-gray-600 ml-1">/night</span>
                  </div>
                  {hotel.discount && (
                    <p className="text-green-600 font-medium">
                      Save ₹{(hotel.original_price || 0) - hotel.price} with this deal!
                    </p>
                  )}
                </div>

                <Separator className="mb-6" />

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in
                      </label>
                      <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkInDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkInDate ? format(checkInDate, "MMM dd") : "Select"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkInDate}
                            onSelect={handleCheckInSelect}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out
                      </label>
                      <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkOutDate ? format(checkOutDate, "MMM dd") : "Select"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkOutDate}
                            onSelect={handleCheckOutSelect}
                            disabled={(date) => {
                              if (!checkInDate) return date < new Date();
                              return date <= checkInDate;
                            }}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => handleGuestsChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num.toString()}>
                          {num} guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg font-semibold"
                >
                  Book Now
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Free cancellation up to 24 hours before check-in
                </p>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">+91 63719 33473</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">info@instastay.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        hotelId={hotel.id}
        hotelName={hotel.name}
        onReviewSubmitted={fetchReviews}
      />
    </div>
  );
};

export default HotelDetail;
