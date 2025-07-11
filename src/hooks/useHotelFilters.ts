import { useState, useEffect, useMemo } from 'react';
import { SORT_OPTIONS } from '@/constants';

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

interface FilterState {
  searchQuery: string;
  priceRange: [number, number];
  selectedRating: string;
  selectedAmenities: string[];
  sortBy: string;
}

export const useHotelFilters = (hotels: Hotel[]) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    priceRange: [0, 10000],
    selectedRating: '',
    selectedAmenities: [],
    sortBy: SORT_OPTIONS.POPULAR
  });

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [filters.searchQuery]);

  const filteredHotels = useMemo(() => {
    let filtered = [...hotels];

    // Location search
    if (debouncedSearchQuery) {
      filtered = filtered.filter(hotel =>
        hotel.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        hotel.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // Price range
    filtered = filtered.filter(hotel => 
      hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.selectedRating && filters.selectedRating !== "any") {
      const minRating = parseFloat(filters.selectedRating);
      filtered = filtered.filter(hotel => hotel.rating >= minRating);
    }


    // Amenities filter
    if (filters.selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel =>
        filters.selectedAmenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case SORT_OPTIONS.PRICE_LOW:
        filtered.sort((a, b) => a.price - b.price);
        break;
      case SORT_OPTIONS.PRICE_HIGH:
        filtered.sort((a, b) => b.price - a.price);
        break;
      case SORT_OPTIONS.RATING:
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case SORT_OPTIONS.REVIEWS:
        filtered.sort((a, b) => b.total_reviews - a.total_reviews);
        break;
      default:
        // Popular (default order)
        break;
    }

    return filtered;
  }, [hotels, debouncedSearchQuery, filters]);

  const updateFilter = <K extends keyof FilterState>(
    key: K, 
    value: FilterState[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      priceRange: [0, 10000],
      selectedRating: '',
      selectedAmenities: [],
      sortBy: SORT_OPTIONS.POPULAR
    });
  };

  return {
    filters,
    filteredHotels,
    updateFilter,
    resetFilters,
    debouncedSearchQuery
  };
}; 