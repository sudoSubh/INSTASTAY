
export interface UserAnalytics {
  totalBookings: number;
  totalSpent: number;
  averageBookingValue: number;
  favoriteDestinations: string[];
  preferredRoomTypes: string[];
  bookingPatterns: {
    monthlyBookings: MonthlyData[];
    seasonalTrends: SeasonalData[];
    dayOfWeekPreference: DayPreference[];
  };
  loyaltyMetrics: {
    pointsEarned: number;
    pointsRedeemed: number;
    tier: string;
    nextTierProgress: number;
  };
  travelInsights: {
    averageTripDuration: number;
    mostFrequentTripType: 'business' | 'leisure';
    preferredBookingWindow: number;
    cancellationRate: number;
  };
}

export interface MonthlyData {
  month: string;
  bookings: number;
  spent: number;
}

export interface SeasonalData {
  season: 'spring' | 'summer' | 'fall' | 'winter';
  preference: number;
}

export interface DayPreference {
  day: string;
  preference: number;
}

export interface BusinessAnalytics {
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  occupancyRate: number;
  repeatCustomerRate: number;
  topPerformingHotels: HotelPerformance[];
  bookingTrends: BookingTrend[];
  customerSegments: CustomerSegment[];
  revenueBySource: RevenueSource[];
}

export interface HotelPerformance {
  hotelId: string;
  hotelName: string;
  revenue: number;
  bookings: number;
  rating: number;
  occupancyRate: number;
}

export interface BookingTrend {
  date: string;
  bookings: number;
  revenue: number;
  cancellations: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  averageBookingValue: number;
}

export interface RevenueSource {
  source: string;
  revenue: number;
  percentage: number;
}
