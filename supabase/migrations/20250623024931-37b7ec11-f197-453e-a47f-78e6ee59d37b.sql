
-- Add missing columns to the reviews table
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS booking_id UUID;

-- Add constraint to ensure rating is between 1 and 5 (using DO block to check if constraint exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'reviews_rating_check' 
        AND table_name = 'reviews'
    ) THEN
        ALTER TABLE public.reviews 
        ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5);
    END IF;
END $$;
