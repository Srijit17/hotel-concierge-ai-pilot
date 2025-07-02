
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Star, Send, Phone, Clock, Utensils, User, CheckCircle, CreditCard, Car, Dumbbell, Coffee, Wifi } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type?: 'text' | 'room-cards' | 'booking-summary' | 'menu-items' | 'amenity-info' | 'contact-info' | 'guest-profile' | 'smart-suggestions' | 'greeting-buttons' | 'department-contacts' | 'amenity-booking' | 'payment-options' | 'activity-prompts' | 'ai-response';
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

interface AmenityService {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  availability: string;
}

interface DepartmentContact {
  department: string;
  phone: string;
  email: string;
  hours: string;
  description: string;
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
  const [userActivity, setUserActivity] = useState<string[]>([]);
  const [conversationContext, setConversationContext] = useState<string[]>([]);

  // Enhanced menu with categories
  const menuItems: MenuItem[] = [
    // Breakfast
    { id: '1', name: 'Continental Breakfast', price: 28, category: 'Breakfast', description: 'Fresh pastries, fruits, coffee, juice' },
    { id: '2', name: 'American Breakfast', price: 32, category: 'Breakfast', description: 'Eggs, bacon, sausage, hash browns, toast' },
    { id: '3', name: 'Healthy Bowl', price: 24, category: 'Breakfast', description: 'Greek yogurt, granola, berries, honey' },
    
    // Lunch
    { id: '4', name: 'Club Sandwich', price: 24, category: 'Lunch', description: 'Triple-decker with turkey, bacon, lettuce' },
    { id: '5', name: 'Caesar Salad', price: 18, category: 'Lunch', description: 'Crisp romaine, parmesan, croutons' },
    { id: '6', name: 'Burger & Fries', price: 26, category: 'Lunch', description: 'Angus beef burger with seasoned fries' },
    
    // Dinner
    { id: '7', name: 'Grilled Salmon', price: 36, category: 'Dinner', description: 'Atlantic salmon with seasonal vegetables' },
    { id: '8', name: 'Pasta Carbonara', price: 26, category: 'Dinner', description: 'Creamy pasta with pancetta and parmesan' },
    { id: '9', name: 'Ribeye Steak', price: 42, category: 'Dinner', description: 'Prime ribeye with mashed potatoes' },
    
    // Desserts
    { id: '10', name: 'Chocolate Cake', price: 12, category: 'Dessert', description: 'Rich chocolate layer cake' },
    { id: '11', name: 'Tiramisu', price: 14, category: 'Dessert', description: 'Classic Italian dessert' },
    
    // Beverages
    { id: '12', name: 'Fresh Coffee', price: 6, category: 'Beverages', description: 'Freshly brewed premium blend' },
    { id: '13', name: 'Fresh Orange Juice', price: 8, category: 'Beverages', description: 'Freshly squeezed orange juice' },
    { id: '14', name: 'Wine Selection', price: 15, category: 'Beverages', description: 'House red or white wine' }
  ];

  // Amenity services with booking capabilities
  const amenityServices: AmenityService[] = [
    { id: 'spa1', name: 'Swedish Massage', category: 'Spa', price: 120, duration: '60 min', description: 'Relaxing full-body massage', availability: '9 AM - 9 PM' },
    { id: 'spa2', name: 'Deep Tissue Massage', category: 'Spa', price: 140, duration: '60 min', description: 'Therapeutic deep tissue work', availability: '9 AM - 9 PM' },
    { id: 'spa3', name: 'Couples Massage', category: 'Spa', price: 280, duration: '90 min', description: 'Side-by-side relaxation', availability: '10 AM - 8 PM' },
    { id: 'spa4', name: 'Facial Treatment', category: 'Spa', price: 95, duration: '45 min', description: 'Rejuvenating facial therapy', availability: '9 AM - 9 PM' },
    { id: 'gym1', name: 'Personal Training', category: 'Fitness', price: 80, duration: '60 min', description: 'One-on-one fitness session', availability: '6 AM - 10 PM' },
    { id: 'gym2', name: 'Yoga Class', category: 'Fitness', price: 25, duration: '60 min', description: 'Group yoga session', availability: '7 AM, 6 PM' },
    { id: 'pool1', name: 'Pool Cabana Rental', category: 'Pool', price: 150, duration: 'Full day', description: 'Private poolside cabana', availability: '8 AM - 8 PM' },
    { id: 'concierge1', name: 'City Tour Booking', category: 'Concierge', price: 200, duration: '4 hours', description: 'Guided city exploration', availability: '24/7' },
    { id: 'concierge2', name: 'Restaurant Reservations', category: 'Concierge', price: 0, duration: 'Instant', description: 'Premium restaurant bookings', availability: '24/7' }
  ];

