import { APP_CONFIG } from '@/constants';

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString()}`;
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return nights > 0 ? nights : 0;
};

export const calculateTotalPrice = (
  basePrice: number, 
  nights: number, 
  guests: number, 
  discount: number = 0
): number => {
  const subtotal = basePrice * nights * guests;
  const discountAmount = subtotal * (discount / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const taxes = discountedSubtotal * APP_CONFIG.TAX_RATE;
  
  return Math.round(discountedSubtotal + taxes);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const getInitials = (firstName: string = '', lastName: string = ''): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}; 