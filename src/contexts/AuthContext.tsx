import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          const userData = await createUserProfile(session.user);
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        createUserProfile(session.user).then(setUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (supabaseUser: any): Promise<User> => {
    const userData: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      firstName: supabaseUser.user_metadata?.first_name || supabaseUser.user_metadata?.full_name?.split(' ')[0] || 'User',
      lastName: supabaseUser.user_metadata?.last_name || supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
      phone: supabaseUser.user_metadata?.phone || '',
      createdAt: supabaseUser.created_at || new Date().toISOString(),
      profile: {
        avatar: supabaseUser.user_metadata?.avatar_url,
        travelPurpose: 'leisure'
      },
      preferences: {
        currency: 'INR',
        language: 'en',
        timezone: 'Asia/Kolkata',
        notifications: {
          email: true,
          sms: true,
          push: true,
          marketing: true
        },
        roomPreferences: {
          bedType: 'queen',
          smokingRoom: false,
          floor: 'middle',
          view: 'any'
        },
        dietaryRestrictions: [],
        accessibility: {
          wheelchairAccess: false,
          hearingImpaired: false,
          visuallyImpaired: false,
          other: ''
        }
      },
      loyaltyProgram: {
        tier: 'bronze',
        points: 0,
        tierProgress: 0,
        tierBenefits: [],
        lifetimeStays: 0,
        lifetimeSpent: 0,
        nextTierRequirement: 5000
      },
      paymentMethods: [],
      addresses: [],
      isVerified: supabaseUser.email_confirmed_at ? true : false,
      lastLoginAt: new Date().toISOString()
    };

    return userData;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('Login error details:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes before trying again.');
        } else {
          throw new Error(error.message || 'Login failed. Please try again.');
        }
      }

      if (!data.user) {
        throw new Error('Login failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`
          }
        }
      });
      
      if (error) {
        console.error('Signup error details:', error);
        
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        } else {
          throw new Error(error.message || 'Account creation failed. Please try again.');
        }
      }

      if (!data.user) {
        throw new Error('Account creation failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      console.log('Starting Google OAuth...');
      console.log('Current origin:', window.location.origin);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.hostname === 'localhost' 
            ? `${window.location.origin}/dashboard`
            : 'https://instastay.vercel.app/dashboard'
        }
      });
      
      if (error) {
        console.error('Google signin error details:', error);
        throw new Error(error.message || 'Google sign-in failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Google signin error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error details:', error);
        throw new Error(error.message || 'Logout failed. Please try again.');
      }
      
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      login, 
      signup, 
      signInWithGoogle, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};