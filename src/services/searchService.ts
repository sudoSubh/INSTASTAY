import { SearchFilters, SearchSuggestion, SearchHistory, SavedSearch, PopularDestination, SortOption } from '../types/search';
import { Hotel } from '../types/booking';
import { BookingService } from './bookingService';

export class SearchService {
  private static readonly SEARCH_HISTORY_KEY = 'oyoSearchHistory';
  private static readonly SAVED_SEARCHES_KEY = 'oyoSavedSearches';
  private static readonly POPULAR_DESTINATIONS_KEY = 'oyoPopularDestinations';

  static async searchHotels(filters: Partial<SearchFilters>): Promise<Hotel[]> {
    let hotels = BookingService.getHotels();

    // Apply filters
    if (filters.location) {
      hotels = hotels.filter(hotel => 
        hotel.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
        hotel.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        hotel.state.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.priceRange) {
      hotels = hotels.filter(hotel => 
        hotel.price >= filters.priceRange!.min && hotel.price <= filters.priceRange!.max
      );
    }

    if (filters.starRating && filters.starRating.length > 0) {
      hotels = hotels.filter(hotel => 
        filters.starRating!.some(rating => Math.floor(hotel.rating) === rating)
      );
    }

    if (filters.amenities && filters.amenities.length > 0) {
      hotels = hotels.filter(hotel => 
        filters.amenities!.every(amenity => hotel.amenities.includes(amenity))
      );
    }

    if (filters.propertyType && filters.propertyType.length > 0) {
      // Mock property type filtering
      hotels = hotels.filter(hotel => filters.propertyType!.includes('hotel'));
    }

    // Apply sorting
    if (filters.sortBy) {
      hotels = this.sortHotels(hotels, filters.sortBy);
    }

    return hotels;
  }

  static async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = [];

    // Mock data - in real app, this would come from an API
    const cities = [
      { name: 'Mumbai', type: 'city' as const, id: 'mumbai', coordinates: { lat: 19.0760, lng: 72.8777 } },
      { name: 'Delhi', type: 'city' as const, id: 'delhi', coordinates: { lat: 28.7041, lng: 77.1025 } },
      { name: 'Bangalore', type: 'city' as const, id: 'bangalore', coordinates: { lat: 12.9716, lng: 77.5946 } },
      { name: 'Pune', type: 'city' as const, id: 'pune', coordinates: { lat: 18.5204, lng: 73.8567 } },
      { name: 'Chennai', type: 'city' as const, id: 'chennai', coordinates: { lat: 13.0827, lng: 80.2707 } }
    ];

    const landmarks = [
      { name: 'Gateway of India', type: 'landmark' as const, id: 'gateway-of-india', subtext: 'Mumbai, Maharashtra' },
      { name: 'India Gate', type: 'landmark' as const, id: 'india-gate', subtext: 'Delhi, NCR' },
      { name: 'Marine Drive', type: 'landmark' as const, id: 'marine-drive', subtext: 'Mumbai, Maharashtra' }
    ];

    const hotels = BookingService.getHotels();

    // Filter based on query
    if (query.length > 0) {
      const lowerQuery = query.toLowerCase();

      // Add matching cities
      cities.forEach(city => {
        if (city.name.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: city.type,
            text: city.name,
            id: city.id,
            coordinates: city.coordinates
          });
        }
      });

