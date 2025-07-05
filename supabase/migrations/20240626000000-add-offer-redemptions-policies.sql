-- Enable RLS on offer_redemptions table
ALTER TABLE offer_redemptions ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own offer redemptions
CREATE POLICY "Users can view their own offer redemptions" 
  ON offer_redemptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to create their own offer redemptions
CREATE POLICY "Users can create their own offer redemptions" 
  ON offer_redemptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own offer redemptions (if needed)
CREATE POLICY "Users can update their own offer redemptions" 
  ON offer_redemptions 
  FOR UPDATE 
  USING (auth.uid() = user_id); 