import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Users, MapPin, Star, Send, Phone, Clock, Utensils, User, CheckCircle, 
  CreditCard, Car, Dumbbell, Coffee, Wifi, Bot, AlertCircle, MessageSquare, Brain 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Enhanced interfaces with complete typing
interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type?: 'text' | 'room-cards' | 'booking-summary' | 'menu-items' | 'amenity-info' | 'contact-info' | 'guest-profile' | 'smart-suggestions' | 'greeting-buttons' | 'department-contacts' | 'amenity-booking' | 'payment-options' | 'activity-prompts' | 'ai-response';
  data?: any;
  intent?: string;
  confidence?: number;
  entities?: any;
}

interface Room {
  id: string;
  name: string;
  type: string;
  price_per_night: number;
  features: string[];
  max_guests: number;
  image_url: string;
  available?: boolean;
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

interface AmenityService {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  availability: string;
}

interface SessionContext {
  guestName?: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  roomNumber?: string;
  fallbackCount: number;
  previousIntents: string[];
  visitCount: number;
  currentBooking?: any;
}

// Advanced Intent Training Data
const intentTrainingData = {
  'GreetGuest': {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'greetings', 'good day'],
    confidence: 0.95,
    weight: 1
  },
  'CheckRoomAvailability': {
    patterns: ['room', 'available', 'vacancy', 'free', 'tonight', 'tomorrow', 'weekend', 'suite', 'king', 'queen', 'double', 'single', 'view', 'balcony', 'ocean', 'check availability', 'any rooms', 'book', 'reserve'],
    confidence: 0.92,
    weight: 2
  },
  'BookRoom': {
    patterns: ['book', 'reserve', 'reservation', 'confirm booking', 'take it', 'yes book', 'proceed', 'confirm', 'make reservation', 'i want', 'ill take'],
    confidence: 0.94,
    weight: 3
  },
  'RequestRoomService': {
    patterns: ['room service', 'food', 'order', 'breakfast', 'lunch', 'dinner', 'menu', 'hungry', 'eat', 'drink', 'coffee', 'tea', 'sandwich', 'meal', 'deliver'],
    confidence: 0.90,
    weight: 2
  },
  'AskAboutAmenities': {
    patterns: ['gym', 'pool', 'spa', 'amenities', 'facilities', 'wifi', 'fitness', 'swimming', 'restaurant', 'bar', 'parking', 'concierge', 'business center', 'laundry', 'dry cleaning'],
    confidence: 0.88,
    weight: 2
  },
  'RequestLateCheckout': {
    patterns: ['late checkout', 'extend', 'checkout time', 'stay longer', 'more time', 'check out later', 'until', 'extra hours'],
    confidence: 0.87,
    weight: 3
  },
  'CancelReservation': {
    patterns: ['cancel', 'cancellation', 'remove booking', 'delete reservation', 'cant make it', 'need to cancel', 'cancel my'],
    confidence: 0.95,
    weight: 4
  },
  'ChangeReservation': {
    patterns: ['change', 'modify', 'update', 'reschedule', 'different date', 'edit booking', 'alter reservation'],
    confidence: 0.89,
    weight: 3
  },
  'Complaints': {
    patterns: ['problem', 'issue', 'broken', 'not working', 'dirty', 'noisy', 'cold', 'hot', 'complaint', 'wrong', 'bad', 'terrible', 'awful', 'disappointed'],
    confidence: 0.91,
    weight: 4
  },
  'HotelPolicyInquiry': {
    patterns: ['policy', 'rules', 'pet', 'smoking', 'cancellation policy', 'check-in time', 'check-out time', 'parking', 'dress code', 'children', 'age limit'],
    confidence: 0.86,
    weight: 2
  },
  'SpeakToHuman': {
    patterns: ['human', 'person', 'agent', 'staff', 'concierge', 'manager', 'help', 'talk to someone', 'real person', 'transfer', 'connect'],
    confidence: 0.93,
    weight: 3
  },
  'ThankYou': {
    patterns: ['thank', 'thanks', 'appreciate', 'grateful', 'perfect', 'great', 'awesome', 'wonderful', 'excellent'],
    confidence: 0.85,
    weight: 1
  }
};

const UnifiedHotelChatbot = () => {
  // State management
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
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    fallbackCount: 0,
    previousIntents: [],
    visitCount: 1
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample data
  const menuItems: MenuItem[] = [
    { id: '1', name: 'Continental Breakfast', price: 25, category: 'Breakfast', description: 'Fresh pastries, fruits, coffee' },
    { id: '2', name: 'Grilled Salmon', price: 35, category: 'Main Course', description: 'Atlantic salmon with vegetables' },
    { id: '3', name: 'Caesar Salad', price: 18, category: 'Salads', description: 'Classic caesar with parmesan' },
    { id: '4', name: 'Chocolate Cake', price: 12, category: 'Desserts', description: 'Rich chocolate layer cake' }
  ];

  const amenityServices: AmenityService[] = [
    { id: '1', name: 'Spa Massage', category: 'Spa', price: 120, duration: '60 min', description: 'Relaxing full body massage', availability: '9 AM - 8 PM' },
    { id: '2', name: 'Pool Access', category: 'Recreation', price: 0, duration: 'All day', description: 'Rooftop infinity pool', availability: '6 AM - 10 PM' },
    { id: '3', name: 'Fitness Center', category: 'Fitness', price: 0, duration: 'All day', description: 'State-of-the-art gym', availability: '24/7' },
    { id: '4', name: 'Business Center', category: 'Business', price: 15, duration: '1 hour', description: 'Printing and meeting rooms', availability: '6 AM - 10 PM' }
  ];

  // Memoized data for performance
  const categorizedMenuItems = useMemo(() => {
    const categories = [...new Set(menuItems.map(item => item.category))];
    return categories.map(category => ({
      category,
      items: menuItems.filter(item => item.category === category)
    }));
  }, []);

  const categorizedAmenityServices = useMemo(() => {
    const categories = [...new Set(amenityServices.map(a => a.category))];
    return categories.map(category => ({
      category,
      items: amenityServices.filter(a => a.category === category)
    }));
  }, []);

  // Initialize chatbot
  useEffect(() => {
    initializeSession();
    addBotMessage("Welcome to The Grand Luxury Hotel! I'm Sofia, your AI-powered concierge assistant. I'm here to make your stay absolutely perfect. How may I assist you today?", 'greeting-buttons');
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          channel: 'web_widget',
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(session.id);
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  // Advanced intent detection with training data integration
  const detectIntent = (text: string): { intent: string; confidence: number; entities: any } => {
    const lowerText = text.toLowerCase();
    let bestMatch = { intent: 'fallback', confidence: 0.1, entities: {} };

    // Use training data for intent detection
    for (const [intentName, intentData] of Object.entries(intentTrainingData)) {
      const matches = intentData.patterns.filter((pattern: string) => lowerText.includes(pattern));
      if (matches.length > 0) {
        const baseScore = matches.length * intentData.weight * 0.1;
        const confidence = Math.min(intentData.confidence + baseScore, 0.98);
        
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            intent: intentName,
            confidence,
            entities: extractEntities(text, intentName)
          };
        }
      }
    }

    // Context-based follow-up detection
    if (sessionContext.previousIntents.length > 0) {
      const lastIntent = sessionContext.previousIntents[sessionContext.previousIntents.length - 1];
      
      if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much')) {
        return { intent: lastIntent, confidence: 0.85, entities: { followUp: 'pricing' } };
      }
      if (lowerText.match(/^(yes|yeah|ok|sure|sounds good|perfect)$/i)) {
        return { intent: lastIntent, confidence: 0.90, entities: { confirmation: true } };
      }
      if (lowerText.match(/^(no|nope|not now|maybe later)$/i)) {
        return { intent: 'decline', confidence: 0.88, entities: { decline: true } };
      }
    }

    return bestMatch;
  };

  const extractEntities = (text: string, intent: string): any => {
    const entities: any = {};
    const lowerText = text.toLowerCase();

    // Date extraction
    if (lowerText.includes('tonight')) entities.date = 'tonight';
    if (lowerText.includes('tomorrow')) entities.date = 'tomorrow';
    if (lowerText.includes('weekend')) entities.date = 'weekend';
    if (lowerText.includes('next week')) entities.date = 'next week';
    if (lowerText.match(/\d{1,2}[\/\-]\d{1,2}/)) entities.date = 'specific_date';

    // Room type extraction
    if (lowerText.includes('suite')) entities.roomType = 'suite';
    if (lowerText.includes('deluxe')) entities.roomType = 'deluxe';
    if (lowerText.includes('ocean view') || lowerText.includes('sea view')) entities.roomType = 'ocean view';
    if (lowerText.includes('king')) entities.bedType = 'king';
    if (lowerText.includes('queen')) entities.bedType = 'queen';

    // Guest count
    const guestMatch = text.match(/(\d+)\s*(guest|person|people)/i);
    if (guestMatch) entities.guests = parseInt(guestMatch[1]);

    // Food items
    if (intent === 'RequestRoomService') {
      if (lowerText.includes('breakfast')) entities.meal = 'breakfast';
      if (lowerText.includes('lunch')) entities.meal = 'lunch';
      if (lowerText.includes('dinner')) entities.meal = 'dinner';
      if (lowerText.includes('coffee')) entities.beverage = 'coffee';
    }

    // Time extraction
    const timeMatch = text.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm)/i);
    if (timeMatch) entities.time = timeMatch[0];

    return entities;
  };

  const addBotMessage = (content: string, type?: string, data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      content,
      timestamp: new Date(),
      type: type as any,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleFallback = (userText: string, confidence: number) => {
    const fallbackCount = sessionContext.fallbackCount + 1;
    
    setSessionContext(prev => ({
      ...prev,
      fallbackCount
    }));

    if (fallbackCount === 1) {
      return {
        text: "I want to make sure I understand you perfectly. Could you rephrase that or tell me more specifically what you'd like help with? I can assist with room bookings, restaurant recommendations, amenities, or connecting you with our staff.",
        type: 'text' as const
      };
    } else if (fallbackCount === 2) {
      return {
        text: "I apologize for the confusion. Let me offer you some options I can definitely help with:",
        type: 'smart-suggestions' as const,
        data: {
          suggestions: [
            { title: "Check Room Availability", action: "room_availability", description: "Find and book rooms" },
            { title: "Order Room Service", action: "room_service", description: "Browse our delicious menu" },
            { title: "Hotel Amenities", action: "amenities", description: "Explore our facilities" },
            { title: "Speak to Staff", action: "human_agent", description: "Connect with our team" }
          ]
        }
      };
    } else {
      return {
        text: "I'd love to connect you with one of our helpful staff members who can assist you better. Would you like me to transfer you to our concierge desk?",
        type: 'contact-info' as const,
        data: {
          departments: [
            { name: "Front Desk", phone: "+1 (555) 123-4567", description: "Check-in, reservations, general inquiries" },
            { name: "Concierge", phone: "+1 (555) 123-4568", description: "Local recommendations, bookings, special requests" },
            { name: "Room Service", phone: "+1 (555) 123-4569", description: "Food orders and dining assistance" }
          ]
        }
      };
    }
  };

  const generateResponse = (intent: string, confidence: number, entities: any, userText: string) => {
    console.log(`Intent: ${intent}, Confidence: ${confidence}, Entities:`, entities);

    if (confidence < 0.65) {
      return handleFallback(userText, confidence);
    }

    // Update session context
    setSessionContext(prev => ({
      ...prev,
      previousIntents: [...prev.previousIntents.slice(-2), intent],
      fallbackCount: 0
    }));

    const guestName = sessionContext.guestName || '';
    const personalGreeting = guestName ? `${guestName}, ` : '';

    switch (intent) {
      case 'GreetGuest':
        const timeGreeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';
        return {
          text: `${timeGreeting}! Welcome to The Grand Luxury Hotel. I'm Sofia, your AI concierge assistant. I'm delighted to help make your stay extraordinary. What can I assist you with today?`,
          type: 'greeting-buttons' as const,
          data: {
            buttons: [
              { text: "Check Availability", action: "room_availability" },
              { text: "Room Service", action: "room_service" },
              { text: "Hotel Amenities", action: "amenities" },
              { text: "Guest Services", action: "services" }
            ]
          }
        };

      case 'CheckRoomAvailability':
        if (entities.followUp === 'pricing') {
          return {
            text: `Here are our current rates${personalGreeting ? ` for you, ${personalGreeting}` : ''}:`,
            type: 'room-cards' as const,
            data: {
              rooms: [
                { 
                  id: '1', 
                  name: 'Sea View Deluxe', 
                  type: 'deluxe', 
                  price_per_night: 349, 
                  features: ['Ocean balcony', 'King bed', 'Complimentary champagne'], 
                  max_guests: 2,
                  image_url: '/placeholder.svg',
                  available: true
                },
                { 
                  id: '2', 
                  name: 'City View Premium', 
                  type: 'premium', 
                  price_per_night: 299, 
                  features: ['City skyline', 'Queen bed', 'Work desk'], 
                  max_guests: 2,
                  image_url: '/placeholder.svg',
                  available: true
                },
                { 
                  id: '3', 
                  name: 'Garden Suite', 
                  type: 'suite', 
                  price_per_night: 449, 
                  features: ['Living area', 'Garden terrace', 'Butler service'], 
                  max_guests: 4,
                  image_url: '/placeholder.svg',
                  available: true
                }
              ]
            }
          };
        }
        
        const dateText = entities.date ? ` for ${entities.date}` : '';
        const roomText = entities.roomType ? ` ${entities.roomType}` : '';
        
        return {
          text: `Absolutely! I'd be delighted to help you find the perfect${roomText} room${dateText}. Let me check our availability... Wonderful news! We have several beautiful options available:`,
          type: 'room-cards' as const,
          data: {
            rooms: [
              { 
                id: '1', 
                name: 'Sea View Deluxe', 
                type: 'deluxe', 
                price_per_night: 349, 
                features: ['Ocean views', 'Complimentary champagne'], 
                max_guests: 2,
                image_url: '/placeholder.svg',
                available: true
              },
              { 
                id: '2', 
                name: 'City View Premium', 
                type: 'premium', 
                price_per_night: 299, 
                features: ['City skyline', 'Work area'], 
                max_guests: 2,
                image_url: '/placeholder.svg',
                available: true
              },
              { 
                id: '3', 
                name: 'Garden Suite', 
                type: 'suite', 
                price_per_night: 449, 
                features: ['Private terrace', 'Butler service'], 
                max_guests: 4,
                image_url: '/placeholder.svg',
                available: true
              }
            ]
          }
        };

      case 'RequestRoomService':
        const mealType = entities.meal || 'our signature dishes';
        
        return {
          text: `I'd be absolutely delighted to arrange room service for you! Our culinary team creates magic in the kitchen. Here's what we're featuring for ${mealType}:`,
          type: 'menu-items' as const,
          data: {
            items: menuItems,
            categorized: true
          }
        };

      case 'AskAboutAmenities':
        return {
          text: `I'm thrilled to share our world-class amenities with you! The Grand Luxury Hotel offers everything you need for an unforgettable stay:`,
          type: 'amenity-info' as const,
          data: {
            amenities: amenityServices
          }
        };

      case 'SpeakToHuman':
        return {
          text: `Of course! I'll connect you with our Guest Relations team right away. They're absolutely wonderful and will give you the personalized attention you deserve.`,
          type: 'department-contacts' as const,
          data: {
            departments: [
              { department: "Front Desk", phone: "+1 (555) 123-4567", email: "frontdesk@grandluxury.com", hours: "24/7", description: "Check-in, reservations, general inquiries", icon: "User" },
              { department: "Concierge", phone: "+1 (555) 123-4568", email: "concierge@grandluxury.com", hours: "6 AM - 11 PM", description: "Local recommendations, bookings, special requests", icon: "MapPin" },
              { department: "Room Service", phone: "+1 (555) 123-4569", email: "roomservice@grandluxury.com", hours: "24/7", description: "Food orders and dining assistance", icon: "Utensils" }
            ]
          }
        };

      case 'ThankYou':
        return {
          text: `You're absolutely welcome${personalGreeting ? `, ${personalGreeting}` : ''}! It's my pleasure to assist you. Is there anything else I can help you with to make your stay even more wonderful?`,
          type: 'text' as const
        };

      default:
        return handleFallback(userText, confidence);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Save user message to database
    if (sessionId) {
      try {
        await supabase
          .from('messages')
          .insert({
            session_id: sessionId,
            content: input,
            sender: 'user',
            timestamp: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error saving user message:', error);
      }
    }

    const userInput = input;
    setInput('');

    // Handle booking number verification
    if (awaitingInput === 'booking_verification') {
      await handleBookingVerification(userInput);
      return;
    }

    // Detect intent and generate response
    const { intent, confidence, entities } = detectIntent(userInput);
    const response = generateResponse(intent, confidence, entities, userInput);

    // Add bot response
    setTimeout(() => {
      addBotMessage(response.text, response.type, response.data);
      
      // Save bot message to database
      if (sessionId) {
        try {
          supabase
            .from('messages')
            .insert({
              session_id: sessionId,
              content: response.text,
              sender: 'bot',
              intent,
              confidence,
              entities,
              timestamp: new Date().toISOString()
            });
        } catch (error) {
          console.error('Error saving bot message:', error);
        }
      }
    }, 1000);
  };

  const handleBookingVerification = async (bookingNumber: string) => {
    try {
      const { data: booking, error } = await supabase
        .from('guest_bookings')
        .select('*')
        .eq('booking_number', bookingNumber.toUpperCase())
        .single();

      if (error || !booking) {
        addBotMessage("I couldn't find a booking with that number. Please check and try again, or would you like to speak with our front desk for assistance?", 'text');
        setAwaitingInput('');
        return;
      }

      setGuestBooking(booking);
      setIsVerified(true);
      setGuestName(booking.guest_name);
      setAwaitingInput('');
      
      addBotMessage(`Perfect! Welcome back, ${booking.guest_name}! I've found your reservation for ${booking.room_type} from ${booking.check_in} to ${booking.check_out}. How can I make your stay even more special today?`, 'guest-profile', {
        booking: booking
      });

      toast({
        title: "Booking Verified",
        description: `Welcome back, ${booking.guest_name}!`,
      });

    } catch (error) {
      console.error('Error verifying booking:', error);
      addBotMessage("I'm having trouble accessing our booking system right now. Please try again in a moment or contact our front desk.", 'text');
      setAwaitingInput('');
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'room_availability':
        addBotMessage("I'd love to help you find the perfect room! Let me show you our available options:", 'room-cards', {
          rooms: [
            { id: '1', name: 'Sea View Deluxe', type: 'deluxe', price_per_night: 349, features: ['Ocean views', 'King bed'], max_guests: 2, image_url: '/placeholder.svg', available: true },
            { id: '2', name: 'City View Premium', type: 'premium', price_per_night: 299, features: ['City skyline', 'Queen bed'], max_guests: 2, image_url: '/placeholder.svg', available: true }
          ]
        });
        break;
      case 'room_service':
        addBotMessage("I'd be delighted to show you our room service menu! Here are our specialties:", 'menu-items', {
          items: menuItems,
          categorized: true
        });
        break;
      case 'amenities':
        addBotMessage("Here are our fantastic amenities and facilities:", 'amenity-info', {
          amenities: amenityServices
        });
        break;
      case 'verify_booking':
        addBotMessage("I'd be happy to help you access your booking information! Please provide your booking confirmation number:", 'text');
        setAwaitingInput('booking_verification');
        break;
    }
  };

  const handleRoomSelection = (room: Room) => {
    setCurrentBooking(prev => ({ ...prev, room }));
    addBotMessage(`Excellent choice! The ${room.name} is absolutely stunning. To proceed with your reservation, I'll need a few details. Shall we start with your check-in and check-out dates?`, 'booking-summary', {
      room,
      step: 'dates'
    });
  };

  const handleMenuItemSelection = (item: MenuItem) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
    
    addBotMessage(`Perfect! I've added ${item.name} to your order. Would you like to add anything else or shall I arrange delivery to your room?`, 'text');
    
    // Update user activity
    setUserActivity(prev => [...prev, 'room_service']);
  };

  const handleAmenityBooking = (amenity: AmenityService) => {
    if (amenity.price > 0) {
      addBotMessage(`I'd be delighted to book ${amenity.name} for you! This ${amenity.duration} experience costs $${amenity.price}. Shall I proceed with the booking?`, 'amenity-booking', {
        amenity,
        needsPayment: true
      });
    } else {
      addBotMessage(`Wonderful! ${amenity.name} is complimentary for our guests. It's available ${amenity.availability}. Would you like me to provide directions or any additional information?`, 'text');
    }
    
    // Update user activity
    setUserActivity(prev => [...prev, amenity.category.toLowerCase()]);
  };

  const handlePaymentClick = (data: any) => {
    const paymentUrl = "http://localhost:3000/";
    window.open(paymentUrl, '_blank');
    
    addBotMessage(`Payment window opened! Once payment is complete, you'll receive a confirmation email. Your ${data.type === 'amenity' ? 'service booking' : 'food order'} will be processed immediately after payment. Is there anything else I can help you with?`, 'text');
    
    // Reset food order after payment
    if (data.type === 'food') {
      setCurrentOrder({ items: [] });
    }
    
    // Generate activity-based prompts
    const prompts = generateActivityPrompts();
    if (prompts.length > 0) {
      setTimeout(() => {
        addBotMessage("Based on your activity, here are some additional AI-powered suggestions:", 'activity-prompts', prompts);
      }, 2000);
    }
  };

  const generateActivityPrompts = () => {
    const prompts = [];
    
    // Only suggest spa if user hasn't already used it
    if (userActivity.includes('room_service') && 
        !userActivity.includes('spa') &&
        !userActivity.some(a => a.includes('massage'))) {
      prompts.push("Since you've ordered room service, would you like to book a relaxing spa treatment to complete your in-room experience?");
    }
    
    // Only suggest restaurant if user hasn't used it
    if (userActivity.includes('spa') && 
        !userActivity.includes('restaurant') && 
        !userActivity.includes('dining')) {
      prompts.push("After your spa session, would you like me to make dinner reservations at our rooftop restaurant or arrange romantic room service?");
    }
    
    if (userActivity.includes('fitness') && !userActivity.includes('pool')) {
      prompts.push("Great workout! How about relaxing by our rooftop pool with a refreshing drink or booking a recovery massage?");
    }

    if (isVerified && guestBooking?.stay_purpose === 'business' && !userActivity.includes('business_center')) {
      prompts.push("For your business stay, would you like information about our business center, meeting rooms, or express laundry services?");
    }
    
    // Add AI-powered suggestions based on time of day
    const hour = new Date().getHours();
    if (hour >= 17 && hour < 22 && !userActivity.includes('dinner')) {
      prompts.push("It's dinner time! Would you like to see our dinner menu or make restaurant reservations?");
    } else if (hour >= 7 && hour < 11 && !userActivity.includes('breakfast')) {
      prompts.push("Good morning! Would you like to order breakfast to your room?");
    }
    
    return prompts;
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';

    if (message.type === 'greeting-buttons') {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('room_availability')}>
              <Calendar className="w-4 h-4 mr-2" />
              Check Rooms
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('room_service')}>
              <Coffee className="w-4 h-4 mr-2" />
              Room Service
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('amenities')}>
              <MapPin className="w-4 h-4 mr-2" />
              Amenities
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('verify_booking')}>
              <User className="w-4 h-4 mr-2" />
              My Booking
            </Button>
          </div>
        </div>
      );
    }

    if (message.type === 'room-cards' && message.data?.rooms) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
          <div className="space-y-3">
            {message.data.rooms.map((room: Room) => (
              <Card key={room.id} className="border border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleRoomSelection(room)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{room.name}</h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">${room.price_per_night}</div>
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Max {room.max_guests} guests
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {room.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full">
                    Select Room
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'menu-items' && message.data) {
      const { items, categorized } = message.data;
      const categories = [...new Set(items.map((item: MenuItem) => item.category))];
      
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
          {categorized ? (
            categories.map((category: string) => (
              <div key={category} className="mb-4">
                <h4 className="font-semibold text-foreground mb-2">{category}</h4>
                <div className="grid gap-2">
                  {items.filter((item: MenuItem) => item.category === category).map((item: MenuItem) => (
                    <Card 
                      key={item.id} 
                      className="border border-border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleMenuItemSelection(item)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground">{item.name}</h5>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="text-primary font-semibold ml-2">
                            ${item.price}
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
                  className="border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => handleMenuItemSelection(item)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground">{item.name}</h5>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="text-primary font-semibold ml-2">
                        ${item.price}
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

    if (message.type === 'amenity-info' && message.data?.amenities) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
          <div className="space-y-3">
            {message.data.amenities.map((amenity: AmenityService) => (
              <Card key={amenity.id} className="border border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleAmenityBooking(amenity)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{amenity.name}</h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {amenity.price > 0 ? `$${amenity.price}` : 'Free'}
                      </div>
                      <div className="text-xs text-muted-foreground">{amenity.duration}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{amenity.description}</p>
                  <div className="text-xs text-muted-foreground mb-3">
                    Available: {amenity.availability}
                  </div>
                  <Button size="sm" className="w-full">
                    {amenity.price > 0 ? 'Book Now' : 'Learn More'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'department-contacts' && message.data?.departments) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
          <div className="space-y-3">
            {message.data.departments.map((dept: any, index: number) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{dept.department}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {dept.phone}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {dept.hours}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'guest-profile' && message.data?.booking) {
      const booking = message.data.booking;
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Booking Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Guest:</span>
                  <p className="text-muted-foreground">{booking.guest_name}</p>
                </div>
                <div>
                  <span className="font-medium">Room:</span>
                  <p className="text-muted-foreground">{booking.room_type}</p>
                </div>
                <div>
                  <span className="font-medium">Check-in:</span>
                  <p className="text-muted-foreground">{booking.check_in}</p>
                </div>
                <div>
                  <span className="font-medium">Check-out:</span>
                  <p className="text-muted-foreground">{booking.check_out}</p>
                </div>
              </div>
              {booking.special_requests && (
                <div>
                  <span className="font-medium">Special Requests:</span>
                  <p className="text-muted-foreground text-sm">{booking.special_requests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (message.type === 'activity-prompts' && message.data) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
          <div className="space-y-2">
            {message.data.map((prompt: string, index: number) => (
              <Card key={index} className="border border-primary/20 bg-primary/5">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-2">
                    <Brain className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-foreground">{prompt}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'amenity-booking' && message.data) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
          {message.data.needsPayment && (
            <Button 
              className="w-full mt-3 bg-green-600 hover:bg-green-700"
              onClick={() => handlePaymentClick({ type: 'amenity', ...message.data.amenity })}
            >
              Proceed to Secure Payment
            </Button>
          )}
        </div>
      );
    }

    // Default text message
    return (
      <div className="space-y-2">
        <p className="text-sm text-foreground whitespace-pre-line">{message.content}</p>
        {message.intent && message.confidence && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Brain className="w-3 h-3" />
            <span>Intent: {message.intent}</span>
            <Badge variant="outline" className="text-xs">
              {(message.confidence * 100).toFixed(0)}%
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-primary" />
            <span>Sofia - AI Hotel Concierge</span>
          </div>
          <div className="flex items-center space-x-2">
            {isVerified && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified Guest
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardTitle>
        {guestName && (
          <p className="text-sm text-muted-foreground">
            Welcome back, {guestName}! How can I assist you today?
          </p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.sender === 'user' ? (
                <p className="text-sm">{message.content}</p>
              ) : (
                renderMessage(message)
              )}
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={awaitingInput === 'booking_verification' ? "Enter your booking confirmation number..." : "Type your message..."}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {awaitingInput === 'booking_verification' && (
          <p className="text-xs text-muted-foreground mt-2">
            Please enter your booking confirmation number to access personalized assistance
          </p>
        )}
        
        {currentOrder.items.length > 0 && (
          <div className="mt-2 p-2 bg-muted rounded text-xs">
            <strong>Current Order:</strong> {currentOrder.items.map(item => item.name).join(', ')}
            <Button 
              size="sm" 
              className="ml-2" 
              onClick={() => handlePaymentClick({ type: 'food', items: currentOrder.items })}
            >
              Complete Order
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UnifiedHotelChatbot;