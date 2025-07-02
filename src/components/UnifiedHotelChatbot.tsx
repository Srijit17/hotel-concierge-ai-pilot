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
  
  const [userContext, setUserContext] = useState<UserContext>({
    hasBooking: false,
    lastOrderTime: undefined,
    hasSpaBooking: false,
    isLoyaltyMember: false,
    timeOfDay: 'morning'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeSession();
    setSessionStartTime(new Date());
    
    // Enhanced greeting with food and amenities
    addBotMessage(
      "Welcome to The Grand Luxury Hotel! I'm Sofia, your enhanced AI concierge with smart insights and interactive features. Let's make your stay extraordinary!", 
      'greeting-buttons'
    );
    
    // Add food and amenities options after greeting
    setTimeout(() => {
      addBotMessage(
        "I can help you with room bookings, delicious dining options, and luxurious amenities. What would you like to explore first?",
        'service-options'
      );
    }, 1500);
    
    const timeOfDay = SessionManager.updateTimeOfDay();
    setUserContext(prev => ({ ...prev, timeOfDay }));
    
    setTimeout(() => {
      setShowInteractiveFeatures(true);
    }, 2000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const duration = Date.now() - sessionStartTime.getTime();
      dataManager.updateSessionDuration(duration);
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    const id = await SessionManager.initializeSession();
    setSessionId(id);
  };

  const addBotMessage = (content: string, type?: string, data?: any, confidence?: number) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      content,
      timestamp: new Date(),
      type: type as any,
      data,
      confidence
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (type && ['room-cards', 'menu-items', 'amenity-info'].includes(type)) {
      const elements = dataManager.generateInteractiveElements(type.replace('-', '_'));
      setInteractiveElements(elements);
    }
  };

  const addDepartmentContacts = () => {
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
  };

  const handleBookingFlow = (step: string, data?: any) => {
    switch (step) {
      case 'start_booking':
        setBookingState({ step: 'room_selection' });
        addBotMessage("Perfect! Let me show you our available rooms:", 'room-cards', {
          rooms: [
            { id: '1', name: 'Deluxe Room', type: 'deluxe', price_per_night: 200, features: ['City View', 'Free WiFi', 'Mini Bar'], max_guests: 2, image_url: '/placeholder.svg', available: true },
            { id: '2', name: 'Ocean View Suite', type: 'suite', price_per_night: 350, features: ['Ocean View', 'Balcony', 'Jacuzzi'], max_guests: 4, image_url: '/placeholder.svg', available: true },
            { id: '3', name: 'Presidential Suite', type: 'presidential', price_per_night: 600, features: ['Panoramic View', 'Butler Service', 'Private Terrace'], max_guests: 6, image_url: '/placeholder.svg', available: true }
          ]
        });
        break;
        
      case 'room_selected':
        setBookingState({ step: 'guest_details', selectedRoom: data });
        addBotMessage(
          `Excellent choice! The ${data.name} is perfect for your stay. Now I need some details to complete your booking:`,
          'booking-form',
          { room: data }
        );
        break;
        
      case 'booking_confirmed':
        setBookingState({ step: 'completed', ...bookingState, guestDetails: data });
        addBotMessage(
          `🎉 Congratulations! Your booking is confirmed. Here's your confirmation:`,
          'booking-confirmation',
          {
            booking: {
              bookingNumber: `GRD${Date.now().toString().slice(-6)}`,
              room: bookingState.selectedRoom,
              guest: data,
              total: bookingState.selectedRoom?.price_per_night * 2 // Assuming 2 nights
            }
          }
        );
        
        // Offer food and amenities after booking
        setTimeout(() => {
          addBotMessage(
            "Now that your room is booked, would you like to explore our dining options and amenities?",
            'post-booking-services'
          );
        }, 2000);
        break;
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
    dataManager.incrementMessageCount();
    
    dataManager.trackInteraction({
      type: 'input',
      elementId: 'chat_input',
      value: input,
      context: 'message_send'
    });

    const userInput = input;
    setInput('');
    
    const corrections = generateCorrectionSuggestions(userInput);
    if (corrections.length > 0 && corrections[0].confidence > 0.85) {
      setCorrectionSuggestions(corrections);
      return;
    }

    await processUserMessage(userInput);
  };

  const processUserMessage = async (userInput: string) => {
    setIsTyping(true);

    try {
      const previousMessages = messages
        .filter(m => m.sender === 'user')
        .slice(-3)
        .map(m => m.content);

      const response = await enhancedAI.generateResponse(
        userInput, 
        sessionContext, 
        previousMessages
      );

      setSessionContext(prev => ({
        ...prev,
        previousIntents: [...prev.previousIntents.slice(-2), response.type || 'general'],
        fallbackCount: response.confidence < 0.6 ? prev.fallbackCount + 1 : 0
      }));

      setShowSuggestions(true);
      setShowFAQ(false);

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
        } else {
          addBotMessage(response.text, response.type, response.data, response.confidence);
        }
        
        // Always add department contacts after any response
        setTimeout(() => {
          addDepartmentContacts();
        }, 1000);
        
      }, Math.random() * 800 + 200);

    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
      addDepartmentContacts();
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
      }
    };

    const actionHandler = quickActions[action];
    if (actionHandler) {
      actionHandler();
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
  };

  const handleAmenityBooking = (amenity: any) => {
    addBotMessage(`Wonderful! I'd be happy to help you book ${amenity.name}.`, 'amenity-booking', { amenity });
    if (amenity.category === 'Spa') {
      setUserContext(prev => ({ ...prev, hasSpaBooking: true }));
    }
  };

  const handlePaymentClick = (data: any) => {
    addBotMessage("Processing your payment... Payment completed successfully! Thank you for choosing The Grand Luxury Hotel.", 'text');
  };

  const insights = dataManager.getRealTimeInsights();

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
      />
    </Card>
  );
};

export default UnifiedHotelChatbot;
