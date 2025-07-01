
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  profile: UserProfile;
  preferences: UserPreferences;
  loyaltyProgram: LoyaltyProgram;
  paymentMethods: PaymentMethod[];
  addresses: Address[];
  emergencyContact?: EmergencyContact;
  isVerified: boolean;
  lastLoginAt: string;
}

export interface UserProfile {
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  nationality?: string;
  occupation?: string;
  travelPurpose: 'business' | 'leisure' | 'both';
  bio?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface UserPreferences {
  currency: string;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  roomPreferences: {
    bedType: 'single' | 'double' | 'queen' | 'king';
    smokingRoom: boolean;
    floor: 'low' | 'middle' | 'high';
    view: 'any' | 'city' | 'ocean' | 'garden' | 'mountain';
  };
  dietaryRestrictions: string[];
  accessibility: {
    wheelchairAccess: boolean;
    hearingImpaired: boolean;
    visuallyImpaired: boolean;
    other: string;
  };
}

export interface LoyaltyProgram {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  tierProgress: number;
  tierBenefits: string[];
  lifetimeStays: number;
  lifetimeSpent: number;
  nextTierRequirement: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank' | 'upi';
  provider: string;
  last4?: string;
  expiryDate?: string;
  holderName?: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  email?: string;
  relation: string;
  address?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  agreeToTerms: boolean;
  agreeToMarketing?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}
