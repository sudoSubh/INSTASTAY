
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin, Trash2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { favoritesService, FavoriteHotel } from "@/services/favoritesService";
import { useToast } from "@/hooks/use-toast";

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const userFavorites = await favoritesService.getUserFavorites();
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (hotelId: string) => {
    try {
      await favoritesService.removeFromFavorites(hotelId);
      setFavorites(prev => prev.filter(hotel => hotel.hotel_id !== hotelId));
      toast({
        title: "Removed",
        description: "Hotel removed from favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

  const clearAllFavorites = async () => {
    try {
      const promises = favorites.map(hotel => favoritesService.removeFromFavorites(hotel.hotel_id));
      await Promise.all(promises);
      setFavorites([]);
      toast({
        title: "Cleared",
        description: "All favorites have been removed",
      });
    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast({
        title: "Error",
        description: "Failed to clear favorites",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  const handleBookNow = (hotelId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book a hotel",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate(`/book/${hotelId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-auto animate-scale-in">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-6 w-24 h-24 mx-auto mb-6 animate-pulse">
              <Heart className="h-12 w-12 text-white mx-auto" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Please Login to View Favorites
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Sign in to save and manage your favorite hotels
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Login Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-48 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 animate-pulse">
            <Heart className="h-12 w-12 text-white mx-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Favorites
          </h1>
          <p className="text-gray-600 text-lg">
            {favorites.length} {favorites.length === 1 ? 'hotel' : 'hotels'} saved to your wishlist
          </p>
        </div>

        <div className="flex justify-between items-center mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg border border-purple-100">
            <p className="text-sm text-gray-500">Total Favorites</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {favorites.length}
            </p>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFavorites}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-full px-6 py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 animate-scale-in">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-auto">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                <Heart className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">No Favorites Yet</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start adding hotels to your favorites to see them here
              </p>
              <Button
                onClick={() => navigate("/hotels")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Browse Hotels
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((hotel, index) => (
              <Card key={hotel.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.hotel_name}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => removeFavorite(hotel.hotel_id)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                  >
                    <Heart className="h-5 w-5 text-red-600 fill-current" />
                  </button>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-1 shadow-lg">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">{hotel.rating}</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                    {hotel.hotel_name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {hotel.amenities?.slice(0, 2).map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities?.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                        +{hotel.amenities.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      {hotel.original_price && (
                        <span className="text-gray-400 text-sm line-through block">
                          ₹{hotel.original_price.toLocaleString()}
                        </span>
                      )}
                      <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{hotel.price.toLocaleString()}
                      </div>
                      <span className="text-gray-500 text-sm">per night</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-6 bg-gray-50 px-3 py-2 rounded-lg">
                    Added on {new Date(hotel.added_on).toLocaleDateString()}
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleViewDetails(hotel.hotel_id)}
                      variant="outline"
                      className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleBookNow(hotel.hotel_id)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
