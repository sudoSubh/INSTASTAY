
import { UserAnalytics, BusinessAnalytics, MonthlyData, CustomerSegment } from '../types/analytics';
import { BookingService } from './bookingService';

export class AnalyticsService {
  private static readonly USER_ANALYTICS_KEY = 'oyoUserAnalytics';
  private static readonly BUSINESS_ANALYTICS_KEY = 'oyoBusinessAnalytics';

  static getUserAnalytics(userId: string): UserAnalytics {
    const cached = localStorage.getItem(`${this.USER_ANALYTICS_KEY}_${userId}`);
    if (cached) {
      const analytics = JSON.parse(cached);
      // Check if cache is less than 1 hour old
      if (new Date().getTime() - new Date(analytics.lastUpdated).getTime() < 3600000) {
        return analytics;
      }
    }

    const bookings = BookingService.getUserBookings(userId);
    const analytics = this.calculateUserAnalytics(bookings);
    
    localStorage.setItem(`${this.USER_ANALYTICS_KEY}_${userId}`, JSON.stringify({
      ...analytics,
      lastUpdated: new Date().toISOString()
    }));

    return analytics;
  }

  static getBusinessAnalytics(): BusinessAnalytics {
    const cached = localStorage.getItem(this.BUSINESS_ANALYTICS_KEY);
    if (cached) {
      const analytics = JSON.parse(cached);
      // Check if cache is less than 1 hour old
      if (new Date().getTime() - new Date(analytics.lastUpdated).getTime() < 3600000) {
        return analytics;
      }
    }

    // Fix: change getBookings to getAllBookings
    const allBookings = BookingService.getAllBookings();
    const analytics = this.calculateBusinessAnalytics(allBookings);
    
    localStorage.setItem(this.BUSINESS_ANALYTICS_KEY, JSON.stringify({
      ...analytics,
      lastUpdated: new Date().toISOString()
    }));

    return analytics;
  }

  private static calculateUserAnalytics(bookings: any[]): UserAnalytics {
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const averageBookingValue = totalBookings > 0 ? totalSpent / totalBookings : 0;

    // Calculate favorite destinations
    const destinationCounts: Record<string, number> = {};
    bookings.forEach(booking => {
      const city = booking.location.split(',')[1]?.trim() || booking.location;
      destinationCounts[city] = (destinationCounts[city] || 0) + 1;
    });
    const favoriteDestinations = Object.entries(destinationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([destination]) => destination);

    // Calculate preferred room types
    const roomTypeCounts: Record<string, number> = {};
    bookings.forEach(booking => {
      roomTypeCounts[booking.roomType] = (roomTypeCounts[booking.roomType] || 0) + 1;
    });
    const preferredRoomTypes = Object.entries(roomTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([roomType]) => roomType);

    // Calculate monthly booking patterns
    const monthlyBookings: MonthlyData[] = [];
    const monthlyData: Record<string, { bookings: number; spent: number }> = {};
    
    bookings.forEach(booking => {
      const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { bookings: 0, spent: 0 };
      }
      monthlyData[month].bookings++;
      monthlyData[month].spent += booking.amount;
    });

    Object.entries(monthlyData)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .forEach(([month, data]) => {
        monthlyBookings.push({ month, ...data });
      });

