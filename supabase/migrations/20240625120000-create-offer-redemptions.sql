-- Migration: Create offer_redemptions table
CREATE TABLE IF NOT EXISTS offer_redemptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  offer_code text NOT NULL,
  redeemed_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, offer_code)
); 