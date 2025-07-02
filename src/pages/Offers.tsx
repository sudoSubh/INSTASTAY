import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tag, 
  Calendar, 
  MapPin, 
  Star, 
  Clock, 
  Users,
  Gift,
  Percent,
  TrendingUp,
  Sparkles,
  Crown,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { checkOfferRedemption, redeemOffer } from "@/services/api";
import { useAuth } from "../contexts/AuthContext";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  code: string;
  category: "weekend" | "early-bird" | "luxury" | "flash" | "loyalty" | "seasonal";
  minStay?: number;
  locations?: string[];
  image: string;
  terms: string[];
  featured?: boolean;
}

const Offers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Helper functions for localStorage offer redemption
  const getRedeemedOffers = () => {
    const redeemed = localStorage.getItem('redeemedOffers');
    return redeemed ? JSON.parse(redeemed) : [];
  };

  const addRedeemedOffer = (code: string) => {
    const redeemed = getRedeemedOffers();
    if (!redeemed.includes(code)) {
      redeemed.push(code);
      localStorage.setItem('redeemedOffers', JSON.stringify(redeemed));
    }
  };

  const offers: Offer[] = [
    {
      id: "1",
      title: "Weekend Luxury Escape",
      description: "Experience premium comfort with complimentary breakfast and spa access",
      discount: 35,
      validUntil: "2024-07-31",
      code: "WEEKEND35",
      category: "weekend",
      minStay: 2,
      locations: ["Mumbai", "Delhi", "Bangalore"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      terms: ["Valid for weekend bookings only", "Minimum 2 nights stay", "Cannot be combined with other offers"],
      featured: true
    },
    {
      id: "2",
      title: "Early Bird Special",
      description: "Book 30 days in advance and enjoy massive savings on premium properties",
      discount: 50,
      validUntil: "2024-08-15",
      code: "EARLY50",
      category: "early-bird",
      image: "https://images.unsplash.com/photo-1661016630713-67e36bfc2285?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWwlMjBvdXRzaWRlfGVufDB8fDB8fHww?w=800&h=600&fit=crop",
      terms: ["Book 30 days in advance", "Valid for select properties", "Non-refundable booking"],
      featured: true
    },
    {
      id: "3",
      title: "Flash Sale - Limited Time",
      description: "Grab this lightning deal before it's gone! Premium stays at unbeatable prices",
      discount: 60,
      validUntil: "2024-06-30",
      code: "FLASH60",
      category: "flash",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
      terms: ["Limited time offer", "Valid till stocks last", "Instant booking required"],
      featured: true
    },
    {
      id: "4",
      title: "Luxury Suite Experience",
      description: "Indulge in our finest suites with personalized service and exclusive amenities",
      discount: 25,
      validUntil: "2024-09-30",
      code: "LUXURY25",
      category: "luxury",
      minStay: 3,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      terms: ["Luxury properties only", "Minimum 3 nights stay", "Complimentary upgrades subject to availability"]
    },
    {
      id: "5",
      title: "Loyalty Rewards Program",
      description: "Exclusive benefits for our valued returning guests with additional perks",
      discount: 20,
      validUntil: "2024-12-31",
      code: "LOYAL20",
      category: "loyalty",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      terms: ["Valid for returning customers", "Additional loyalty points", "Stackable with seasonal offers"]
    },
    {
      id: "6",
      title: "Monsoon Special",
      description: "Cozy up during the rains with special discounts and complimentary amenities",
      discount: 40,
      validUntil: "2024-09-15",
      code: "MONSOON40",
      category: "seasonal",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop",
      terms: ["Valid during monsoon season", "Complimentary hot beverages", "Rain-proof activity suggestions included"]
    }
  ];

  const categories = [
    { id: "all", name: "All Offers", icon: Gift },
    { id: "flash", name: "Flash Sales", icon: Zap },
    { id: "weekend", name: "Weekend", icon: Calendar },
    { id: "luxury", name: "Luxury", icon: Crown },
    { id: "early-bird", name: "Early Bird", icon: Clock },
    { id: "loyalty", name: "Loyalty", icon: Star },
    { id: "seasonal", name: "Seasonal", icon: Sparkles }
  ];

  const filteredOffers = selectedCategory === "all" 
    ? offers 
    : offers.filter(offer => offer.category === selectedCategory);

  const featuredOffers = offers.filter(offer => offer.featured);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "weekend": return Calendar;
      case "early-bird": return Clock;
      case "luxury": return Crown;
      case "flash": return Zap;
      case "loyalty": return Star;
      case "seasonal": return Sparkles;
      default: return Gift;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "weekend": return "bg-blue-100 text-blue-700";
      case "early-bird": return "bg-green-100 text-green-700";
      case "luxury": return "bg-purple-100 text-purple-700";
      case "flash": return "bg-red-100 text-red-700";
      case "loyalty": return "bg-yellow-100 text-yellow-700";
      case "seasonal": return "bg-indigo-100 text-indigo-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleOfferClick = async (offer: Offer) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to redeem offers.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Check with backend if offer already redeemed
    try {
      const alreadyRedeemed = await checkOfferRedemption(user.id, offer.code);
      if (alreadyRedeemed) {
        toast({
          title: "Offer Already Used",
          description: `You have already used the offer code "${offer.code}". Each offer can only be used once per user.`,
          variant: "destructive",
        });
        return;
      }
      // Try to redeem offer
      const success = await redeemOffer(user.id, offer.code);
      if (!success) {
        toast({
          title: "Offer Already Used",
          description: `You have already used the offer code "${offer.code}". Each offer can only be used once per user.`,
          variant: "destructive",
        });
        return;
      }
      // Copy the offer code to clipboard
      navigator.clipboard.writeText(offer.code).then(() => {
        toast({
          title: "Offer Code Copied!",
          description: `Code "${offer.code}" has been copied to your clipboard. Redirecting to hotels...`,
        });
      });
      // Redirect to hotels page with the offer code pre-applied
      setTimeout(() => {
        navigate(`/hotels?offer=${offer.code}`);
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem redeeming the offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-6">
            <Percent className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-indigo-700">Exclusive Offers</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Unbeatable Deals Await
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover incredible savings on premium accommodations. From flash sales to loyalty rewards, 
            find the perfect deal for your next luxurious getaway.
          </p>
        </div>

        {/* Featured Offers */}
        {featuredOffers.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Deals</h2>
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">Hot</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredOffers.map((offer) => {
                const CategoryIcon = getCategoryIcon(offer.category);
                return (
                  <Card key={offer.id} className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="relative">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg px-4 py-2">
                          {offer.discount}% OFF
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className={`p-2 rounded-full ${getCategoryColor(offer.category)}`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{offer.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{offer.description}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Promo Code:</span>
                          <Badge variant="outline" className="font-mono font-bold">{offer.code}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Valid Until:</span>
                          <span className="text-sm font-semibold text-gray-900">{offer.validUntil}</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => handleOfferClick(offer)}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Claim This Offer
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffers.map((offer) => {
            const CategoryIcon = getCategoryIcon(offer.category);
            return (
              <Card key={offer.id} className="overflow-hidden shadow-lg border-0 bg-white hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <div className="relative">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-4 py-2">
                      {offer.discount}% OFF
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className={`p-2 rounded-full ${getCategoryColor(offer.category)} backdrop-blur-sm`}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                  </div>
                  {offer.featured && (
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{offer.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{offer.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Code:</span>
                      <Badge variant="outline" className="font-mono font-bold">{offer.code}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Valid Until:</span>
                      <span className="text-sm font-semibold">{offer.validUntil}</span>
                    </div>
                    {offer.minStay && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Min Stay:</span>
                        <span className="text-sm font-semibold">{offer.minStay} nights</span>
                      </div>
                    )}
                    {offer.locations && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Locations:</span>
                        <span className="text-sm font-semibold">{offer.locations.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    onClick={() => handleOfferClick(offer)}
                  >
                    <Tag className="w-4 mr-2" />
                    Use This Offer
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOffers.length === 0 && (
          <div className="text-center py-16">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No offers found</h3>
            <p className="text-gray-600 mb-8">Try selecting a different category or check back later for new deals.</p>
            <Button 
              onClick={() => setSelectedCategory("all")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              View All Offers
            </Button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl p-12 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Never Miss a Deal</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive offers, flash sales, and premium deals.
          </p>
          <Button 
            size="lg"
            className="bg-white text-indigo-200 hover:bg-gray-100 font-semibold px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Offers;
