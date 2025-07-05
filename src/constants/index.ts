export const APP_CONFIG = {
  TAX_RATE: 0.18,
  CURRENCY: 'INR',
  DEFAULT_GUESTS: 1,
  DEFAULT_ROOM_TYPE: 'deluxe',
  DEFAULT_MIN_RATING: 0,
  DEFAULT_MAX_PRICE: 10000
};

export const ROUTES = {
  HOME: '/',
  HOTELS: '/hotels',
  BOOKING: '/book',
  DASHBOARD: '/dashboard',
  FAVORITES: '/favorites',
  PROFILE: '/profile',
  LOGIN: '/login',
  OFFERS: '/offers'
};

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  CHECKED_IN: 'checked-in',
  CHECKED_OUT: 'checked-out',
  NO_SHOW: 'no-show'
} as const;

export const SORT_OPTIONS = {
  POPULAR: 'popular',
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  RATING: 'rating',
  REVIEWS: 'reviews'
} as const; 