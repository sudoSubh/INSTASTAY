
-- Create hotels table
CREATE TABLE public.hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  rating DECIMAL(2,1) DEFAULT 4.0,
  total_reviews INTEGER DEFAULT 0,
  description TEXT,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  discount INTEGER DEFAULT 0,
  availability TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  hotel_name TEXT NOT NULL,
  location TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  room_type TEXT DEFAULT 'deluxe',
  status TEXT DEFAULT 'confirmed',
  amount INTEGER NOT NULL,
  payment_id TEXT,
  guest_details JSONB,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for hotels (public read, admin write)
CREATE POLICY "Anyone can view hotels" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert hotels" ON public.hotels FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Only authenticated users can update hotels" ON public.hotels FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample hotels data
INSERT INTO public.hotels (name, location, price, original_price, rating, total_reviews, description, image, images, amenities, discount) VALUES
('OYO 123 Premium Hotel', 'Sector 15, Mumbai, Maharashtra', 2499, 3999, 4.2, 128, 'Experience luxury and comfort at our premium hotel with world-class amenities.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'], ARRAY['Free WiFi', 'AC', 'TV', 'Parking', 'Room Service'], 37),
('OYO 456 Business Hotel', 'Sector 15, Delhi, NCR', 1899, 2599, 4.0, 95, 'Perfect for business travelers with modern amenities and convenient location.', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'], ARRAY['Free WiFi', 'AC', 'TV', 'Business Center', 'Conference Room'], 27),
('OYO 789 Comfort Stay', 'Sector 15, Bangalore, Karnataka', 1599, 1999, 4.1, 156, 'Comfortable stay with excellent service and modern facilities.', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'], ARRAY['Free WiFi', 'AC', 'TV', 'Parking', 'Restaurant'], 20),
('OYO 101 Luxury Resort', 'Goa Beach, Goa', 3999, 5999, 4.5, 234, 'Beachfront luxury resort with stunning ocean views and premium amenities.', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'], ARRAY['Free WiFi', 'Swimming Pool', 'Spa', 'Beach Access', 'Restaurant', 'Bar'], 33),
('OYO 202 Heritage Hotel', 'Old City, Jaipur, Rajasthan', 2799, 3599, 4.3, 187, 'Experience royal heritage with traditional Rajasthani hospitality.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop'], ARRAY['Free WiFi', 'AC', 'Traditional Decor', 'Restaurant', 'Cultural Shows'], 22),
('OYO 303 City Center Hotel', 'Connaught Place, Delhi, NCR', 2199, 2899, 4.0, 143, 'Located in the heart of the city with easy access to shopping and dining.', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'], ARRAY['Free WiFi', 'AC', 'TV', 'Metro Access', 'Shopping Mall'], 24),
('OYO 404 Hill Station Retreat', 'Mall Road, Shimla, Himachal Pradesh', 1799, 2399, 4.2, 198, 'Peaceful retreat in the mountains with breathtaking valley views.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'], ARRAY['Free WiFi', 'Mountain View', 'Fireplace', 'Restaurant', 'Trekking'], 25),
('OYO 505 Tech Hub Hotel', 'Electronic City, Bangalore, Karnataka', 1999, 2699, 4.1, 167, 'Modern hotel designed for tech professionals with high-speed internet.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'], ARRAY['High-Speed WiFi', 'AC', 'Work Desk', 'Co-working Space', '24/7 Support'], 26),
('OYO 606 Backpacker Hostel', 'Paharganj, Delhi, NCR', 899, 1299, 3.8, 245, 'Budget-friendly accommodation perfect for backpackers and solo travelers.', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559599238-1bb4ac3c5880?w=800&h=600&fit=crop'], ARRAY['Free WiFi', 'Shared Kitchen', 'Common Area', 'Lockers', 'Laundry'], 31),
('OYO 707 Airport Hotel', 'Terminal 3, Delhi Airport, NCR', 2599, 3299, 4.4, 189, 'Convenient airport hotel with shuttle service and modern amenities.', 'https://images.unsplash.com/photo-1559599238-1bb4ac3c5880?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1559599238-1bb4ac3c5880?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop'], ARRAY['Free WiFi', 'Airport Shuttle', 'AC', '24/7 Check-in', 'Business Center'], 21);
