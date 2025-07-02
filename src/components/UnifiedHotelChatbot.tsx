import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MessageRenderer, type Message } from './chatbot/MessageRenderer';
import { enhancedAI } from '../lib/enhanced-chatbot-ai';
import { type SessionContext } from '../lib/chatbot-ai';
import { menuItems, amenityServices } from '../lib/chatbot-data';
import FAQEngine from './chatbot/FAQEngine';
import SmartSuggestionEngine from './chatbot/SmartSuggestionEngine';
import IntentCorrectionEngine, { generateCorrectionSuggestions } from './chatbot/IntentCorrectionEngine';
import { InteractiveFeatures } from './chatbot/InteractiveFeatures';
import { DataDrivenInsights } from './chatbot/DataDrivenInsights';
import { InteractiveChatElements } from './chatbot/InteractiveChatElements';
import { dataManager, type UserPreferences } from '../lib/interactive-data-manager';
import { ChatHeader } from './chatbot/ChatHeader';
import { ChatInput } from './chatbot/ChatInput';
import { TypingIndicator } from './chatbot/TypingIndicator';
import { ChatMessage } from './chatbot/ChatMessage';
import { SessionManager } from './chatbot/SessionManager';
import { generateCityResponse, generateHeritageResponse, generateServiceResponse, detectQueryType } from '../lib/enhanced-ai-responses';
import FAQPromptSuggestions from './chatbot/FAQPromptSuggestions';