    // Calculate average trip duration
    const tripDurations = bookings.map(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    });
    const averageTripDuration = tripDurations.length > 0 
      ? tripDurations.reduce((sum, duration) => sum + duration, 0) / tripDurations.length 
      : 0;

    // Calculate booking window (days between booking and check-in)
    const bookingWindows = bookings.map(booking => {
      const bookingDate = new Date(booking.createdAt);
      const checkInDate = new Date(booking.checkIn);
      return Math.ceil((checkInDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));
    });
    const preferredBookingWindow = bookingWindows.length > 0
      ? bookingWindows.reduce((sum, window) => sum + window, 0) / bookingWindows.length
      : 0;

    // Calculate cancellation rate
    const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled').length;
    const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

    // Calculate loyalty points
    const loyaltyPoints = bookings.reduce((sum, booking) => sum + (booking.loyaltyPoints || 0), 0);

    return {
      totalBookings,
      totalSpent,
      averageBookingValue,
      favoriteDestinations,
      preferredRoomTypes,
      bookingPatterns: {
        monthlyBookings,
        seasonalTrends: [
          { season: 'spring', preference: 25 },
          { season: 'summer', preference: 40 },
          { season: 'fall', preference: 20 },
          { season: 'winter', preference: 15 }
        ],
        dayOfWeekPreference: [
          { day: 'Monday', preference: 10 },
          { day: 'Tuesday', preference: 12 },
          { day: 'Wednesday', preference: 15 },
          { day: 'Thursday', preference: 20 },
          { day: 'Friday', preference: 25 },
          { day: 'Saturday', preference: 18 },
          { day: 'Sunday', preference: 0 }
        ]
      },
      loyaltyMetrics: {
        pointsEarned: loyaltyPoints,
        pointsRedeemed: 0,
        tier: this.calculateLoyaltyTier(totalSpent),
        nextTierProgress: this.calculateTierProgress(totalSpent)
      },
      travelInsights: {
        averageTripDuration,
        mostFrequentTripType: 'leisure',
        preferredBookingWindow,
        cancellationRate
      }
    };
  }

  private static calculateBusinessAnalytics(bookings: any[]): BusinessAnalytics {
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const averageRating = 4.2; // Mock data
    const occupancyRate = 75; // Mock data
    const repeatCustomerRate = 35; // Mock data

    // Calculate top performing hotels
    const hotelPerformance: Record<string, any> = {};
    bookings.forEach(booking => {
      if (!hotelPerformance[booking.hotelId]) {
        hotelPerformance[booking.hotelId] = {
          hotelId: booking.hotelId,
          hotelName: booking.hotelName,
          revenue: 0,
          bookings: 0,
          rating: 4.2
        };
      }
      hotelPerformance[booking.hotelId].revenue += booking.amount;
      hotelPerformance[booking.hotelId].bookings++;
    });

    const topPerformingHotels = Object.values(hotelPerformance)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((hotel: any) => ({
        ...hotel,
        occupancyRate: Math.random() * 20 + 70 // Mock occupancy rate
      }));

    // Calculate booking trends (last 30 days)
    const bookingTrends = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBookings = bookings.filter(booking => 
        booking.createdAt.split('T')[0] === dateStr
      );
      
      bookingTrends.push({
        date: dateStr,
        bookings: dayBookings.length,
        revenue: dayBookings.reduce((sum, booking) => sum + booking.amount, 0),
        cancellations: dayBookings.filter(booking => booking.status === 'cancelled').length
      });
    }

    // Calculate customer segments
    const customerSegments: CustomerSegment[] = [
      {
        segment: 'Premium',
        count: Math.floor(totalBookings * 0.15),
        revenue: totalRevenue * 0.45,
        averageBookingValue: totalRevenue * 0.45 / (totalBookings * 0.15)
      },
      {
        segment: 'Regular',
        count: Math.floor(totalBookings * 0.60),
        revenue: totalRevenue * 0.40,
        averageBookingValue: totalRevenue * 0.40 / (totalBookings * 0.60)
      },
      {
        segment: 'Budget',
        count: Math.floor(totalBookings * 0.25),
        revenue: totalRevenue * 0.15,
        averageBookingValue: totalRevenue * 0.15 / (totalBookings * 0.25)
      }
    ];

    // Calculate revenue by source
    const revenueBySource = [
      { source: 'Direct Website', revenue: totalRevenue * 0.60, percentage: 60 },
      { source: 'Mobile App', revenue: totalRevenue * 0.25, percentage: 25 },
      { source: 'Third Party', revenue: totalRevenue * 0.10, percentage: 10 },
      { source: 'Referrals', revenue: totalRevenue * 0.05, percentage: 5 }
    ];

    return {
      totalRevenue,
      totalBookings,
      averageRating,
      occupancyRate,
      repeatCustomerRate,
      topPerformingHotels,
      bookingTrends,
      customerSegments,
      revenueBySource
    };
  }

  private static calculateLoyaltyTier(totalSpent: number): 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' {
    if (totalSpent >= 100000) return 'diamond';
    if (totalSpent >= 50000) return 'platinum';
    if (totalSpent >= 25000) return 'gold';
    if (totalSpent >= 10000) return 'silver';
    return 'bronze';
  }

  private static calculateTierProgress(totalSpent: number): number {
    const tier = this.calculateLoyaltyTier(totalSpent);
    const tierThresholds = {
      bronze: { min: 0, max: 10000 },
      silver: { min: 10000, max: 25000 },
      gold: { min: 25000, max: 50000 },
      platinum: { min: 50000, max: 100000 },
      diamond: { min: 100000, max: Infinity }
    };
    
    const threshold = tierThresholds[tier];
    if (threshold.max === Infinity) return 100;
    
    return Math.min(100, ((totalSpent - threshold.min) / (threshold.max - threshold.min)) * 100);
  }

  static trackEvent(eventName: string, properties: any): void {
    // Mock event tracking
    console.log('Analytics Event:', eventName, properties);
  }

  static trackPageView(pageName: string): void {
    this.trackEvent('page_view', { page: pageName, timestamp: new Date().toISOString() });
  }

  static trackBookingFlow(step: string, data: any): void {
    this.trackEvent('booking_flow', { step, data, timestamp: new Date().toISOString() });
  }
}
