export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  amount: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'refunded' | 'checked-in' | 'checked-out' | 'no-show';
  paymentId?: string;
  image: string;
  createdAt: string;
  userId: string;
  specialRequests?: string;
  guestDetails: GuestDetails;
  roomDetails: RoomDetails;
  amenities: string[];
  cancellationPolicy: string;
  loyaltyPoints: number;
  rating?: number;
  review?: string;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality?: string;
  passportNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface RoomDetails {
  roomNumber?: string;
  floor?: number;
  view: string;
  bedType: string;
  smoking: boolean;
  wifi: boolean;
  airConditioning: boolean;
  minibar: boolean;
}

export interface BookingRequest {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  guestDetails: GuestDetails;
  specialRequests?: string;
  promoCode?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  totalReviews: number;
  image: string;
  images: string[];
  description: string;
  amenities: string[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    petPolicy: string;
    smokingPolicy: string;
  };
  rooms: RoomType[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  popularityScore: number;
  nearbyPlaces: NearbyPlace[];
  createdAt: string;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  bedType: string;
  roomSize: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface NearbyPlace {
  name: string;
  distance: string;
  type: 'restaurant' | 'attraction' | 'transport' | 'shopping' | 'hospital';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  hotelId: string;
  bookingId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful: number;
  categories: {
    cleanliness: number;
    service: number;
    location: number;
    value: number;
  };
}

export interface PromoCode {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}