      // Add matching landmarks
      landmarks.forEach(landmark => {
        if (landmark.name.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: landmark.type,
            text: landmark.name,
            subtext: landmark.subtext,
            id: landmark.id
          });
        }
      });

      // Add matching hotels
      hotels.forEach(hotel => {
        if (hotel.name.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'hotel',
            text: hotel.name,
            subtext: hotel.location,
            id: hotel.id,
            coordinates: hotel.coordinates
          });
        }
      });
    }

    return suggestions.slice(0, 10);
  }

  static saveSearchHistory(userId: string, query: string, filters: Partial<SearchFilters>, resultCount: number): void {
    const history = this.getSearchHistory(userId);
    const searchEntry: SearchHistory = {
      id: `SEARCH${Math.random().toString(36).substr(2, 9)}`,
      query,
      filters,
      timestamp: new Date().toISOString(),
      resultCount
    };

    history.unshift(searchEntry);
    
    // Keep only last 50 searches
    if (history.length > 50) {
      history.splice(50);
    }

    localStorage.setItem(`${this.SEARCH_HISTORY_KEY}_${userId}`, JSON.stringify(history));
  }

  static getSearchHistory(userId: string): SearchHistory[] {
    const history = localStorage.getItem(`${this.SEARCH_HISTORY_KEY}_${userId}`);
    return history ? JSON.parse(history) : [];
  }

  static saveSearch(userId: string, name: string, filters: SearchFilters): SavedSearch {
    const savedSearches = this.getSavedSearches(userId);
    const savedSearch: SavedSearch = {
      id: `SAVED${Math.random().toString(36).substr(2, 9)}`,
      name,
      filters,
      alertEnabled: false,
      createdAt: new Date().toISOString()
    };

    savedSearches.push(savedSearch);
    localStorage.setItem(`${this.SAVED_SEARCHES_KEY}_${userId}`, JSON.stringify(savedSearches));
    
    return savedSearch;
  }

  static getSavedSearches(userId: string): SavedSearch[] {
    const searches = localStorage.getItem(`${this.SAVED_SEARCHES_KEY}_${userId}`);
    return searches ? JSON.parse(searches) : [];
  }

  static deleteSavedSearch(userId: string, searchId: string): void {
    const searches = this.getSavedSearches(userId).filter(s => s.id !== searchId);
    localStorage.setItem(`${this.SAVED_SEARCHES_KEY}_${userId}`, JSON.stringify(searches));
  }

  static getPopularDestinations(): PopularDestination[] {
    const destinations = localStorage.getItem(this.POPULAR_DESTINATIONS_KEY);
    if (destinations) return JSON.parse(destinations);

    // Initialize with mock data
    const mockDestinations: PopularDestination[] = [
      {
        id: 'mumbai',
        name: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop',
        description: 'The financial capital of India',
        averagePrice: 2500,
        hotelCount: 1250,
        popularityScore: 95,
        trendingScore: 88,
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      {
        id: 'delhi',
        name: 'Delhi',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
        description: 'The capital city with rich history',
        averagePrice: 2200,
        hotelCount: 980,
        popularityScore: 92,
        trendingScore: 85,
        coordinates: { lat: 28.7041, lng: 77.1025 }
      },
      {
        id: 'bangalore',
        name: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop',
        description: 'The Silicon Valley of India',
        averagePrice: 1800,
        hotelCount: 750,
        popularityScore: 87,
        trendingScore: 92,
        coordinates: { lat: 12.9716, lng: 77.5946 }
      }
    ];

    localStorage.setItem(this.POPULAR_DESTINATIONS_KEY, JSON.stringify(mockDestinations));
    return mockDestinations;
  }

  private static sortHotels(hotels: Hotel[], sortBy: SortOption): Hotel[] {
    switch (sortBy) {
      case 'price_low_high':
        return hotels.sort((a, b) => a.price - b.price);
      case 'price_high_low':
        return hotels.sort((a, b) => b.price - a.price);
      case 'rating':
        return hotels.sort((a, b) => b.rating - a.rating);
      case 'popularity':
        return hotels.sort((a, b) => b.popularityScore - a.popularityScore);
      case 'newest':
        return hotels.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'recommended':
        return hotels.sort((a, b) => (b.rating * b.popularityScore) - (a.rating * a.popularityScore));
      default:
        return hotels;
    }
  }

  static getFilterOptions() {
    return {
      amenities: [
        'Free WiFi',
        'AC',
        'TV',
        'Room Service',
        'Parking',
        'Swimming Pool',
        'Gym',
        'Restaurant',
        'Spa',
        'Business Center',
        'Conference Room',
        'Laundry',
        '24/7 Reception',
        'Elevator',
        'Bar',
        'Kitchen',
        'Balcony',
        'Garden',
        'Terrace',
        'Airport Shuttle'
      ],
      roomTypes: [
        'Standard',
        'Deluxe',
        'Suite',
        'Executive',
        'Family Room',
        'Single Room',
        'Double Room',
        'Twin Room',
        'Triple Room',
        'Dormitory'
      ],
      propertyTypes: [
        'Hotel',
        'Resort',
        'Apartment',
        'Villa',
        'Hostel',
        'Guest House',
        'Boutique Hotel',
        'Business Hotel',
        'Budget Hotel',
        'Luxury Hotel'
      ],
      starRatings: [1, 2, 3, 4, 5],
      sortOptions: [
        { value: 'popularity', label: 'Popularity' },
        { value: 'price_low_high', label: 'Price: Low to High' },
        { value: 'price_high_low', label: 'Price: High to Low' },
        { value: 'rating', label: 'Guest Rating' },
        { value: 'distance', label: 'Distance' },
        { value: 'newest', label: 'Newest First' },
        { value: 'recommended', label: 'Recommended' }
      ]
    };
  }
}
