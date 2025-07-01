import { Booking, Hotel, BookingRequest, Review } from '../types/booking';
import { SearchService } from './searchService';

export class BookingService {
  private static readonly BOOKINGS_KEY = 'oyoBookings';
  private static readonly HOTELS_KEY = 'oyoHotels';
  private static readonly REVIEWS_KEY = 'oyoReviews';

  static getHotels(): Hotel[] {
    const stored = localStorage.getItem(this.HOTELS_KEY);
    if (stored) return JSON.parse(stored);

    // Mock data with all required properties
    const mockHotels: Hotel[] = [
      {
        id: "1",
        name: "OYO 123 Premium Hotel",
        location: "Sector 15, Mumbai",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",
        price: 2499,
        originalPrice: 3999,
        discount: 37,
        rating: 4.2,
        totalReviews: 128,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"
        ],
        description: "Experience luxury and comfort at OYO 123 Premium Hotel. Located in the heart of Mumbai, this hotel offers modern amenities and exceptional service.",
        amenities: ["Free WiFi", "AC", "TV", "Parking", "Room Service", "Laundry", "24/7 Reception"],
        policies: {
          checkIn: "2:00 PM",
          checkOut: "12:00 PM",
          cancellation: "Free cancellation up to 24 hours before check-in",
          petPolicy: "Pets not allowed",
          smokingPolicy: "No smoking"
        },
        rooms: [
          {
            id: "1-deluxe",
            name: "Deluxe Room",
            description: "Spacious room with city view",
            price: 2499,
            maxGuests: 2,
            bedType: "Queen",
            roomSize: 250,
            amenities: ["AC", "TV", "WiFi", "Minibar"],
            images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"],
            available: true
          }
        ],
        coordinates: { lat: 19.0760, lng: 72.8777 },
        isActive: true,
        popularityScore: 85,
        nearbyPlaces: [
          { name: "Gateway of India", distance: "2.5 km", type: "attraction" },
          { name: "Chhatrapati Shivaji Terminus", distance: "1.8 km", type: "transport" }
        ],
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        id: "2",
        name: "OYO 456 Business Hotel",
        location: "Central Plaza, Delhi",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        pincode: "110001",
        price: 1899,
        originalPrice: 2899,
        discount: 34,
        rating: 4.0,
        totalReviews: 89,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
        ],
        description: "Perfect for business travelers, OYO 456 offers modern facilities and convenient location in Delhi's business district.",
        amenities: ["Free WiFi", "Parking", "Breakfast", "Gym", "Business Center", "Conference Room"],
        policies: {
          checkIn: "3:00 PM",
          checkOut: "11:00 AM",
          cancellation: "Free cancellation up to 48 hours before check-in",
          petPolicy: "Pets allowed with additional charges",
          smokingPolicy: "Designated smoking areas"
        },
        rooms: [
          {
            id: "2-executive",
            name: "Executive Room",
            description: "Business-friendly room with work desk",
            price: 1899,
            maxGuests: 3,
            bedType: "King",
            roomSize: 300,
            amenities: ["AC", "TV", "WiFi", "Work Desk", "Coffee Maker"],
            images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop"],
            available: true
          }
        ],
        coordinates: { lat: 28.7041, lng: 77.1025 },
        isActive: true,
        popularityScore: 78,
        nearbyPlaces: [
          { name: "India Gate", distance: "3.2 km", type: "attraction" },
          { name: "New Delhi Railway Station", distance: "2.1 km", type: "transport" }
        ],
        createdAt: new Date('2024-01-15').toISOString()
      },
      {
        id: "3",
        name: "OYO 789 Comfort Stay",
        location: "IT Corridor, Bangalore",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        pincode: "560001",
        price: 1599,
        originalPrice: 2199,
        discount: 27,
        rating: 4.5,
        totalReviews: 156,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
        ],
        description: "Modern hotel in Bangalore's IT hub, perfect for tech professionals and business travelers.",
        amenities: ["Free WiFi", "AC", "Room Service", "Laundry", "Restaurant", "Bar"],
        policies: {
          checkIn: "2:00 PM",
          checkOut: "12:00 PM",
          cancellation: "Free cancellation up to 24 hours before check-in",
          petPolicy: "Pets not allowed",
          smokingPolicy: "No smoking"
        },
        rooms: [
          {
            id: "3-comfort",
            name: "Comfort Room",
            description: "Comfortable room with modern amenities",
            price: 1599,
            maxGuests: 2,
            bedType: "Queen",
            roomSize: 220,
            amenities: ["AC", "TV", "WiFi", "Room Service"],
            images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop"],
            available: true
          }
        ],
        coordinates: { lat: 12.9716, lng: 77.5946 },
        isActive: true,
        popularityScore: 92,
        nearbyPlaces: [
          { name: "Electronic City", distance: "5.2 km", type: "attraction" },
          { name: "Bangalore City Railway Station", distance: "8.1 km", type: "transport" }
        ],
        createdAt: new Date('2024-02-01').toISOString()
      }
    ];

    localStorage.setItem(this.HOTELS_KEY, JSON.stringify(mockHotels));
    return mockHotels;
  }

  static getHotelById(id: string): Hotel | null {
    const hotels = this.getHotels();
    return hotels.find(hotel => hotel.id === id) || null;
  }

  static getUserBookings(userId: string): Booking[] {
    const bookings = this.getAllBookings();
    return bookings.filter(booking => booking.userId === userId);
  }

  static getAllBookings(): Booking[] {
    const stored = localStorage.getItem(this.BOOKINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static createBooking(bookingRequest: BookingRequest, userId: string): Booking {
    const hotel = this.getHotelById(bookingRequest.hotelId);
    if (!hotel) throw new Error('Hotel not found');

    const booking: Booking = {
      id: `BK${Math.random().toString(36).substr(2, 9)}`,
      hotelId: bookingRequest.hotelId,
      hotelName: hotel.name,
      location: hotel.location,
      checkIn: bookingRequest.checkIn,
      checkOut: bookingRequest.checkOut,
      guests: bookingRequest.guests,
      roomType: bookingRequest.roomType,
      amount: hotel.price,
      status: 'confirmed',
      image: hotel.image,
      createdAt: new Date().toISOString(),
      userId,
      specialRequests: bookingRequest.specialRequests,
      guestDetails: bookingRequest.guestDetails,
      roomDetails: {
        view: 'city',
        bedType: 'queen',
        smoking: false,
        wifi: true,
        airConditioning: true,
        minibar: true
      },
      amenities: hotel.amenities,
      cancellationPolicy: hotel.policies.cancellation,
      loyaltyPoints: Math.floor(hotel.price * 0.1)
    };

    const bookings = this.getAllBookings();
    bookings.push(booking);
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));

    return booking;
  }

  static cancelBooking(bookingId: string): Promise<void> {
    return new Promise((resolve) => {
      const bookings = this.getAllBookings();
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex !== -1) {
        bookings[bookingIndex].status = 'cancelled';
        localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
      }
      
      resolve();
    });
  }

  static getReviews(hotelId: string): Review[] {
    const stored = localStorage.getItem(this.REVIEWS_KEY);
    const allReviews: Review[] = stored ? JSON.parse(stored) : [];
    return allReviews.filter(review => review.hotelId === hotelId);
  }

  static addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      ...review,
      id: `REV${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    const reviews = this.getAllReviews();
    reviews.push(newReview);
    localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews));

    return newReview;
  }

  static getAllReviews(): Review[] {
    const stored = localStorage.getItem(this.REVIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
