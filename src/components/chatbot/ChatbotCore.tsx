import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MessageRenderer, type Message } from './MessageRenderer';
import { type SessionContext } from '../../lib/chatbot-ai';
import { menuItems, amenityServices } from '../../lib/chatbot-data';
import { dataManager } from '../../lib/interactive-data-manager';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessage } from './ChatMessage';
import { SessionManager } from './SessionManager';
import { generateCorrectionSuggestions } from './IntentCorrectionEngine';
import { type UserContext, type BookingState } from './ChatbotTypes';
import { scrollToBottom, addBotMessage, addDepartmentContacts } from './ChatbotHelpers';
import { useBookingHandlers, useSpaHandlers, useMessageHandlers } from './ChatbotHandlers';

// Interactive Components (lazy loaded)
import FAQEngine from './FAQEngine';
import SmartSuggestionEngine from './SmartSuggestionEngine';
import IntentCorrectionEngine from './IntentCorrectionEngine';
import { InteractiveFeatures } from './InteractiveFeatures';
import { DataDrivenInsights } from './DataDrivenInsights';
import { InteractiveChatElements } from './InteractiveChatElements';
import FAQPromptSuggestions from './FAQPromptSuggestions';

const ChatbotCore = () => {
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
  const [showFAQPrompts, setShowFAQPrompts] = useState(false);
  
  const [userContext, setUserContext] = useState<UserContext>({
    hasBooking: false,
    lastOrderTime: undefined,
    hasSpaBooking: false,
    isLoyaltyMember: false,
    timeOfDay: 'morning'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Custom hooks for handlers
  const { handleBookingFlow } = useBookingHandlers(bookingState, setBookingState, setMessages);
  const { handleSpaBookingFlow } = useSpaHandlers(setMessages);
  const { processUserMessage } = useMessageHandlers(
    messages, 
    setMessages, 
    sessionContext, 
    setSessionContext, 
    setIsTyping, 
    isSessionActive
  );

  // Enhanced initialization with error handling
  useEffect(() => {
    const initializeChat = async () => {
      try {
        await initializeSession();
        setSessionStartTime(new Date());
        
        // Enhanced greeting with better error handling
        addBotMessage(
          "Welcome to The Grand Luxury Hotel! I'm Sofia, your enhanced AI concierge. I'm here to help you with bookings, dining, amenities, and any questions you might have.", 
          setMessages,
          'greeting-buttons'
        );
        
        // Add service options after greeting
        setTimeout(() => {
          if (isSessionActive) {
            addBotMessage(
              "What would you like to explore today? I can help with room bookings, delicious dining options, luxurious amenities, or answer any questions about our services.",
              setMessages,
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
      scrollToBottom(messagesEndRef);
    } catch (error) {
      console.error('Scroll error:', error);
    }
  }, [messages]);

  // Enhanced error handling for initialization
  const handleInitializationError = () => {
    setIsError(true);
    addBotMessage(
      "I'm experiencing some technical difficulties while starting up. Please bear with me as I try to resolve this.",
      setMessages,
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
          setMessages,
          'critical-error'
        );
      }
    }, 3000);
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

    addBotMessage("Perfect! Based on your preferences, here are the best rooms for you:", setMessages, 'room-cards', {
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

    addBotMessage(`Great choice! I'll prioritize ${response.toLowerCase()} in my recommendations for you.`, setMessages);
  };

  const handleInteractiveElement = (elementId: string, value: any) => {
    dataManager.trackInteraction({
      type: 'selection',
      elementId,
      value,
      context: 'interactive_element'
    });

    if (elementId.includes('rating')) {
      addBotMessage(`Thank you for the ${value}-star rating! Your feedback is valuable to us.`, setMessages);
    } else if (elementId.includes('calendar')) {
      addBotMessage(`Perfect! I've noted your preferred date: ${value}. Let me show you available options.`, setMessages);
    }
  };

  const handleFAQSelect = (faq: any) => {
    addBotMessage(faq.answer, setMessages, 'text');
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
        addBotMessage("Here's our room service menu with fresh, delicious options:", setMessages, 'menu-items', { items: menuItems, categorized: true });
      },
      amenities: () => {
        addBotMessage("Here are our world-class amenities and services:", setMessages, 'amenity-info', { amenities: amenityServices });
      },
      verify_booking: () => {
        addBotMessage("Please provide your booking confirmation number or the phone number used for the reservation, and I'll help you access your booking details.", setMessages);
      },
      show_faq: () => {
        setShowFAQ(true);
        setShowSuggestions(false);
      },
      book_room: () => {
        handleBookingFlow('start_booking');
      },
      explore_dining: () => {
        addBotMessage("Discover our culinary excellence:", setMessages, 'menu-items', { items: menuItems, categorized: true });
      },
      explore_amenities: () => {
        addBotMessage("Experience luxury with our premium amenities:", setMessages, 'amenity-info', { amenities: amenityServices });
      },
      contact_support: () => {
        addDepartmentContacts(setMessages);
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
        addBotMessage("Our Business Center is available 24/7 with meeting rooms, printing facilities, and high-speed internet. Would you like to reserve a meeting room?", setMessages, 'text');
      },
      show_ai_concierge: () => {
        addBotMessage("I'm your AI Concierge! I can help you with bookings, dining recommendations, local attractions, and answer any questions about our hotel services. What would you like to know?", setMessages, 'text');
      },
      request_late_checkout: () => {
        addBotMessage("I'd be happy to arrange late checkout for you until 2 PM at no extra charge. Please provide your room number and I'll confirm the arrangement.", setMessages, 'text');
      },
      view_loyalty_perks: () => {
        addBotMessage("As a loyalty member, you enjoy exclusive benefits including room upgrades, late checkout, complimentary breakfast, and spa discounts. Would you like to use any of these perks?", setMessages, 'text');
      }
    };

    const actionHandler = quickActions[action];
    if (actionHandler) {
      try {
        actionHandler();
      } catch (error) {
        console.error(`Quick action error for ${action}:`, error);
        addBotMessage("I encountered an error processing that request. How else can I help you?", setMessages, 'error');
      }
    } else {
      addBotMessage("I'm not sure how to handle that request. Could you please be more specific?", setMessages, 'error');
    }
  };

  const handleRoomSelection = (room: any) => {
    if (bookingState.step === 'room_selection') {
      handleBookingFlow('room_selected', room);
    } else {
      addBotMessage(`Excellent choice! The ${room.name} is perfect for your stay.`, setMessages, 'text');
      setUserContext(prev => ({ ...prev, hasBooking: true }));
    }
  };

  const handleMenuItemSelection = (item: any) => {
    addBotMessage(`Great selection! I've noted ${item.name} for your order. Would you like to add more items or proceed with this order?`, setMessages, 'order-options', { selectedItem: item });
    setUserContext(prev => ({ ...prev, lastOrderTime: new Date().toISOString() }));
    
    setTimeout(() => {
      addBotMessage(
        "Since you've ordered room service, would you like to book a relaxing spa treatment to complete your in-room experience?",
        setMessages,
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
      addBotMessage(`Wonderful! I'd be happy to help you book ${amenity.name}.`, setMessages, 'amenity-booking', { amenity });
    }
  };

  const handlePaymentClick = (data: any) => {
    addBotMessage("Processing your payment... Payment completed successfully! Thank you for choosing The Grand Luxury Hotel.", setMessages, 'text');
  };

  const handleFAQPromptSelect = (prompt: string) => {
    processUserMessage(prompt);
    setShowFAQPrompts(false);
  };

  const insights = dataManager.getRealTimeInsights();

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

export default ChatbotCore;