interface UserContext {
  hasBooking: boolean;
  lastOrderTime?: string;
  hasSpaBooking: boolean;
  isLoyaltyMember: boolean;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

interface BookingState {
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

const UnifiedHotelChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    fallbackCount: 0,
    previousIntents: [],
    visitCount: 1
  });
  
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [showInteractiveFeatures, setShowInteractiveFeatures] = useState(false);
  const [correctionSuggestions, setCorrectionSuggestions] = useState<any[]>([]);
  const [interactiveElements, setInteractiveElements] = useState<any[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());
  const [bookingState, setBookingState] = useState<BookingState>({ step: 'room_selection' });
  const [isError, setIsError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true);
  
  const [userContext, setUserContext] = useState<UserContext>({
    hasBooking: false,
    lastOrderTime: undefined,
    hasSpaBooking: false,
    isLoyaltyMember: false,
    timeOfDay: 'morning'
  });

  const [showFAQPrompts, setShowFAQPrompts] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Enhanced initialization with error handling
  useEffect(() => {
    const initializeChat = async () => {
      try {
        await initializeSession();
        setSessionStartTime(new Date());
        
        // Enhanced greeting with better error handling
        addBotMessage(
          "Welcome to The Grand Luxury Hotel! I'm Sofia, your enhanced AI concierge. I'm here to help you with bookings, dining, amenities, and any questions you might have.", 
          'greeting-buttons'
        );
        
        // Add service options after greeting
        setTimeout(() => {
          if (isSessionActive) {
            addBotMessage(
              "What would you like to explore today? I can help with room bookings, delicious dining options, luxurious amenities, or answer any questions about our services.",
              'service-options'
            );
          }
        }, 1500);
        
        const timeOfDay = SessionManager.updateTimeOfDay();
        setUserContext(prev => ({ ...prev, timeOfDay }));
        
        setTimeout(() => {
          if (isSessionActive) {
            setShowInteractiveFeatures(true);
          }
        }, 2000);

        setIsError(false);
        setErrorCount(0);
      } catch (error) {
        console.error('Chat initialization error:', error);
        handleInitializationError();
      }
    };

    initializeChat();

    // Cleanup function
    return () => {
      setIsSessionActive(false);
    };
  }, []);

  // Session duration tracking with error handling
  useEffect(() => {
    if (!isSessionActive) return;

    const interval = setInterval(() => {
      try {
        const duration = Date.now() - sessionStartTime.getTime();
        dataManager.updateSessionDuration(duration);
      } catch (error) {
        console.error('Session duration update error:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionStartTime, isSessionActive]);

  // Auto-scroll with error handling
  useEffect(() => {
    try {
      scrollToBottom();
    } catch (error) {
      console.error('Scroll error:', error);
    }
  }, [messages]);

  // Enhanced error handling for initialization
  const handleInitializationError = () => {
    setIsError(true);
    addBotMessage(
      "I'm experiencing some technical difficulties while starting up. Please bear with me as I try to resolve this.",
      'error-recovery'
    );
    
    // Retry initialization after delay
    setTimeout(() => {
      if (errorCount < 3) {
        setErrorCount(prev => prev + 1);
        window.location.reload();
      } else {
        addBotMessage(
          "I'm having persistent technical issues. Please refresh the page or contact our support team for immediate assistance.",
          'critical-error'
        );
      }
    }, 3000);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const initializeSession = async () => {
    try {
      const id = await SessionManager.initializeSession();
      setSessionId(id);
    } catch (error) {
      console.error('Session initialization error:', error);
      // Generate fallback session ID
      setSessionId(`fallback_${Date.now()}`);
    }
  };

  // Enhanced message adding with validation
  const addBotMessage = (content: string, type?: string, data?: any, confidence?: number) => {
    try {
      if (!content || typeof content !== 'string') {
        console.error('Invalid message content');
        return;
      }

      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sender: 'bot',
        content: content.trim(),
        timestamp: new Date(),
        type: type as any,
        data,
        confidence: confidence || 0.9
      };

      setMessages(prev => {
        // Prevent duplicate messages
        const isDuplicate = prev.some(msg => 
          msg.content === newMessage.content && 
          msg.sender === newMessage.sender &&
          Date.now() - msg.timestamp.getTime() < 1000
        );

        if (isDuplicate) {
          console.warn('Duplicate message prevented');
          return prev;
        }

        return [...prev, newMessage];
      });
      
      // Handle interactive elements
      if (type && ['room-cards', 'menu-items', 'amenity-info'].includes(type)) {
        try {
          const elements = dataManager.generateInteractiveElements(type.replace('-', '_'));
          setInteractiveElements(elements);
        } catch (error) {
          console.error('Interactive elements error:', error);
        }
      }
    } catch (error) {
      console.error('Error adding bot message:', error);
    }
  };

  // Enhanced department contacts with error handling
  const addDepartmentContacts = () => {
    try {
      addBotMessage(
        "Need direct assistance? Here are our department contacts available 24/7:",
        'department-contacts',
        {
          departments: [
            { 
              department: "Booking & Reservations", 
              phone: "+91 90000 11111", 
              email: "booking@grandluxury.com",
              hours: "24/7", 
              description: "Room bookings, modifications, cancellations" 
            },
            { 
              department: "Food & Room Service", 
              phone: "+91 90000 22222", 
              email: "food@grandluxury.com",
              hours: "24/7", 
              description: "Menu, orders, dietary requirements" 
            },
            { 
              department: "Spa & Wellness", 
              phone: "+91 90000 44444", 
              email: "spa@grandluxury.com",
              hours: "6 AM - 11 PM", 
              description: "Spa treatments, wellness programs" 
            },
            { 
              department: "Guest Relations", 
              phone: "+91 90000 33333", 
              email: "support@grandluxury.com",
              hours: "24/7", 
              description: "General assistance and special requests" 
            }
          ]
        }
      );
    } catch (error) {
      console.error('Error adding department contacts:', error);
      addBotMessage(
        "For immediate assistance, please call our main number: +91 90000 11111",
        'text'
      );
    }
  };

  // Enhanced booking flow with comprehensive error handling
  const handleBookingFlow = (step: string, data?: any) => {
    try {
      switch (step) {
        case 'start_booking':
          setBookingState({ step: 'room_selection' });
          const availableRooms = [
            { 
              id: '1', 
              name: 'Deluxe Mountain View', 
              type: 'deluxe', 
              price_per_night: 250, 
              features: ['Mountain View', 'Free WiFi', 'Mini Bar', 'Balcony'], 
              max_guests: 2, 
              image_url: '/placeholder.svg', 
              available: true 
            },
            { 
              id: '2', 
              name: 'Heritage Suite', 
              type: 'suite', 
              price_per_night: 400, 
              features: ['Heritage Decor', 'Separate Living Area', 'Jacuzzi', 'Butler Service'], 
              max_guests: 4, 
              image_url: '/placeholder.svg', 
              available: true 
            },
            { 
              id: '3', 
              name: 'Royal Presidential Suite', 
              type: 'presidential', 
              price_per_night: 750, 
              features: ['Panoramic City View', 'Private Terrace', 'Butler Service', 'Dining Room'], 
              max_guests: 6, 
              image_url: '/placeholder.svg', 
              available: true 
            }
          ];
          
          addBotMessage("Perfect! Let me show you our available luxury accommodations:", 'room-cards', {
            rooms: availableRooms
          });
          break;
          
        case 'room_selected':
          if (!data) {
            addBotMessage("I'm sorry, there was an issue with your room selection. Please try again.", 'error');
            return;
          }
          setBookingState({ step: 'guest_details', selectedRoom: data });
          addBotMessage(
            `Excellent choice! The ${data.name} is perfect for your stay. Now please provide your booking details:`,
            'booking-form',
            { room: data }
          );
          break;
          
        case 'booking_confirmed':
          if (!data || !bookingState.selectedRoom) {
            addBotMessage("I'm sorry, there was an issue processing your booking. Please try again.", 'error');
            return;
          }
          setBookingState({ step: 'completed', ...bookingState, guestDetails: data });
          const nights = 2;
          const total = bookingState.selectedRoom?.price_per_night * nights;
          
          addBotMessage(
            `🎉 Congratulations! Your booking is confirmed. Here's your confirmation:`,
            'booking-confirmation',
            {
              booking: {
                bookingNumber: `GRD${Date.now().toString().slice(-6)}`,
                room: bookingState.selectedRoom,
                guest: data,
                total: total
              }
            }
          );
          
          setTimeout(() => {
            addBotMessage(
              "Now that your room is booked, would you like to explore our dining options and spa services?",
              'post-booking-services'
            );
          }, 2000);
          break;

        default:
          addBotMessage("I'm not sure how to help with that booking request. Let me connect you with our reservations team.", 'error');
          setTimeout(() => addDepartmentContacts(), 1000);
      }
    } catch (error) {
      console.error('Booking flow error:', error);
      addBotMessage("I encountered an error while processing your booking. Let me connect you with our reservations team.", 'error');
      setTimeout(() => addDepartmentContacts(), 1000);
    }
  };

  // Enhanced spa booking flow with error handling
  const handleSpaBookingFlow = (step: string, data?: any) => {
    try {
      switch (step) {
        case 'show_spa_amenities':
          const spaServices = amenityServices.filter(service => service.category === 'Spa');
          if (spaServices.length === 0) {
            addBotMessage("I'm sorry, our spa services are currently being updated. Please contact our spa directly.", 'error');
            return;
          }
          addBotMessage("Here are our luxurious spa treatments:", 'spa-amenities', {
            amenities: spaServices
          });
          break;
          
        case 'book_spa_treatment':
          const availableTreatments = amenityServices.filter(service => service.category === 'Spa');
          if (availableTreatments.length === 0) {
            addBotMessage("I'm sorry, spa bookings are currently unavailable. Please contact our spa directly.", 'error');
            return;
          }
          addBotMessage("I'd be delighted to help you book a spa treatment! Please select your preferred service:", 'spa-booking', {
            amenities: availableTreatments
          });
          break;
          
        case 'spa_treatment_selected':
          if (!data) {
            addBotMessage("I'm sorry, there was an issue selecting your spa treatment. Please try again.", 'error');
            return;
          }
          addBotMessage(`Perfect choice! ${data.name} is one of our most popular treatments. Please select your preferred time slot:`, 'spa-time-slots', {
            service: data,
            timeSlots: [
              { time: '10:00 AM', available: true },
              { time: '12:00 PM', available: true },
              { time: '2:00 PM', available: false },
              { time: '4:00 PM', available: true },
              { time: '6:00 PM', available: true }
            ]
          });
          break;
          
        case 'spa_time_selected':
          if (!data) {
            addBotMessage("I'm sorry, there was an issue with your time selection. Please try again.", 'error');
            return;
          }
          addBotMessage(`Excellent! Your ${data.service.name} is booked for ${data.timeSlot}. Would you like to proceed with payment?`, 'spa-payment', {
            booking: data
          });
          break;

        default:
          addBotMessage("I'm not sure how to help with that spa request. Let me connect you with our spa team.", 'error');
          setTimeout(() => addDepartmentContacts(), 1000);
      }
    } catch (error) {
      console.error('Spa booking flow error:', error);
      addBotMessage("I encountered an error while processing your spa booking. Let me connect you with our spa team.", 'error');
      setTimeout(() => addDepartmentContacts(), 1000);
    }
  };

  // Enhanced message sending with comprehensive validation and error handling
  const handleSendMessage = async () => {
    if (!input.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }

    if (input.trim().length > 1000) {
      toast({
        title: "Message Too Long",
        description: "Please keep your message under 1000 characters.",
        variant: "destructive"
      });
      return;
    }

    if (isTyping) {
      toast({
        title: "Please Wait",
        description: "I'm still processing your previous message.",
      });
      return;
    }

    try {
      const userMessage: Message = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sender: 'user',
        content: input.trim(),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      dataManager.incrementMessageCount();
      
      dataManager.trackInteraction({
        type: 'input',
        elementId: 'chat_input',
        value: input.trim(),
        context: 'message_send'
      });

      const userInput = input.trim();
      setInput('');
      
      // Enhanced correction suggestions with error handling
      try {
        const corrections = generateCorrectionSuggestions(userInput);
        if (corrections.length > 0 && corrections[0].confidence > 0.85) {
          setCorrectionSuggestions(corrections);
          return;
        }
      } catch (error) {
        console.error('Correction suggestions error:', error);
      }

      await processUserMessage(userInput);
    } catch (error) {
      console.error('Send message error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Enhanced message processing with comprehensive error handling
  const processUserMessage = async (userInput: string) => {
    if (!userInput || !isSessionActive) return;

    setIsTyping(true);

    try {
      // First check for city, heritage, or service queries
      let queryType;
      try {
        queryType = detectQueryType(userInput);
      } catch (error) {
        console.error('Query type detection error:', error);
        queryType = null;
      }
      
      if (queryType === 'city_info') {
        const cityResponse = generateCityResponse(userInput);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage(cityResponse, 'text');
          setTimeout(() => {
            addDepartmentContacts();
          }, 1000);
        }, 1000);
        return;
      }
      
      if (queryType === 'heritage') {
        const heritageResponse = generateHeritageResponse(userInput);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage(heritageResponse, 'text');
          setTimeout(() => {
            addDepartmentContacts();
          }, 1000);
        }, 1000);
        return;
      }
      
      if (queryType === 'service_request') {
        const serviceResponse = generateServiceResponse(userInput);
        if (serviceResponse) {
          setTimeout(() => {
            setIsTyping(false);
            addBotMessage(serviceResponse, 'text');
            setTimeout(() => {
              addDepartmentContacts();
            }, 1000);
          }, 800);
          return;
        }
      }

      const previousMessages = messages
        .filter(m => m.sender === 'user')
        .slice(-3)
        .map(m => m.content);

      const response = await enhancedAI.generateResponse(
        userInput, 
        sessionContext, 
        previousMessages
      );

      // Update session context
      setSessionContext(prev => ({
        ...prev,
        previousIntents: [...prev.previousIntents.slice(-2), response.type || 'general'],
        fallbackCount: response.confidence < 0.6 ? prev.fallbackCount + 1 : 0
      }));

      setShowSuggestions(true);
      setShowFAQ(false);

      // Enhanced response handling with typing delay
      const typingDelay = Math.random() * 800 + 200;
      setTimeout(() => {
        setIsTyping(false);
        
        if (response.confidence < 0.5) {
          addDepartmentContacts();
        } else if (response.data?.action === 'show_rooms') {
          addBotMessage(response.text, 'room-cards', {
            rooms: response.data.rooms
          }, response.confidence);
        } else if (response.data?.action === 'show_amenities') {
          addBotMessage(response.text, 'amenity-info', {
            amenities: amenityServices
          }, response.confidence);
        } else if (response.data?.action === 'show_menu') {
          addBotMessage(response.text, 'menu-items', {
            items: menuItems,
            categorized: true
          }, response.confidence);
        } else if (response.data?.action === 'show_contact_support') {
          addBotMessage(response.text, 'text', response.data, response.confidence);
          setTimeout(() => addDepartmentContacts(), 500);
        } else {
          addBotMessage(response.text, response.type, response.data, response.confidence);
        }
        
        // Always add department contacts after any response (with delay)
        setTimeout(() => {
          addDepartmentContacts();
        }, 1000);
        
      }, typingDelay);

    } catch (error) {
      console.error('Error processing user message:', error);
      setIsTyping(false);
      addBotMessage(
        "I apologize, but I encountered an error while processing your message. Let me connect you with our support team for immediate assistance.",
        'error'
      );
      setTimeout(() => addDepartmentContacts(), 500);
    }
  };

  const handleFeedback = (type: 'positive' | 'negative', message: string) => {
    dataManager.trackInteraction({
      type: 'feedback',
      elementId: 'feedback_system',
      value: { type, message },
      context: 'user_satisfaction'
    });

    toast({
      title: "Thanks for your feedback!",
      description: "Your input helps us improve our service.",
    });
  };

  const handleRoomFilter = (filters: any) => {
    dataManager.trackInteraction({
      type: 'selection',
      elementId: 'room_filter',
      value: filters,
      context: 'room_booking'
    });

    dataManager.updatePreferences({
      priceRange: filters.priceRange,
      amenities: filters.amenities
    });

    addBotMessage("Perfect! Based on your preferences, here are the best rooms for you:", 'room-cards', {
      rooms: [
        { id: '1', name: 'Deluxe Room', type: 'deluxe', price_per_night: filters.priceRange[0] + 50, features: filters.amenities.slice(0, 3), max_guests: 2, image_url: '/placeholder.svg', available: true },
        { id: '2', name: 'Premium Suite', type: 'suite', price_per_night: filters.priceRange[1] - 100, features: filters.amenities, max_guests: 4, image_url: '/placeholder.svg', available: true }
      ]
    });
  };

  const handleQuickPoll = (response: string) => {
    dataManager.trackInteraction({
      type: 'selection',
      elementId: 'quick_poll',
      value: response,
      context: 'user_preference'
    });

    addBotMessage(`Great choice! I'll prioritize ${response.toLowerCase()} in my recommendations for you.`);
  };

  const handleInteractiveElement = (elementId: string, value: any) => {
    dataManager.trackInteraction({
      type: 'selection',
      elementId,
      value,
      context: 'interactive_element'
    });

    if (elementId.includes('rating')) {
      addBotMessage(`Thank you for the ${value}-star rating! Your feedback is valuable to us.`);
    } else if (elementId.includes('calendar')) {
      addBotMessage(`Perfect! I've noted your preferred date: ${value}. Let me show you available options.`);
    }
  };

  const handleFAQSelect = (faq: any) => {
    addBotMessage(faq.answer, 'text');
    setShowFAQ(false);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    processUserMessage(suggestion.description);
    setShowSuggestions(false);
  };

  const handleAcceptCorrection = (correction: any) => {
    setCorrectionSuggestions([]);
    processUserMessage(correction.corrected);
  };

  const handleRejectCorrection = () => {
    setCorrectionSuggestions([]);
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.sender === 'user') {
      processUserMessage(lastUserMessage.content);
    }
  };

  const handleQuickAction = (action: string) => {
    const quickActions: Record<string, () => void> = {
      room_availability: () => {
        handleBookingFlow('start_booking');
      },
      room_service: () => {
        addBotMessage("Here's our room service menu with fresh, delicious options:", 'menu-items', { items: menuItems, categorized: true });
      },
      amenities: () => {
        addBotMessage("Here are our world-class amenities and services:", 'amenity-info', { amenities: amenityServices });
      },
      verify_booking: () => {
        addBotMessage("Please provide your booking confirmation number or the phone number used for the reservation, and I'll help you access your booking details.");
      },
      show_faq: () => {
        setShowFAQ(true);
        setShowSuggestions(false);
      },
      book_room: () => {
        handleBookingFlow('start_booking');
      },
      explore_dining: () => {
        addBotMessage("Discover our culinary excellence:", 'menu-items', { items: menuItems, categorized: true });
      },
      explore_amenities: () => {
        addBotMessage("Experience luxury with our premium amenities:", 'amenity-info', { amenities: amenityServices });
      },
      contact_support: () => {
        addDepartmentContacts();
      },
      show_spa_amenities: () => {
        handleSpaBookingFlow('show_spa_amenities');
      },
      book_spa_treatment: () => {
        handleSpaBookingFlow('book_spa_treatment');
      },
      show_faq_prompts: () => {
        setShowFAQPrompts(true);
        setShowSuggestions(false);
      },
      show_business_center: () => {
        addBotMessage("Our Business Center is available 24/7 with meeting rooms, printing facilities, and high-speed internet. Would you like to reserve a meeting room?", 'text');
      },
      show_ai_concierge: () => {
        addBotMessage("I'm your AI Concierge! I can help you with bookings, dining recommendations, local attractions, and answer any questions about our hotel services. What would you like to know?", 'text');
      },
      request_late_checkout: () => {
        addBotMessage("I'd be happy to arrange late checkout for you until 2 PM at no extra charge. Please provide your room number and I'll confirm the arrangement.", 'text');
      },
      view_loyalty_perks: () => {
        addBotMessage("As a loyalty member, you enjoy exclusive benefits including room upgrades, late checkout, complimentary breakfast, and spa discounts. Would you like to use any of these perks?", 'text');
      }
    };

    const actionHandler = quickActions[action];
    if (actionHandler) {
      try {
        actionHandler();
      } catch (error) {
        console.error(`Quick action error for ${action}:`, error);
        addBotMessage("I encountered an error processing that request. How else can I help you?", 'error');
      }
    } else {
      addBotMessage("I'm not sure how to handle that request. Could you please be more specific?", 'error');
    }
  };

  const handleRoomSelection = (room: any) => {
    if (bookingState.step === 'room_selection') {
      handleBookingFlow('room_selected', room);
    } else {
      addBotMessage(`Excellent choice! The ${room.name} is perfect for your stay.`, 'text');
      setUserContext(prev => ({ ...prev, hasBooking: true }));
    }
  };

  const handleMenuItemSelection = (item: any) => {
    addBotMessage(`Great selection! I've noted ${item.name} for your order. Would you like to add more items or proceed with this order?`, 'order-options', { selectedItem: item });
    setUserContext(prev => ({ ...prev, lastOrderTime: new Date().toISOString() }));
    
    setTimeout(() => {
      addBotMessage(
        "Since you've ordered room service, would you like to book a relaxing spa treatment to complete your in-room experience?",
        'spa-suggestion',
        {
          suggestedActions: [
            { action: 'show_spa_amenities', label: 'View Spa Services' },
            { action: 'book_spa_treatment', label: 'Book Spa Treatment' }
          ]
        }
      );
    }, 2000);
  };

  const handleAmenityBooking = (amenity: any) => {
    if (amenity.category === 'Spa') {
      handleSpaBookingFlow('spa_treatment_selected', amenity);
      setUserContext(prev => ({ ...prev, hasSpaBooking: true }));
    } else {
      addBotMessage(`Wonderful! I'd be happy to help you book ${amenity.name}.`, 'amenity-booking', { amenity });
    }
  };

  const handlePaymentClick = (data: any) => {
    addBotMessage("Processing your payment... Payment completed successfully! Thank you for choosing The Grand Luxury Hotel.", 'text');
  };

  const insights = dataManager.getRealTimeInsights();

  const handleFAQPromptSelect = (prompt: string) => {
    processUserMessage(prompt);
    setShowFAQPrompts(false);
  };

  // Enhanced render with error boundary
  if (isError && errorCount >= 3) {
    return (
      <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col items-center justify-center">
        <CardContent className="text-center">
          <h2 className="text-xl font-semibold mb-4">Service Temporarily Unavailable</h2>
          <p className="text-gray-600 mb-4">
            We're experiencing technical difficulties. Please refresh the page or contact our support team.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col">
      <ChatHeader 
        showInsights={showInsights}
        onToggleInsights={() => setShowInsights(!showInsights)}
      />
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {showInsights && (
          <DataDrivenInsights
            sessionData={insights.sessionData}
            hotelMetrics={insights.hotelMetrics}
          />
        )}

        {showInteractiveFeatures && (
          <InteractiveFeatures
            onFeedback={handleFeedback}
            onRoomFilter={handleRoomFilter}
            onQuickPoll={handleQuickPoll}
            userPreferences={insights.sessionData.preferences}
          />
        )}

        {correctionSuggestions.length > 0 && (
          <IntentCorrectionEngine
            userInput={messages[messages.length - 1]?.content || ''}
            suggestions={correctionSuggestions}
            onAcceptCorrection={handleAcceptCorrection}
            onRejectCorrection={handleRejectCorrection}
          />
        )}

        {showFAQ && (
          <FAQEngine onQuestionSelect={handleFAQSelect} />
        )}

        {showFAQPrompts && (
          <FAQPromptSuggestions onPromptSelect={handleFAQPromptSelect} />
        )}

        {showSuggestions && messages.length > 2 && (
          <SmartSuggestionEngine
            userContext={userContext}
            onSuggestionSelect={handleSuggestionSelect}
          />
        )}

        {interactiveElements.length > 0 && (
          <InteractiveChatElements
            elements={interactiveElements}
            onInteraction={handleInteractiveElement}
          />
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onRoomSelection={handleRoomSelection}
            onMenuItemSelection={handleMenuItemSelection}
            onAmenityBooking={handleAmenityBooking}
            onQuickAction={handleQuickAction}
            onPaymentClick={handlePaymentClick}
          />
        ))}
        
        <TypingIndicator isTyping={isTyping} />
        
        <div ref={messagesEndRef} />
      </CardContent>
      
      <ChatInput
        input={input}
        isTyping={isTyping}
        onInputChange={setInput}
        onSendMessage={handleSendMessage}
        onQuickAction={handleQuickAction}
        showSuggestions={showSuggestions}
        onToggleSuggestions={() => setShowSuggestions(!showSuggestions)}
        showInteractiveFeatures={showInteractiveFeatures}
        onToggleInteractiveFeatures={() => setShowInteractiveFeatures(!showInteractiveFeatures)}
        messageCount={insights.sessionData.messageCount}
        showFAQPrompts={showFAQPrompts}
        onToggleFAQPrompts={() => setShowFAQPrompts(!showFAQPrompts)}
      />
    </Card>
  );
};

export default UnifiedHotelChatbot;
