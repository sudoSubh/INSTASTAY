import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, MapPin, Star, Users, Calendar, SlidersHorizontal, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHotelFilters } from "@/hooks/useHotelFilters";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";

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
  amenities: string[];
  discount?: number;
}

const HotelListing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const { 
    filters, 
    filteredHotels, 
    updateFilter, 
    resetFilters 
  } = useHotelFilters(hotels);
  
  const { 
    isListening, 
    startVoiceSearch 
  } = useVoiceSearch();

  const handleVoiceSearch = () => {
    startVoiceSearch((transcript) => {
      const cleanedTranscript = transcript
                  .replace(/[.,!?;:]/g, '') // Remove punct
                  .replace(/\s+/g, ' ') // Fix spaces
        .trim(); // Trim
      updateFilter('searchQuery', cleanedTranscript);
    });
  };



  useEffect(() => {
    fetchHotels();
  }, []);



  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast({
        title: "Error",
        description: "Failed to load hotels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleHotelClick = (hotelId: string) => {
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    
    navigate(`/hotel/${hotelId}?${params.toString()}`);
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

  const allAmenities = [...new Set(hotels.flatMap(hotel => hotel.amenities))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
              <Input
                placeholder="Search by location or hotel name..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                className="pl-10 pr-16 h-12"
              />
              {/* Voice Search Button - Made more visible */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-3 top-1 p-2 rounded-full transition-all duration-300 z-10 border-2 ${
                  isListening 
                    ? 'text-red-500 bg-red-50 border-red-200 animate-pulse shadow-lg scale-110' 
                    : 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 shadow-md hover:scale-105'
                }`}
                title={isListening ? "Stop listening" : "Voice search"}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>



          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                    max={10000}
                    min={0}
                    step={500}
                    className="w-full custom-slider"
                    />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3">Minimum Rating</label>
                  <Select value={filters.selectedRating} onValueChange={(value) => updateFilter('selectedRating', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any rating</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amenities Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3">Amenities</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {allAmenities.slice(0, 6).map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={filters.selectedAmenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilter('selectedAmenities', [...filters.selectedAmenities, amenity]);
                            } else {
                              updateFilter('selectedAmenities', filters.selectedAmenities.filter(a => a !== amenity));
                            }
                          }}
                        />
                        <label htmlFor={amenity} className="text-sm">{amenity}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredHotels.length} Hotels Found
          </h1>
          {filters.searchQuery && (
            <p className="text-gray-600">
              Showing results for "{filters.searchQuery}"
              {checkIn && checkOut && (
                <span> • {checkIn} to {checkOut}</span>
              )}
              {guests && <span> • {guests} guest{parseInt(guests) > 1 ? 's' : ''}</span>}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <Card 
              key={hotel.id} 
              className="overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
              onClick={() => handleHotelClick(hotel.id)}
            >
              <div className="relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                {hotel.discount && (
                  <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                    {hotel.discount}% OFF
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{hotel.name}</h3>
                  <p className="text-gray-600 text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hotel.location}
                  </p>
                </div>

                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    {renderStars(hotel.rating)}
                  </div>
                  <span className="text-sm font-medium">{hotel.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">
                    ({hotel.total_reviews} reviews)
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{hotel.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {hotel.original_price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{hotel.original_price}
                      </span>
                    )}
                    <div className="text-xl font-bold text-red-600">
                      ₹{hotel.price}
                      <span className="text-sm font-normal text-gray-500">/night</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelListing;