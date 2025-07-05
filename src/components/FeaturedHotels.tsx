
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Award, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HotelService, Hotel } from "@/services/hotelService";

const FeaturedHotels = () => {
  const navigate = useNavigate();
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        const hotels = await HotelService.getAllHotels();
        setFeaturedHotels(hotels.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured hotels:', error);
        setFeaturedHotels([
          {
            id: "1",
            name: "InstaStay Premium Suites",
            location: "Mumbai, Maharashtra",
            price: 2499,
            rating: 4.2,
            total_reviews: 128,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
            amenities: ["WiFi", "AC", "TV", "Pool"],
            discount: 0,
            description: "Experience luxury and comfort at our premium location with world-class amenities.",
            images: []
          },
          {
            id: "2",
            name: "InstaStay Business Hub",
            location: "Delhi, Delhi",
            price: 3299,
            rating: 4.5,
            total_reviews: 89,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
            amenities: ["WiFi", "AC", "Gym", "Restaurant"],
            discount: 15,
            description: "Perfect for business travelers with modern facilities and premium services.",
            images: []
          },
          {
            id: "3",
            name: "InstaStay Royal Palace",
            location: "Bangalore, Karnataka",
            price: 4199,
            rating: 4.8,
            total_reviews: 156,
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
            amenities: ["WiFi", "AC", "Spa", "Pool", "Restaurant"],
            discount: 25,
            description: "Indulge in royal luxury with exceptional amenities and personalized service.",
            images: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Featured Properties</h2>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading premium properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-6">
          <Crown className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-indigo-700">Premium Collection</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Featured Properties</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover our handpicked selection of premium accommodations, offering exceptional comfort and world-class service
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {featuredHotels.map((hotel, index) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 shadow-xl bg-white group">
            <div className="relative">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center space-x-2 shadow-lg">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-bold text-gray-900">{hotel.rating}</span>
              </div>
              {hotel.discount > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-3 py-2 shadow-lg">
                    {hotel.discount}% OFF
                  </Badge>
                </div>
              )}
              {index === 0 && (
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold px-3 py-2 shadow-lg">
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{hotel.name}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                <span className="text-sm font-medium">{hotel.location}</span>
              </div>
              {hotel.description && (
                <p className="text-gray-600 mb-4 leading-relaxed">{hotel.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-6">
                {hotel.amenities.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity}
                    className="bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-indigo-600">₹{hotel.price}</span>
                    {hotel.discount > 0 && (
                      <span className="text-lg text-gray-400 line-through">₹{Math.round(hotel.price / (1 - hotel.discount / 100))}</span>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm font-medium">per night</span>
                </div>
                <Button
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedHotels;
