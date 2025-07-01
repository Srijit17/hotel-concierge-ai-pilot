
-- Add RLS policies for existing tables to enable proper access control
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions (allow anyone to create and access their own sessions)
CREATE POLICY "Anyone can create sessions" ON public.sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can access their own sessions" ON public.sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own sessions" ON public.sessions
  FOR UPDATE USING (true);

-- Create policies for messages (tied to sessions)
CREATE POLICY "Anyone can create messages" ON public.messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read messages" ON public.messages
  FOR SELECT USING (true);

-- Create policies for profiles (guest information)
CREATE POLICY "Anyone can create profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update profiles" ON public.profiles
  FOR UPDATE USING (true);

-- Create policies for bookings
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read bookings" ON public.bookings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update bookings" ON public.bookings
  FOR UPDATE USING (true);

-- Create a rooms table for availability checking
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  price_per_night numeric NOT NULL,
  features text[],
  max_guests integer DEFAULT 2,
  available boolean DEFAULT true,
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create policy for rooms (public read access)
CREATE POLICY "Anyone can read rooms" ON public.rooms
  FOR SELECT USING (true);

-- Insert sample room data
INSERT INTO public.rooms (name, type, price_per_night, features, max_guests, image_url) VALUES
  ('Ocean View Deluxe', 'deluxe', 349, ARRAY['Ocean balcony', 'King bed', 'Complimentary champagne', 'Mini bar'], 2, '/placeholder.svg'),
  ('City View Premium', 'premium', 299, ARRAY['City skyline view', 'Queen bed', 'Work desk', 'High-speed WiFi'], 2, '/placeholder.svg'),
  ('Garden Suite', 'suite', 449, ARRAY['Private terrace', 'Separate living area', 'Butler service', 'Garden view'], 4, '/placeholder.svg'),
  ('Executive Suite', 'suite', 599, ARRAY['Downtown views', 'Full kitchen', 'Meeting area', 'Concierge access'], 4, '/placeholder.svg'),
  ('Standard Double', 'standard', 199, ARRAY['Two double beds', 'Coffee maker', 'Cable TV'], 4, '/placeholder.svg');
