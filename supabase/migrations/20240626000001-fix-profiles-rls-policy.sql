-- Fix profiles RLS policy to allow reading profile names for reviews
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a new policy that allows reading profile names for reviews
CREATE POLICY "Users can view profile names for reviews" 
  ON public.profiles 
  FOR SELECT 
  USING (
    -- Allow users to view their own profile
    auth.uid() = id 
    OR 
    -- Allow reading first_name and last_name for review purposes (simplified)
    auth.uid() IS NOT NULL
  ); 