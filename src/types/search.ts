
export interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceRange: {
    min: number;
    max: number;
  };
  starRating: number[];
  amenities: string[];
  roomType: string[];
  propertyType: string[];
  distance: {
    landmark: string;
    radius: number;
  };
  sortBy: SortOption;
  availability: 'all' | 'instant_book' | 'free_cancellation';
  accessibility: string[];
  businessFriendly: boolean;
  petFriendly: boolean;
  familyFriendly: boolean;
  popularFilters: string[];
}

export type SortOption = 
  | 'popularity'
  | 'price_low_high'
  | 'price_high_low'
  | 'rating'
  | 'distance'
  | 'newest'
  | 'recommended';

export interface SearchSuggestion {
  type: 'city' | 'hotel' | 'landmark' | 'airport';
  text: string;
  subtext?: string;
  id: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SearchHistory {
  id: string;
  query: string;
  filters: Partial<SearchFilters>;
  timestamp: string;
  resultCount: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  alertEnabled: boolean;
  lastAlertSent?: string;
  createdAt: string;
}

export interface PopularDestination {
  id: string;
  name: string;
  image: string;
  description: string;
  averagePrice: number;
  hotelCount: number;
  popularityScore: number;
  trendingScore: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}
