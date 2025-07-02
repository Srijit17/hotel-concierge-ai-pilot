import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Star, Send, Phone, Clock, Utensils, User, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type?: 'text' | 'room-cards' | 'booking-summary' | 'menu-items' | 'amenity-info' | 'contact-info' | 'guest-profile' | 'smart-suggestions' | 'greeting-buttons';
  data?: any;
}

interface Room {
  id: string;
  name: string;
  type: string;
  price_per_night: number;
  features: string[];
  max_guests: number;
  image_url: string;
}

interface GuestBooking {
  booking_number: string;
  guest_name: string;
  email: string | null;
  phone: string | null;
  room_type: string;
  room_number: string | null;
  check_in: string;
  check_out: string;
  guests_count: number | null;
  stay_purpose: string | null;
  preferences: any;
  services_used: any;
  special_requests: string | null;
  total_amount: number | null;
  status: string | null;
}

interface BookingData {
  room?: Room;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  guestName?: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

const HotelChatbotCore = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [currentBooking, setCurrentBooking] = useState<BookingData>({});
  const [currentOrder, setCurrentOrder] = useState<{items: MenuItem[], roomNumber?: string}>({items: []});
  const [awaitingInput, setAwaitingInput] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestBooking, setGuestBooking] = useState<GuestBooking | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Sample menu data
  const menuItems: MenuItem[] = [
    { id: '1', name: 'Continental Breakfast', price: 28, category: 'Breakfast', description: 'Fresh pastries, fruits, coffee, juice' },
    { id: '2', name: 'Club Sandwich', price: 24, category: 'Lunch', description: 'Triple-decker with turkey, bacon, lettuce' },
    { id: '3', name: 'Caesar Salad', price: 18, category: 'Lunch', description: 'Crisp romaine, parmesan, croutons' },
    { id: '4', name: 'Grilled Salmon', price: 36, category: 'Dinner', description: 'Atlantic salmon with seasonal vegetables' },
    { id: '5', name: 'Pasta Carbonara', price: 26, category: 'Dinner', description: 'Creamy pasta with pancetta and parmesan' },
    { id: '6', name: 'Chocolate Cake', price: 12, category: 'Dessert', description: 'Rich chocolate layer cake' },
    { id: '7', name: 'Fresh Coffee', price: 6, category: 'Beverages', description: 'Freshly brewed premium blend' },
    { id: '8', name: 'Fresh Orange Juice', price: 8, category: 'Beverages', description: 'Freshly squeezed orange juice' }
  ];

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const { data: session } = await supabase
        .from('sessions')
        .insert({ channel: 'web_widget' })
        .select()
        .single();
      
      if (session) {
        setSessionId(session.id);
        // Enhanced greeting with interactive buttons
        addBotMessage("👋 Welcome to The Grand Luxury Hotel! I'm Sofia, your personal concierge assistant.", 'text');
        setTimeout(() => {
          addBotMessage("How would you like to proceed today?", 'greeting-buttons', {
            buttons: [
              {
                id: 'existing_guest',
                title: '🎫 Existing Guest',
                subtitle: 'I have a booking number',
                description: 'Get personalized service with your booking details'
              },
              {
                id: 'new_inquiry',
                title: '🔍 New Inquiry', 
                subtitle: 'Looking for rooms',
                description: 'Browse available rooms and make reservations'
              }
            ]
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const handleGreetingButtonClick = (buttonId: string) => {
    if (buttonId === 'existing_guest') {
      addUserMessage("I'm an existing guest");
      addBotMessage("Perfect! Please provide your booking number (format: BK12345) so I can access your reservation details and provide personalized assistance.");
      setAwaitingInput('booking_verification');
    } else if (buttonId === 'new_inquiry') {
      addUserMessage("I'd like to make a new inquiry");
      addBotMessage("Wonderful! I'd be happy to help you find the perfect room for your stay. Let me show you our available accommodations.");
      setTimeout(() => {
        handleRoomAvailability();
      }, 500);
    }
  };

  const addBotMessage = (content: string, type: 'text' | 'room-cards' | 'booking-summary' | 'menu-items' | 'amenity-info' | 'contact-info' | 'guest-profile' | 'smart-suggestions' | 'greeting-buttons' = 'text', data?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      content,
      timestamp: new Date(),
      type,
      data
    };
    setMessages(prev => [...prev, message]);
    
    // Store in database
    if (sessionId) {
      supabase.from('messages').insert({
        session_id: sessionId,
        sender: 'bot',
        content,
        timestamp: new Date().toISOString()
      });
    }
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    
    // Store in database
    if (sessionId) {
      supabase.from('messages').insert({
        session_id: sessionId,
        sender: 'user',
        content,
        timestamp: new Date().toISOString()
      });
    }
  };

  // BRICK A: Booking Number Verification
  const handleBookingVerification = async (bookingNumber: string) => {
    try {
      const { data: booking, error } = await supabase
        .from('guest_bookings')
        .select('*')
        .eq('booking_number', bookingNumber.toUpperCase())
        .single();

      if (error || !booking) {
        addBotMessage("❌ I couldn't find a booking with that number. Please double-check and try again, or contact our front desk for assistance.", 'text');
        return;
      }

      // Convert services_used to string array if it's not already
      const processedBooking: GuestBooking = {
        ...booking,
        services_used: Array.isArray(booking.services_used) ? booking.services_used : 
                      typeof booking.services_used === 'string' ? JSON.parse(booking.services_used) : []
      };

      setGuestBooking(processedBooking);
      setGuestName(processedBooking.guest_name);
      setIsVerified(true);

      // Display guest profile
      addBotMessage(`✅ Welcome back, ${processedBooking.guest_name}! I've found your booking.`, 'guest-profile', processedBooking);
      
      // Generate smart suggestions after verification
      setTimeout(() => {
        generateSmartSuggestions(processedBooking);
      }, 1500);

    } catch (error) {
      console.error('Error verifying booking:', error);
      addBotMessage("I'm having trouble accessing our booking system right now. Please try again in a moment.", 'text');
    }
  };

  // BRICK B: Contextual Suggestion Engine
  const generateSmartSuggestions = (booking: GuestBooking) => {
    const suggestions: SmartSuggestion[] = [];
    const checkOutDate = new Date(booking.check_out);
    const today = new Date();
    const daysUntilCheckout = Math.ceil((checkOutDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Late checkout suggestion (if checkout is soon)
    if (daysUntilCheckout <= 1) {
      suggestions.push({
        id: 'late_checkout',
        title: 'Late Checkout Available',
        description: 'Extend your stay until 2 PM at no extra charge',
        action: 'Request late checkout',
        priority: 'high',
        icon: '🕐'
      });
    }

    // Personalized suggestions based on stay purpose
    if (booking.stay_purpose === 'honeymoon') {
      suggestions.push({
        id: 'spa_couple',
        title: "Couple's Spa Experience",
        description: 'Perfect for your romantic getaway - 20% off couple treatments',
        action: 'Book spa session',
        priority: 'high',
        icon: '💆‍♀️'
      });
      
      suggestions.push({
        id: 'romantic_dinner',
        title: 'Private Dining Experience',
        description: 'Candlelit dinner on your private balcony',
        action: 'Reserve private dinner',
        priority: 'medium',
        icon: '🕯️'
      });
    }

    if (booking.stay_purpose === 'business') {
      suggestions.push({
        id: 'business_center',
        title: 'Business Center Access',
        description: 'Meeting rooms and business services available 24/7',
        action: 'Book meeting room',
        priority: 'medium',
        icon: '💼'
      });
    }

    // Room type based suggestions
    if (booking.room_type.includes('Executive') || booking.room_type.includes('Suite')) {
      suggestions.push({
        id: 'executive_lounge',
        title: 'Executive Lounge Benefits',
        description: 'Complimentary breakfast, evening cocktails, and concierge service',
        action: 'Access executive lounge',
        priority: 'medium',
        icon: '👑'
      });
    }

    // Previous services suggestions
    if (booking.services_used.includes('spa')) {
      suggestions.push({
        id: 'spa_return',
        title: 'Return Spa Guest Discount',
        description: '15% off your next spa treatment as a returning guest',
        action: 'Book spa treatment',
        priority: 'medium',
        icon: '🧘‍♀️'
      });
    }

    // Coffee preference from guest preferences
    if (booking.preferences?.coffee) {
      suggestions.push({
        id: 'coffee_service',
        title: `Your Favorite: ${booking.preferences.coffee}`,
        description: 'Would you like your preferred coffee delivered to your room?',
        action: 'Order coffee',
        priority: 'low',
        icon: '☕'
      });
    }

    // Room service suggestion based on time
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour <= 10) {
      suggestions.push({
        id: 'breakfast_service',
        title: 'In-Room Breakfast',
        description: 'Start your day with our continental breakfast in bed',
        action: 'Order breakfast',
        priority: 'medium',
        icon: '🍳'
      });
    }

    if (suggestions.length > 0) {
      addBotMessage("Based on your stay details, here are some personalized recommendations for you:", 'smart-suggestions', suggestions);
    }
  };

  const detectIntent = (message: string): string => {
    const lower = message.toLowerCase();
    
    // Booking verification intent
    if (lower.includes('booking') && (lower.includes('number') || lower.includes('bk') || /\bbk\d+/i.test(message))) {
      return 'ProvideBookingNumber';
    }
    
    // Extract booking number pattern
    if (/\bbk\d+/i.test(message) || (lower.includes('my booking') || lower.includes('existing guest'))) {
      return 'ProvideBookingNumber';
    }
    
    // Existing intents
    if (lower.includes('room') && (lower.includes('available') || lower.includes('availability'))) {
      return 'CheckRoomAvailability';
    }
    if (lower.includes('book') || lower.includes('reserve')) {
      return 'BookRoom';
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return 'GreetGuest';
    }
    if (lower.includes('room service') || lower.includes('food') || lower.includes('menu') || 
        lower.includes('order') || lower.includes('hungry') || lower.includes('eat') ||
        lower.includes('breakfast') || lower.includes('lunch') || lower.includes('dinner')) {
      return 'RoomServiceOrder';
    }
    if (lower.includes('gym') || lower.includes('fitness') || lower.includes('pool') || 
        lower.includes('spa') || lower.includes('wifi') || lower.includes('parking') ||
        lower.includes('amenities') || lower.includes('facilities') || lower.includes('services')) {
      return 'AskAboutAmenities';
    }
    if (lower.includes('complaint') || lower.includes('problem') || lower.includes('issue') ||
        lower.includes('dirty') || lower.includes('broken') || lower.includes('not working') ||
        lower.includes('disappointed') || lower.includes('unsatisfied') || lower.includes('poor')) {
      return 'SubmitComplaint';
    }
    if (lower.includes('late checkout') || lower.includes('extend') || lower.includes('checkout')) {
      return 'RequestLateCheckout';
    }
    if (lower.includes('policy') || lower.includes('rules') || lower.includes('pet') ||
        lower.includes('smoking') || lower.includes('check-in') || lower.includes('cancellation')) {
      return 'AskHotelPolicy';
    }
    if (lower.includes('human') || lower.includes('agent') || lower.includes('staff') ||
        lower.includes('person') || lower.includes('manager') || lower.includes('help me') ||
        lower.includes('speak to') || lower.includes('talk to')) {
      return 'SpeakToHuman';
    }
    
    return 'Unknown';
  };

  // Extract booking number from message
  const extractBookingNumber = (message: string): string | null => {
    const bookingMatch = message.match(/\b(BK\d+)\b/i);
    if (bookingMatch) {
      return bookingMatch[1].toUpperCase();
    }
    
    // Look for number patterns when user mentions booking
    const numberMatch = message.match(/\b\d{5,}\b/);
    if (numberMatch && message.toLowerCase().includes('booking')) {
      return 'BK' + numberMatch[0];
    }
    
    return null;
  };

  const handleRoomAvailability = async () => {
    try {
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('available', true);
      
      if (rooms && rooms.length > 0) {
        addBotMessage("Here are our available rooms:", 'room-cards', rooms);
        setTimeout(() => {
          addBotMessage("Would you like to book any of these rooms? Just let me know which one interests you!");
        }, 1000);
      } else {
        addBotMessage("I'm sorry, we don't have any rooms available at the moment. Please check back later!");
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      addBotMessage("I'm having trouble accessing our room information right now. Please try again in a moment.");
    }
  };

  const handleBookingFlow = (roomName?: string) => {
    if (roomName) {
      const room = messages
        .find(m => m.type === 'room-cards')?.data
        ?.find((r: Room) => r.name === roomName);
      
      if (room) {
        setCurrentBooking({ room });
        addBotMessage(`Great choice! You've selected the ${room.name}. When would you like to check in? (Please provide a date in YYYY-MM-DD format)`);
        setAwaitingInput('checkin');
      }
    } else {
      addBotMessage("I'd be happy to help you book a room! Let me first show you what's available.");
      handleRoomAvailability();
    }
  };

  const processBookingInput = (input: string) => {
    switch (awaitingInput) {
      case 'checkin':
        setCurrentBooking(prev => ({ ...prev, checkIn: input }));
        addBotMessage(`Check-in: ${input}. When would you like to check out? (YYYY-MM-DD format)`);
        setAwaitingInput('checkout');
        break;
      
      case 'checkout':
        setCurrentBooking(prev => ({ ...prev, checkOut: input }));
        addBotMessage("How many guests will be staying?");
        setAwaitingInput('guests');
        break;
      
      case 'guests':
        const guests = parseInt(input);
        setCurrentBooking(prev => ({ ...prev, guests }));
        showBookingSummary({ ...currentBooking, guests });
        setAwaitingInput('');
        break;
    }
  };

  const showBookingSummary = async (booking: BookingData) => {
    if (booking.room && booking.checkIn && booking.checkOut && booking.guests) {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = nights * booking.room.price_per_night;

      addBotMessage("Perfect! Here's your booking summary:", 'booking-summary', {
        ...booking,
        nights,
        totalAmount,
        guestName
      });

      try {
        await supabase.from('bookings').insert({
          room_type: booking.room.type,
          check_in: booking.checkIn,
          check_out: booking.checkOut,
          guests: booking.guests,
          total_amount: totalAmount,
          status: 'confirmed'
        });
        
        setTimeout(() => {
          addBotMessage("Your booking has been confirmed! Is there anything else I can help you with today?");
        }, 1000);
      } catch (error) {
        console.error('Error saving booking:', error);
        addBotMessage("Your booking details look good, but I had trouble saving them. Please contact our front desk to complete the reservation.");
      }
    }
  };

  // BRICK 4: Room Service Handler
  const handleRoomService = () => {
    addBotMessage("I'd be happy to help you with room service! Here's our menu:", 'menu-items', menuItems);
    setTimeout(() => {
      addBotMessage("Click on any item to add it to your order, or tell me what you'd like!");
    }, 1000);
  };

  const handleMenuItemSelection = (item: MenuItem) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
    
    if (isVerified && guestBooking?.room_number) {
      processRoomServiceOrder(guestBooking.room_number);
    } else {
      addBotMessage(`Added ${item.name} ($${item.price}) to your order! What's your room number?`);
      setAwaitingInput('room_number');
    }
  };

  const processRoomServiceOrder = async (roomNumber: string) => {
    const totalAmount = currentOrder.items.reduce((sum, item) => sum + item.price, 0);
    
    try {
      // Convert MenuItem[] to Json by creating a plain object array
      const itemsAsJson = currentOrder.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description
      }));

      await supabase.from('orders').insert({
        session_id: sessionId,
        items: itemsAsJson,
        room_number: roomNumber,
        total_amount: totalAmount,
        status: 'confirmed'
      });

      addBotMessage(`Perfect! Your order has been confirmed for room ${roomNumber}. 
      
Items: ${currentOrder.items.map(item => `• ${item.name} - $${item.price}`).join('\n')}
Total: $${totalAmount}

Estimated delivery time: 25-30 minutes. 

Thank you for your order!`);
      
      setCurrentOrder({items: []});
      setAwaitingInput('');
    } catch (error) {
      console.error('Error saving order:', error);
      addBotMessage("I had trouble processing your order. Please call room service directly at extension 5555.");
    }
  };

  // BRICK 5: Amenities Handler
  const handleAmenitiesInquiry = () => {
    const amenities = {
      'Fitness Center': 'Open 24/7 on the ground floor. Features cardio equipment, free weights, and yoga studio.',
      'Swimming Pool': 'Rooftop pool open 6 AM - 11 PM daily. Heated pool with poolside bar service.',
      'Spa & Wellness': 'Full-service spa offering massages, facials, and wellness treatments. Open 9 AM - 9 PM.',
      'Business Center': '24-hour business center with computers, printers, and meeting rooms.',
      'Parking': 'Valet parking available 24/7. Self-parking garage with 200+ spaces.',
      'WiFi': 'Complimentary high-speed WiFi throughout the hotel.',
      'Concierge': '24/7 concierge service for reservations, tickets, and local recommendations.'
    };

    addBotMessage("Here are our premium amenities and facilities:", 'amenity-info', amenities);
    setTimeout(() => {
      addBotMessage("Would you like to book any services or need more information about a specific amenity?");
    }, 1000);
  };

  // BRICK 6: Complaint Handler
  const handleComplaint = () => {
    addBotMessage("I sincerely apologize for any inconvenience you've experienced. Your comfort and satisfaction are our top priorities. 🙏");
    setTimeout(() => {
      addBotMessage("I'd like to help resolve this immediately. Could you please describe the issue so I can assist you better or connect you with the appropriate department?");
    }, 1000);
    setTimeout(() => {
      addBotMessage("For urgent matters, I can also connect you directly with our Guest Relations Manager. Would you like me to do that?");
    }, 2000);
  };

  // BRICK 7: Policy Handlers
  const handleLateCheckout = () => {
    if (isVerified && guestBooking) {
      addBotMessage(`I can arrange late checkout for you, ${guestBooking.guest_name}! 🕐`);
      setTimeout(() => {
        addBotMessage("Since you're staying in our premium accommodations, late checkout until 2 PM is complimentary for you. Would you like me to arrange this?");
      }, 1000);
    } else {
      addBotMessage("I can help arrange late checkout for you! 🕐");
      setTimeout(() => {
        addBotMessage("Standard checkout is 11 AM. Late checkout until 2 PM is complimentary based on availability. For checkout after 2 PM, there's a fee of $50. What time would you prefer?");
      }, 1000);
    }
  };

  const handlePolicyInquiry = () => {
    const policies = {
      'Check-in/Check-out': 'Check-in: 3 PM | Check-out: 11 AM',
      'Cancellation': 'Free cancellation up to 24 hours before arrival',
      'Pet Policy': 'Pets welcome! $75 per night pet fee. Maximum 2 pets per room.',
      'Smoking': 'Non-smoking hotel. Designated outdoor smoking areas available.',
      'ID Requirements': 'Valid government-issued photo ID required at check-in',
      'Payment': 'We accept all major credit cards. Incidental hold of $100 per night.',
      'Age Policy': 'Guests must be 21+ to check in'
    };

    addBotMessage("Here are our hotel policies:", 'text');
    setTimeout(() => {
      Object.entries(policies).forEach(([policy, details], index) => {
        setTimeout(() => {
          addBotMessage(`**${policy}**: ${details}`);
        }, (index + 1) * 500);
      });
    }, 500);
    
    setTimeout(() => {
      addBotMessage("Do you have any specific questions about our policies?");
    }, 4000);
  };

  // BRICK 8: Human Escalation Handler
  const handleHumanEscalation = () => {
    const contacts = {
      'Front Desk': '(555) 123-4567 ext. 0',
      'Guest Relations': '(555) 123-4567 ext. 101',
      'Concierge': '(555) 123-4567 ext. 200',
      'Room Service': '(555) 123-4567 ext. 300',
      'Housekeeping': '(555) 123-4567 ext. 400',
      'Maintenance': '(555) 123-4567 ext. 500'
    };

    addBotMessage("I understand you'd like to speak with a team member. I'm connecting you with our guest services now! 📞", 'contact-info', contacts);
    setTimeout(() => {
      addBotMessage("Here are direct contact numbers for different departments if you need immediate assistance:");
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);
    
    // Handle booking number verification
    if (awaitingInput === 'booking_verification' || (!isVerified && detectIntent(input) === 'ProvideBookingNumber')) {
      const bookingNumber = extractBookingNumber(input) || input.trim().toUpperCase();
      handleBookingVerification(bookingNumber);
      setAwaitingInput('');
      setInput('');
      return;
    }

    // Handle room service room number input
    if (awaitingInput === 'room_number') {
      processRoomServiceOrder(input);
      setInput('');
      return;
    }

    // Handle booking flow inputs
    if (awaitingInput) {
      processBookingInput(input);
      setInput('');
      return;
    }

    // Regular intent detection
    const intent = detectIntent(input);
    
    switch (intent) {
      case 'ProvideBookingNumber':
        const bookingNumber = extractBookingNumber(input);
        if (bookingNumber) {
          handleBookingVerification(bookingNumber);
        } else {
          addBotMessage("Please provide your booking number (format: BK12345) so I can assist you better.");
          setAwaitingInput('booking_verification');
        }
        break;
      
      case 'GreetGuest':
        if (isVerified && guestName) {
          addBotMessage(`Hello again, ${guestName}! 👋 How can I help you today?`);
        } else {
          addBotMessage("Hello! 👋 Would you like to provide your booking number for personalized assistance, or browse our services?");
        }
        break;
      
      case 'CheckRoomAvailability':
        handleRoomAvailability();
        break;
      
      case 'BookRoom':
        handleBookingFlow();
        break;
      
      case 'RoomServiceOrder':
        handleRoomService();
        break;
      
      case 'AskAboutAmenities':
        handleAmenitiesInquiry();
        break;
      
      case 'SubmitComplaint':
        handleComplaint();
        break;
      
      case 'RequestLateCheckout':
        handleLateCheckout();
        break;
      
      case 'AskHotelPolicy':
        handlePolicyInquiry();
        break;
      
      case 'SpeakToHuman':
        handleHumanEscalation();
        break;
      
      default:
        // Check if user is selecting a room
        const roomSelection = messages
          .find(m => m.type === 'room-cards')?.data
          ?.find((r: Room) => input.toLowerCase().includes(r.name.toLowerCase()));
        
        if (roomSelection) {
          handleBookingFlow(roomSelection.name);
        } else {
          const suggestions = isVerified 
            ? "As a verified guest, I can help you with:\n• Personalized room service recommendations\n• Late checkout arrangements\n• Spa and amenity bookings\n• Special requests based on your preferences"
            : "I can help you with:\n• Booking number verification for personalized service\n• Room availability and reservations\n• Hotel amenities and policies\n• Room service and dining options";
          
          addBotMessage(`I'm here to help! ${suggestions}\n\nWhat would you like to know?`);
        }
    }
    
    setInput('');
  };

  const handleSuggestionClick = (suggestion: SmartSuggestion) => {
    addUserMessage(suggestion.action);
    
    switch (suggestion.id) {
      case 'late_checkout':
        handleLateCheckout();
        break;
      case 'spa_couple':
      case 'spa_return':
        addBotMessage("Perfect! I'd love to book a spa session for you. Our spa offers various treatments including:");
        setTimeout(() => {
          addBotMessage("• Couple's Massage (90 min) - $280\n• Relaxation Package (120 min) - $350\n• Wellness Day Package - Starting at $450\n\nWhich treatment interests you most?");
        }, 1000);
        break;
      case 'romantic_dinner':
        addBotMessage("What a wonderful choice! Our private dining experience includes:");
        setTimeout(() => {
          addBotMessage("• 5-course gourmet meal prepared by our executive chef\n• Wine pairing selection\n• Private balcony setup with candles and flowers\n• Personal server\n\nPrice: $295 per couple. What time would you prefer?");
        }, 1000);
        break;
      case 'coffee_service':
        if (guestBooking?.preferences?.coffee) {
          addBotMessage(`I'll arrange for fresh ${guestBooking.preferences.coffee} to be delivered to room ${guestBooking.room_number}. It should arrive within 15 minutes. Enjoy! ☕`);
        }
        break;
      case 'breakfast_service':
        handleRoomService();
        break;
      default:
        addBotMessage("I'd be happy to help arrange that for you! Let me connect you with the appropriate department.");
    }
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'greeting-buttons' && message.data) {
      const { buttons } = message.data;
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">{message.content}</p>
          <div className="grid gap-3">
            {buttons.map((button: any) => (
              <Card 
                key={button.id}
                className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleGreetingButtonClick(button.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-blue-900 mb-1">{button.title}</h3>
                      <p className="font-medium text-blue-700 mb-2">{button.subtitle}</p>
                      <p className="text-sm text-gray-600">{button.description}</p>
                    </div>
                    <div className="text-blue-600 text-xl">→</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'guest-profile' && message.data) {
      const booking = message.data as GuestBooking;
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Guest Profile</h4>
                <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Name:</strong> {booking.guest_name}</div>
                <div><strong>Room:</strong> {booking.room_number}</div>
                <div><strong>Type:</strong> {booking.room_type}</div>
                <div><strong>Purpose:</strong> {booking.stay_purpose}</div>
                <div><strong>Check-out:</strong> {booking.check_out}</div>
                <div><strong>Guests:</strong> {booking.guests_count}</div>
              </div>
              {booking.special_requests && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                  <strong>Special Requests:</strong> {booking.special_requests}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (message.type === 'smart-suggestions' && message.data) {
      const suggestions = message.data as SmartSuggestion[];
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <div className="grid gap-2">
            {suggestions.map((suggestion) => (
              <Card 
                key={suggestion.id} 
                className={`border cursor-pointer transition-colors hover:shadow-md ${
                  suggestion.priority === 'high' ? 'border-red-300 bg-red-50' :
                  suggestion.priority === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                  'border-blue-300 bg-blue-50'
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{suggestion.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.action}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'room-cards' && message.data) {
      const rooms = message.data as Room[];
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <div className="grid gap-3">
            {rooms.map((room: Room) => (
              <Card key={room.id} className="border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => handleBookingFlow(room.name)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-blue-900">{room.name}</h4>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${room.price_per_night}</p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{room.type}</Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      Up to {room.max_guests} guests
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {room.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'menu-items' && message.data) {
      const items = message.data as MenuItem[];
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <div className="grid gap-2">
            {items.map((item: MenuItem) => (
              <Card key={item.id} className="border border-orange-200 hover:border-orange-300 transition-colors cursor-pointer"
                    onClick={() => handleMenuItemSelection(item)}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Utensils className="w-4 h-4 text-orange-600" />
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      </div>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="font-bold text-green-600">${item.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'amenity-info' && message.data) {
      const amenities = message.data as Record<string, string>;
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <div className="grid gap-2">
            {Object.entries(amenities).map(([amenity, description], index) => (
              <Card key={index} className="border border-purple-200">
                <CardContent className="p-3">
                  <h4 className="font-medium text-purple-900 mb-1">{amenity}</h4>
                  <p className="text-sm text-gray-600">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'contact-info' && message.data) {
      const contacts = message.data as Record<string, string>;
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <div className="grid gap-2">
            {Object.entries(contacts).map(([department, contact], index) => (
              <Card key={index} className="border border-green-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">{department}</h4>
                      <p className="text-sm text-gray-600">{contact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'booking-summary' && message.data) {
      const { room, checkIn, checkOut, guests, nights, totalAmount, guestName } = message.data;
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Guest:</span>
                  <span>{guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Room:</span>
                  <span>{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-in:</span>
                  <span>{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-out:</span>
                  <span>{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Nights:</span>
                  <span>{nights}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">${totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <p className="text-sm whitespace-pre-line">{message.content}</p>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Smart Hotel Concierge {isVerified && <Badge variant="secondary" className="bg-green-600">Verified Guest</Badge>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {renderMessage(message)}
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isVerified ? `How can I help you today, ${guestName}?` : "Type your message or booking number..."}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelChatbotCore;
