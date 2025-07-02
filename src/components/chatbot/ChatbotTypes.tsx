
export interface UserContext {
  hasBooking: boolean;
  lastOrderTime?: string;
  hasSpaBooking: boolean;
  isLoyaltyMember: boolean;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface BookingState {
  step: 'room_selection' | 'guest_details' | 'confirmation' | 'completed';
  selectedRoom?: any;
  guestDetails?: {
    name: string;
    email: string;
    phone: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests?: string;
  };
}