  // Department contact information
  const departmentContacts: DepartmentContact[] = [
    {
      department: 'Front Desk',
      phone: '(555) 123-4567 ext. 0',
      email: 'frontdesk@grandhotel.com',
      hours: '24/7',
      description: 'Check-in, check-out, general inquiries',
      icon: '🏨'
    },
    {
      department: 'Concierge',
      phone: '(555) 123-4567 ext. 200',
      email: 'concierge@grandhotel.com',
      hours: '6 AM - 12 AM',
      description: 'Tour bookings, restaurant reservations, tickets',
      icon: '🎫'
    },
    {
      department: 'Spa & Wellness',
      phone: '(555) 123-4567 ext. 300',
      email: 'spa@grandhotel.com',
      hours: '9 AM - 9 PM',
      description: 'Spa treatments, wellness services',
      icon: '💆‍♀️'
    },
    {
      department: 'Room Service',
      phone: '(555) 123-4567 ext. 400',
      email: 'roomservice@grandhotel.com',
      hours: '6 AM - 2 AM',
      description: 'Food delivery, in-room dining',
      icon: '🍽️'
    },
    {
      department: 'Fitness Center',
      phone: '(555) 123-4567 ext. 500',
      email: 'fitness@grandhotel.com',
      hours: '24/7',
      description: 'Gym access, personal training, classes',
      icon: '💪'
    },
    {
      department: 'Housekeeping',
      phone: '(555) 123-4567 ext. 600',
      email: 'housekeeping@grandhotel.com',
      hours: '7 AM - 11 PM',
      description: 'Room cleaning, maintenance requests',
      icon: '🧹'
    },
    {
      department: 'Valet & Parking',
      phone: '(555) 123-4567 ext. 700',
      email: 'valet@grandhotel.com',
      hours: '24/7',
      description: 'Car parking, valet services',
      icon: '🚗'
    },
    {
      department: 'Business Center',
      phone: '(555) 123-4567 ext. 800',
      email: 'business@grandhotel.com',
      hours: '24/7',
      description: 'Printing, meeting rooms, office services',
      icon: '💼'
    }
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
        addBotMessage("👋 Welcome to The Grand Luxury Hotel! I'm Sofia, your AI-powered concierge assistant.", 'text');
        setTimeout(() => {
          addBotMessage("I can help you with bookings, room service, amenities, recommendations, and answer any questions about our hotel. How would you like to proceed today?", 'greeting-buttons', {
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
                subtitle: 'Looking for information',
                description: 'Browse rooms, services, and get recommendations'
              },
              {
                id: 'ask_ai',
                title: '🤖 Ask AI Assistant',
                subtitle: 'General questions',
                description: 'Get instant answers about hotel services and local area'
              }
            ]
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const trackUserActivity = (activity: string) => {
    setUserActivity(prev => [...prev, activity]);
    setConversationContext(prev => [...prev, activity]);
  };

  const generateIntelligentResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Context-aware responses based on conversation history
    if (conversationContext.includes('spa') && (input.includes('tired') || input.includes('relax'))) {
      return "Since you were interested in spa services, I'd recommend our Swedish Massage for ultimate relaxation, or perhaps our Couples Massage if you're with someone special. Would you like me to show you our complete spa menu?";
    }
    
    if (conversationContext.includes('food') && (input.includes('recommend') || input.includes('suggest'))) {
      return `Based on your interest in dining, I'd suggest our signature dishes: ${isVerified && guestBooking?.stay_purpose === 'business' ? 'our Business Lunch special or quick room service options' : 'our romantic dinner menu with wine pairings'}. Would you like to see our full menu?`;
    }

    // Time-based responses
    const hour = new Date().getHours();
    if (input.includes('hungry') || input.includes('eat')) {
      if (hour < 11) {
        return "Good morning! Perfect timing for breakfast. Our Continental Breakfast is very popular, or try our healthy options. Would you like to see our breakfast menu?";
      } else if (hour < 17) {
        return "Great timing for lunch! Our Club Sandwich and Caesar Salad are customer favorites. Shall I show you our lunch options?";
      } else {
        return "Evening dining sounds perfect! Our Grilled Salmon and Ribeye Steak are highly recommended for dinner. Would you like to explore our dinner menu?";
      }
    }

    // Weather-based suggestions (simulated)
    if (input.includes('weather') || input.includes('outside')) {
      return "While I don't have real-time weather data, I can suggest indoor activities like our spa services, fitness center, or perhaps room service with a view from your room. What interests you most?";
    }

    // Local area information
    if (input.includes('nearby') || input.includes('around') || input.includes('local')) {
      return "I'd be happy to help with local recommendations! Our concierge team specializes in city tours, restaurant reservations, and local attractions. Would you like me to connect you with them or show you our tour packages?";
    }

    // Default intelligent response
    return "I'm here to make your stay exceptional! I can help with room service, spa bookings, local recommendations, and answer any questions about our amenities. What would you like to know more about?";
  };

  const generateActivityPrompts = () => {
    const prompts = [];
    
    if (userActivity.includes('room_service') && !userActivity.includes('spa')) {
      prompts.push("Since you've ordered room service, would you like to book a relaxing spa treatment to complete your in-room experience?");
    }
    
    if (userActivity.includes('spa') && !userActivity.includes('restaurant')) {
      prompts.push("After your spa session, would you like me to make dinner reservations at our rooftop restaurant or arrange romantic room service?");
    }
    
    if (userActivity.includes('fitness') && !userActivity.includes('pool')) {
      prompts.push("Great workout! How about relaxing by our rooftop pool with a refreshing drink or booking a recovery massage?");
    }

    if (isVerified && guestBooking?.stay_purpose === 'business' && !userActivity.includes('business_center')) {
      prompts.push("For your business stay, would you like information about our business center, meeting rooms, or express laundry services?");
    }
    
    return prompts;
  };

  const addBotMessage = (content: string, type: 'text' | 'room-cards' | 'booking-summary' | 'menu-items' | 'amenity-info' | 'contact-info' | 'guest-profile' | 'smart-suggestions' | 'greeting-buttons' | 'department-contacts' | 'amenity-booking' | 'payment-options' | 'activity-prompts' | 'ai-response' = 'text', data?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      content,
      timestamp: new Date(),
      type,
      data
    };
    setMessages(prev => [...prev, message]);
    
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
    
    if (sessionId) {
      supabase.from('messages').insert({
        session_id: sessionId,
        sender: 'user',
        content,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleGreetingButtonClick = (buttonId: string) => {
    if (buttonId === 'existing_guest') {
      addUserMessage("I'm an existing guest");
      addBotMessage("Perfect! Please provide your booking number (format: BK12345) so I can access your reservation details and provide personalized assistance.");
      setAwaitingInput('booking_verification');
    } else if (buttonId === 'new_inquiry') {
      addUserMessage("I'd like to make a new inquiry");
      addBotMessage("Wonderful! I'm here to help with any questions about our hotel. Would you like to see available rooms, learn about our amenities, or get information about our services?");
      setTimeout(() => {
        addBotMessage("Here are some popular options:", 'smart-suggestions', [
          { id: 'rooms', title: 'View Available Rooms', description: 'See our luxury accommodations', action: 'rooms', priority: 'high', icon: '🏨' },
          { id: 'amenities', title: 'Spa & Amenities', description: 'Relaxation and wellness services', action: 'amenities', priority: 'medium', icon: '💆‍♀️' },
          { id: 'dining', title: 'Dining Options', description: 'Room service and restaurant info', action: 'dining', priority: 'medium', icon: '🍽️' }
        ]);
      }, 1000);
    } else if (buttonId === 'ask_ai') {
      addUserMessage("I'd like to ask the AI assistant");
      trackUserActivity('ai_interaction');
      addBotMessage("Great! I'm your AI assistant with extensive knowledge about our hotel and local area. You can ask me anything - from room amenities and service details to local recommendations and travel tips. What would you like to know?", 'ai-response');
    }
  };

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

      const processedBooking: GuestBooking = {
        ...booking,
        services_used: Array.isArray(booking.services_used) ? booking.services_used : 
                      (typeof booking.services_used === 'string' && booking.services_used !== '') ? 
                      JSON.parse(booking.services_used) : []
      };

      setGuestBooking(processedBooking);
      setGuestName(processedBooking.guest_name);
      setIsVerified(true);

      addBotMessage(`✅ Welcome back, ${processedBooking.guest_name}! I've found your booking and I'm now your personalized AI assistant.`, 'guest-profile', processedBooking);
      
      setTimeout(() => {
        generateSmartSuggestions(processedBooking);
      }, 1500);

    } catch (error) {
      console.error('Error verifying booking:', error);
      addBotMessage("I'm having trouble accessing our booking system right now. Please try again in a moment.", 'text');
    }
  };

  const generateSmartSuggestions = (booking: GuestBooking) => {
    const suggestions: SmartSuggestion[] = [];
    const checkOutDate = new Date(booking.check_out);
    const today = new Date();
    const daysUntilCheckout = Math.ceil((checkOutDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

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

    if (booking.stay_purpose === 'honeymoon') {
      suggestions.push({
        id: 'spa_couple',
        title: "Couple's Spa Experience",
        description: 'Perfect for your romantic getaway - 20% off couple treatments',
        action: 'Book spa session',
        priority: 'high',
        icon: '💆‍♀️'
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

    // AI-powered suggestions based on guest profile
    suggestions.push({
      id: 'ai_concierge',
      title: 'AI Concierge Service',
      description: 'Get personalized recommendations and instant answers',
      action: 'Chat with AI',
      priority: 'medium',
      icon: '🤖'
    });

    if (suggestions.length > 0) {
      addBotMessage("Based on your stay details, here are some personalized AI-powered recommendations:", 'smart-suggestions', suggestions);
    }
  };

  const handleSmartSuggestionClick = (suggestion: SmartSuggestion) => {
    addUserMessage(suggestion.action);
    
    switch (suggestion.id) {
      case 'rooms':
        handleRoomAvailability();
        break;
      case 'amenities':
        handleAmenityBooking();
        break;
      case 'dining':
        handleFoodOrdering();
        break;
      case 'ai_concierge':
        trackUserActivity('ai_concierge');
        addBotMessage("I'm your AI concierge! I can provide detailed information about our facilities, make intelligent recommendations based on your preferences, help with local area guidance, and answer any questions about your stay. What would you like to explore?", 'ai-response');
        break;
      default:
        addBotMessage(`I'd be happy to help you with ${suggestion.title.toLowerCase()}. Let me connect you with the right service.`, 'text');
    }
  };

  const handleDepartmentContacts = () => {
    addBotMessage("Here are our department contact details for direct assistance:", 'department-contacts', departmentContacts);
  };

  const handleAmenityBooking = () => {
    trackUserActivity('amenity_inquiry');
    addBotMessage("Here are our available amenities and services you can book:", 'amenity-booking', amenityServices);
  };

  const handleAmenitySelection = (amenity: AmenityService) => {
    trackUserActivity(amenity.category.toLowerCase());
    addBotMessage(`Excellent choice! You've selected ${amenity.name}. This ${amenity.category.toLowerCase()} service costs $${amenity.price} for ${amenity.duration}.`, 'text');
    setTimeout(() => {
      addBotMessage("Would you like to proceed with booking and payment?", 'payment-options', {
        service: amenity,
        type: 'amenity'
      });
    }, 1000);
  };

  const handleFoodOrdering = () => {
    trackUserActivity('room_service');
    addBotMessage("I'd be delighted to help you with our dining options! Here's our complete menu organized by category:", 'menu-items', {
      items: menuItems,
      categorized: true
    });
  };

  const handleMenuItemSelection = (item: MenuItem) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
    
    addBotMessage(`Added ${item.name} ($${item.price}) to your order! 🍽️`, 'text');
    
    setTimeout(() => {
      const totalAmount = [...currentOrder.items, item].reduce((sum, orderItem) => sum + orderItem.price, 0);
      addBotMessage(`Current order total: $${totalAmount}. Would you like to add more items or proceed to payment?`, 'payment-options', {
        order: [...currentOrder.items, item],
        type: 'food',
        total: totalAmount
      });
    }, 1000);
  };

  const handlePayment = (data: any) => {
    const paymentUrl = "http://localhost:3000/";
    addBotMessage(`Processing your payment request... Redirecting you to our secure payment gateway.`, 'text');
    
    setTimeout(() => {
      window.open(paymentUrl, '_blank');
      addBotMessage(`Payment window opened! Once payment is complete, you'll receive a confirmation email. Your ${data.type === 'amenity' ? 'service booking' : 'food order'} will be processed immediately after payment. Is there anything else I can help you with?`, 'text');
      
      // Generate activity-based prompts
      const prompts = generateActivityPrompts();
      if (prompts.length > 0) {
        setTimeout(() => {
          addBotMessage("Based on your activity, here are some additional AI-powered suggestions:", 'activity-prompts', prompts);
        }, 2000);
      }
    }, 2000);
  };

  const detectIntent = (message: string): string => {
    const lower = message.toLowerCase();
    
    // AI-powered intent detection with more sophisticated patterns
    if (lower.includes('booking') && (lower.includes('number') || lower.includes('bk') || /\bbk\d+/i.test(message))) {
      return 'ProvideBookingNumber';
    }
    
    if (/\bbk\d+/i.test(message) || (lower.includes('my booking') || lower.includes('existing guest'))) {
      return 'ProvideBookingNumber';
    }
    
    if (lower.match(/(contact|phone|department|call|speak|talk)/)) {
      return 'RequestContacts';
    }
    
    if (lower.match(/(spa|massage|fitness|pool|amenity|wellness|relax|treatment)/)) {
      return 'BookAmenities';
    }
    
    if (lower.match(/(room service|food|menu|order|hungry|eat|breakfast|lunch|dinner|drink)/)) {
      return 'RoomServiceOrder';
    }
    
    if (lower.includes('room') && (lower.includes('available') || lower.includes('availability'))) {
      return 'CheckRoomAvailability';
    }
    
    if (lower.match(/(hello|hi|hey|good morning|good afternoon|good evening)/)) {
      return 'GreetGuest';
    }

    // AI-powered responses for complex queries
    if (lower.match(/(recommend|suggest|best|what should|advice|help me choose)/)) {
      return 'AIRecommendation';
    }

    if (lower.match(/(weather|outside|climate|temperature)/)) {
      return 'WeatherInquiry';
    }

    if (lower.match(/(nearby|around|local|area|city|tourist|attraction)/)) {
      return 'LocalInformation';
    }
    
    return 'AIGeneralInquiry';
  };

  const extractBookingNumber = (message: string): string | null => {
    const bookingMatch = message.match(/\b(BK\d+)\b/i);
    if (bookingMatch) {
      return bookingMatch[1].toUpperCase();
    }
    
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
        addBotMessage("Here are our available luxury accommodations:", 'room-cards', rooms);
        setTimeout(() => {
          addBotMessage("Each room is carefully designed for comfort and elegance. Would you like to book any of these rooms or need more information about specific amenities?");
        }, 1000);
      } else {
        addBotMessage("I apologize, but we don't have any rooms available at the moment. However, I can put you on our waitlist or help you with other services. Would you like me to check availability for different dates?");
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      addBotMessage("I'm having trouble accessing our room information right now. Let me connect you with our front desk for immediate assistance.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);
    
    if (awaitingInput === 'booking_verification' || (!isVerified && detectIntent(input) === 'ProvideBookingNumber')) {
      const bookingNumber = extractBookingNumber(input) || input.trim().toUpperCase();
      handleBookingVerification(bookingNumber);
      setAwaitingInput('');
      setInput('');
      return;
    }

    const intent = detectIntent(input);
    
    switch (intent) {
      case 'RequestContacts':
        handleDepartmentContacts();
        break;
      
      case 'BookAmenities':
        handleAmenityBooking();
        break;
      
      case 'RoomServiceOrder':
        handleFoodOrdering();
        break;
      
      case 'CheckRoomAvailability':
        handleRoomAvailability();
        break;
      
      case 'GreetGuest':
        if (isVerified && guestName) {
          addBotMessage(`Hello again, ${guestName}! 👋 I'm your AI assistant and I'm here to make your stay exceptional. How can I help you today?`);
        } else {
          addBotMessage("Hello! 👋 I'm Sofia, your AI-powered hotel assistant. Would you like to provide your booking number for personalized service, or shall I help you explore our amenities and services?");
        }
        break;

      case 'AIRecommendation':
        trackUserActivity('ai_recommendation');
        const personalizedResponse = generateIntelligentResponse(input);
        addBotMessage(personalizedResponse, 'ai-response');
        break;

      case 'WeatherInquiry':
        addBotMessage("While I don't have real-time weather data, I can suggest wonderful indoor activities! Our spa offers a tranquil escape, our fitness center is perfect for staying active, or you could enjoy our rooftop bar with panoramic city views regardless of weather. What sounds appealing?", 'ai-response');
        break;

      case 'LocalInformation':
        addBotMessage("I'd love to help you explore the local area! Our concierge team has curated amazing experiences including guided city tours, restaurant recommendations, cultural attractions, and hidden gems. Would you like me to show you our tour packages or connect you directly with our local experts?", 'ai-response');
        break;
      
      case 'AIGeneralInquiry':
      default:
        trackUserActivity('general_inquiry');
        const intelligentResponse = generateIntelligentResponse(input);
        addBotMessage(intelligentResponse, 'ai-response');
        
        // Add contextual suggestions after AI response
        setTimeout(() => {
          const suggestions = [
            "🏨 View available rooms and suites",
            "🍽️ Explore our dining options",
            "💆‍♀️ Discover spa and wellness services",
            "📞 Contact specific departments",
            "🎯 Get personalized recommendations"
          ];
          
          addBotMessage("Here are some things I can help you with:", 'text');
        }, 1500);
        break;
    }
    
    setInput('');
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

    if (message.type === 'smart-suggestions' && message.data) {
      const suggestions = message.data as SmartSuggestion[];
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <div className="grid gap-2">
            {suggestions.map((suggestion) => (
              <Card 
                key={suggestion.id}
                className="border border-purple-200 bg-purple-50 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleSmartSuggestionClick(suggestion)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                    <Badge variant={suggestion.priority === 'high' ? 'default' : 'secondary'}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'department-contacts' && message.data) {
      const contacts = message.data as DepartmentContact[];
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <div className="grid gap-3">
            {contacts.map((contact, index) => (
              <Card key={index} className="border border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{contact.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 mb-1">{contact.department}</h4>
                      <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{contact.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'amenity-booking' && message.data) {
      const amenities = message.data as AmenityService[];
      const categories = [...new Set(amenities.map(a => a.category))];
      
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          {categories.map(category => (
            <div key={category} className="mb-4">
              <h4 className="font-semibold text-purple-900 mb-2">{category}</h4>
              <div className="grid gap-2">
                {amenities.filter(a => a.category === category).map((amenity) => (
                  <Card 
                    key={amenity.id} 
                    className="border border-purple-200 hover:border-purple-400 transition-colors cursor-pointer"
                    onClick={() => handleAmenitySelection(amenity)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{amenity.name}</h5>
                          <p className="text-xs text-gray-600 mb-1">{amenity.description}</p>
                          <div className="flex gap-2 text-xs text-purple-600">
                            <Badge variant="outline">{amenity.duration}</Badge>
                            <Badge variant="outline">{amenity.availability}</Badge>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <p className="font-bold text-green-600">${amenity.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (message.type === 'menu-items' && message.data) {
      const { items, categorized } = message.data;
      const categories = [...new Set(items.map((item: MenuItem) => item.category))];
      
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          {categorized ? (
            categories.map(category => (
              <div key={category} className="mb-4">
                <h4 className="font-semibold text-orange-900 mb-2">{category}</h4>
                <div className="grid gap-2">
                  {items.filter((item: MenuItem) => item.category === category).map((item: MenuItem) => (
                    <Card 
                      key={item.id} 
                      className="border border-orange-200 hover:border-orange-300 transition-colors cursor-pointer"
                      onClick={() => handleMenuItemSelection(item)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Utensils className="w-4 h-4 text-orange-600" />
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
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
            ))
          ) : (
            <div className="grid gap-2">
              {items.map((item: MenuItem) => (
                <Card 
                  key={item.id} 
                  className="border border-orange-200 hover:border-orange-300 transition-colors cursor-pointer"
                  onClick={() => handleMenuItemSelection(item)}
                >
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
          )}
        </div>
      );
    }

    if (message.type === 'payment-options' && message.data) {
      const { service, order, type, total } = message.data;
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Payment Summary</h4>
              </div>
              {type === 'amenity' && service && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${service.price}</span>
                  </div>
                </div>
              )}
              {type === 'food' && order && (
                <div className="space-y-2 text-sm">
                  <div className="space-y-1">
                    {order.map((item: MenuItem, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">${total}</span>
                  </div>
                </div>
              )}
              <Button 
                className="w-full mt-3 bg-green-600 hover:bg-green-700"
                onClick={() => handlePayment(message.data)}
              >
                Proceed to Secure Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (message.type === 'activity-prompts' && message.data) {
      const prompts = message.data as string[];
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <div className="space-y-2">
            {prompts.map((prompt, index) => (
              <Card key={index} className="border border-blue-200 bg-blue-50">
                <CardContent className="p-3">
                  <p className="text-sm text-blue-900">{prompt}</p>
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

    if (message.type === 'ai-response') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="text-xs text-gray-500">Intelligent Response</span>
          </div>
          <p className="text-sm whitespace-pre-line">{message.content}</p>
        </div>
      );
    }

    return (
      <p className="text-sm whitespace-pre-line">{message.content}</p>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">AI</span>
          </div>
          Smart Hotel AI Concierge {isVerified && <Badge variant="secondary" className="bg-green-600">Verified Guest</Badge>}
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
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : message.type === 'ai-response'
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-gray-900 border border-purple-200'
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
              placeholder={isVerified ? `How can I assist you today, ${guestName}?` : "Ask me anything about the hotel, amenities, or local area..."}
              className="flex-1"
            />
            <Button type="submit" size="icon" className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelChatbotCore;
