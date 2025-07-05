import { Gift, Zap, Calendar, Crown, Clock, Star, Sparkles } from "lucide-react";

export interface Offer {
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

export const offers: Offer[] = [
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

export const categories = [
  { id: "all", name: "All Offers", icon: Gift },
  { id: "flash", name: "Flash Sales", icon: Zap },
  { id: "weekend", name: "Weekend", icon: Calendar },
  { id: "luxury", name: "Luxury", icon: Crown },
  { id: "early-bird", name: "Early Bird", icon: Clock },
  { id: "loyalty", name: "Loyalty", icon: Star },
  { id: "seasonal", name: "Seasonal", icon: Sparkles }
]; 