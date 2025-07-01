import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users, Filter, X, Star, Wifi, Car, Coffee, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { HotelService, Hotel } from "@/services/hotelService";
import { useToast } from "@/hooks/use-toast";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchData, setSearchData] = useState({
    location: searchParams.get("location") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "1"
  });
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [isListening, setIsListening] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    amenities: [] as string[],
    rating: 0
  });

  const popularSearches = [
    "Mumbai Hotels", "Delhi Budget Hotels", "Goa Beach Resorts",
    "Bangalore Business Hotels", "Jaipur Heritage Hotels", "Chennai Airport Hotels"
  ];

  const amenitiesList = [
    { name: "Free WiFi", icon: <Wifi className="h-4 w-4" /> },
    { name: "Parking", icon: <Car className="h-4 w-4" /> },
    { name: "Restaurant", icon: <Coffee className="h-4 w-4" /> },
    { name: "AC", icon: <div className="h-4 w-4 rounded bg-blue-500"></div> },
    { name: "Swimming Pool", icon: <div className="h-4 w-4 rounded bg-blue-400"></div> },
    { name: "Gym", icon: <div className="h-4 w-4 rounded bg-gray-600"></div> }
  ];

  // Voice search functionality
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Search Not Supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now to search for hotels",
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchData(prev => ({ ...prev, location: transcript }));
      setIsListening(false);
      
      // Auto-search after voice input
      setTimeout(() => {
        handleSearch();
      }, 500);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
      } catch (error) {
        console.error('Voice recognition start error:', error);
        toast({
          title: "Voice Search Error",
          description: "Could not start voice recognition",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (searchData.location) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchData.location.trim()) return;
    
    setLoading(true);
    try {
      const results = await HotelService.searchHotels({
        location: searchData.location,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        amenities: filters.amenities
      });
      
      // Apply sorting
      const sortedResults = sortHotels(results, sortBy);
      setHotels(sortedResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search hotels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sortHotels = (hotels: Hotel[], sortType: string) => {
    const sorted = [...hotels];
    switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'popularity':
      default:
        return sorted.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
    }
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setHotels(sortHotels(hotels, newSort));
  };

  const handleQuickSearch = (query: string) => {
    const location = query.split(' ')[0];
    setSearchData(prev => ({ ...prev, location }));
    handleSearch();
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 10000,
      amenities: [],
      rating: 0
    });
  };

  const getAmenityIcon = (amenityName: string) => {
    const amenity = amenitiesList.find(a => a.name === amenityName);
    return amenity?.icon || <div className="h-4 w-4 rounded bg-gray-400"></div>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Search Bar */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                  <Input
                    placeholder="Where are you going?"
                    value={searchData.location}
                    onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                    className="pl-10 pr-12 h-12"
                  />
                  {/* Voice Search Button for Location */}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`absolute right-3 top-3 p-1 rounded-full transition-all duration-300 z-20 ${
                      isListening 
                        ? 'text-red-500 bg-red-50 animate-pulse' 
                        : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                    title={isListening ? "Stop listening" : "Voice search"}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                    className="pl-10 h-12"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                    className="pl-10 h-12"
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={searchData.guests}
                    onChange={(e) => setSearchData({...searchData, guests: e.target.value})}
                    className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700 flex-1 h-12">
                  <Search className="h-4 w-4 mr-2" />
                  Search Hotels
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-6"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Voice Recognition Status */}
              {isListening && (
                <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Mic className="h-5 w-5 text-red-500 mr-2 animate-pulse" />
                  <span className="text-red-700 font-medium">Listening... Speak your destination</span>
                </div>
              )}

              {/* Filters */}
              {showFilters && (
                <div className="mt-6 p-6 border-t bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}
                      </label>
                      <div className="space-y-3">
                        <div>
                          <input
                            type="range"
                            min="0"
                            max="10000"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500">Min: ₹{filters.minPrice}</div>
                        </div>
                        <div>
                          <input
                            type="range"
                            min="0"
                            max="10000"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500">Max: ₹{filters.maxPrice}</div>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Amenities</label>
                      <div className="space-y-2">
                        {amenitiesList.map((amenity) => (
                          <div
                            key={amenity.name}
                            onClick={() => toggleAmenity(amenity.name)}
                            className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                              filters.amenities.includes(amenity.name)
                                ? 'bg-red-100 border border-red-300'
                                : 'bg-white border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {amenity.icon}
                            <span className="ml-2 text-sm">{amenity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Minimum Rating</label>
                      <select
                        value={filters.rating}
                        onChange={(e) => setFilters(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        <option value="0">Any Rating</option>
                        <option value="3">3+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Popular Searches */}
        {!searchData.location && !loading && hotels.length === 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-red-50 hover:border-red-200 py-2 px-4"
                    onClick={() => handleQuickSearch(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for hotels...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && hotels.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold">
                {hotels.length} hotels found in {searchData.location}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-all">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      <div className="md:col-span-1">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{hotel.name}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{hotel.location}</span>
                            </div>
                            <div className="flex items-center mb-4">
                              <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="font-semibold text-green-800">{hotel.rating}</span>
                              </div>
                              <span className="text-gray-600 text-sm ml-2">
                                ({hotel.total_reviews} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-6">
                            {hotel.original_price && (
                              <div className="text-gray-500 text-sm line-through">
                                ₹{hotel.original_price}
                              </div>
                            )}
                            <div className="text-3xl font-bold text-red-600">₹{hotel.price}</div>
                            <div className="text-gray-600 text-sm">per night</div>
                            {hotel.discount > 0 && (
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mt-1">
                                {hotel.discount}% OFF
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {hotel.amenities.slice(0, 4).map((amenity) => (
                            <div key={amenity} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                              {getAmenityIcon(amenity)}
                              <span className="ml-1 text-xs text-gray-700">{amenity}</span>
                            </div>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                              +{hotel.amenities.length - 4} more
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-green-600 font-semibold flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Available
                          </span>
                          <div className="space-x-3">
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/hotel/${hotel.id}`)}
                              className="hover:bg-gray-50"
                            >
                              View Details
                            </Button>
                            <Button
                              onClick={() => navigate(`/book/${hotel.id}?checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searchData.location && hotels.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">No hotels found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or explore other destinations
              </p>
              <div className="space-y-3">
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
                <Button onClick={() => navigate("/hotels")} className="w-full bg-red-600 hover:bg-red-700">
                  Browse All Hotels
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;