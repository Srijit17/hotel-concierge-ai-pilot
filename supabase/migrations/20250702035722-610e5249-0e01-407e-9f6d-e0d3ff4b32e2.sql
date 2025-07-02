
-- Create a guest_bookings table to store detailed guest information
CREATE TABLE public.guest_bookings (
  booking_number TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  room_type TEXT NOT NULL,
  room_number TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER DEFAULT 1,
  stay_purpose TEXT,
  preferences JSONB DEFAULT '{}',
  services_used JSONB DEFAULT '[]',
  special_requests TEXT,
  total_amount NUMERIC,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for guest_bookings
ALTER TABLE public.guest_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for guest_bookings (allow read access for booking verification)
CREATE POLICY "Anyone can read guest bookings for verification" ON public.guest_bookings
  FOR SELECT USING (true);

-- Create policy for staff to insert/update guest bookings
CREATE POLICY "Staff can manage guest bookings" ON public.guest_bookings
  FOR ALL USING (true);

-- Insert sample guest booking data for testing
INSERT INTO public.guest_bookings (
  booking_number, guest_name, email, phone, room_type, room_number, 
  check_in, check_out, guests_count, stay_purpose, preferences, 
  services_used, special_requests, total_amount
) VALUES 
(
  'BK12345', 'John Smith', 'john.smith@email.com', '+1-555-0123',
  'Deluxe Suite', '501', 
  '2025-01-02', '2025-01-05', 2, 'business',
  '{"dietary": "vegetarian", "wake_up_call": "07:00"}',
  '["wifi", "parking"]',
  'Late checkout if possible',
  899.00
),
(
  'BK67890', 'Sarah Johnson', 'sarah.j@email.com', '+1-555-0456',
  'Ocean View Premium', '302',
  '2025-01-01', '2025-01-07', 2, 'honeymoon',
  '{"room_temperature": "cool", "pillows": "extra_soft"}',
  '["spa", "room_service", "concierge"]',
  'Champagne and flowers in room',
  1299.00
),
(
  'BK11111', 'Michael Chen', 'mchen@email.com', '+1-555-0789',
  'Executive Suite', '701',
  '2024-12-30', '2025-01-03', 1, 'leisure',
  '{"newspaper": "wall_street_journal", "coffee": "espresso"}',
  '["gym", "business_center"]',
  'Quiet room away from elevators',
  1199.00
);

-- Create an index for faster booking number lookups
CREATE INDEX idx_booking_number ON public.guest_bookings(booking_number);
