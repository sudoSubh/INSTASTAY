import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { calculateNights, calculateTotalPrice } from '@/utils/helpers';
import { APP_CONFIG } from '@/constants';

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  roomType: string;
}

interface Hotel {
  id: string;
  name: string;
  price: number;
  original_price?: number;
}

export const useBookingFlow = (hotel: Hotel | null) => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || APP_CONFIG.DEFAULT_GUESTS.toString(),
    roomType: APP_CONFIG.DEFAULT_ROOM_TYPE
  });

  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Update user details when user is loaded
  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const getOfferDiscount = useCallback((code: string) => {
    const offers: { [key: string]: number } = {
      "WELCOME20": 20,
      "WEEKEND35": 35,
      "EARLY50": 50,
      "FLASH60": 60,
      "LUXURY25": 25,
      "MONSOON40": 40
    };
    return offers[code] || 0;
  }, []);

  const handleApplyCoupon = useCallback((code: string, discount: number) => {
    setAppliedCoupon(code);
    setCouponDiscount(discount);
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon("");
    setCouponDiscount(0);
  }, []);

  const calculateTotal = useCallback(() => {
    if (!bookingData.checkIn || !bookingData.checkOut || !hotel) {
      return 0;
    }
    
    const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
    if (nights <= 0) {
      return 0;
    }
    
    return calculateTotalPrice(
      hotel.price,
      nights,
      parseInt(bookingData.guests),
      couponDiscount
    );
  }, [bookingData, hotel, couponDiscount]);

  const validateBookingData = useCallback(() => {
    const errors: string[] = [];
    
    if (!bookingData.firstName.trim()) errors.push("First name is required");
    if (!bookingData.lastName.trim()) errors.push("Last name is required");
    if (!bookingData.email.trim()) errors.push("Email is required");
    if (!bookingData.phone.trim()) errors.push("Phone number is required");
    if (!bookingData.checkIn) errors.push("Check-in date is required");
    if (!bookingData.checkOut) errors.push("Check-out date is required");
    
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      if (checkOut <= checkIn) {
        errors.push("Check-out date must be after check-in date");
      }
    }
    
    return errors;
  }, [bookingData]);

  const updateBookingData = useCallback((field: keyof BookingData, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  return {
    bookingData,
    setBookingData,
    updateBookingData,
    appliedCoupon,
    couponDiscount,
    calculateTotal,
    validateBookingData,
    getOfferDiscount,
    handleApplyCoupon,
    handleRemoveCoupon
  };
}; 