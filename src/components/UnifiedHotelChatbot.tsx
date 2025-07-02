import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Brain, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageRenderer, type Message } from './chatbot/MessageRenderer';
import { enhancedAI } from '../lib/enhanced-chatbot-ai';
import { type SessionContext } from '../lib/chatbot-ai';
import { menuItems, amenityServices } from '../lib/chatbot-data';
import FAQEngine from './chatbot/FAQEngine';
import SmartSuggestionEngine from './chatbot/SmartSuggestionEngine';
import IntentCorrectionEngine, { generateCorrectionSuggestions } from './chatbot/IntentCorrectionEngine';

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

const UnifiedHotelChatbot = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    fallbackCount: 0,
    previousIntents: [],
    visitCount: 1
  });
  
  // New AI-enhanced states
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [correctionSuggestions, setCorrectionSuggestions] = useState<any[]>([]);
  const [userContext, setUserContext] = useState({
    hasBooking: false,
    lastOrderTime: undefined,
    hasSpaBooking: false,
    isLoyaltyMember: false,
    timeOfDay: 'morning' as 'morning' | 'afternoon' | 'evening' | 'night'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize chatbot
  useEffect(() => {
    initializeSession();
    addBotMessage(
      "Welcome to The Grand Luxury Hotel! I'm Sofia, your AI-powered concierge assistant. I'm here to make your stay absolutely perfect. How may I assist you today?", 
      'greeting-buttons'
    );
    
    // Update time of day
    updateTimeOfDay();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateTimeOfDay = () => {
    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    setUserContext(prev => ({ ...prev, timeOfDay }));
  };

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
    const userInput = input;
    setInput('');
    
    // Check for intent correction first
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
      // Get previous user messages for context
      const previousMessages = messages
        .filter(m => m.sender === 'user')
        .slice(-3)
        .map(m => m.content);

      // Generate response using enhanced AI
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

      // Show suggestions based on response
      setShowSuggestions(true);
      setShowFAQ(false);

      // Simulate short delay for natural feel
      setTimeout(() => {
        setIsTyping(false);
        
        // Handle different response types with fallback
        if (response.confidence < 0.5) {
          // AI Fallback & Department Routing
          addBotMessage(
            "I'm sorry, I couldn't understand your request completely. Let me connect you with our specialized departments:",
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
                  department: "Guest Relations", 
                  phone: "+91 90000 33333", 
                  email: "support@grandluxury.com",
                  hours: "24/7", 
                  description: "General assistance and special requests" 
                }
              ]
            }
          );
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
      }, Math.random() * 800 + 200);

    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
      addBotMessage(
        "I apologize, but I'm having trouble processing your request right now. Please contact our front desk for immediate assistance at +91 90000 11111",
        'department-contacts',
        {
          departments: [
            { 
              department: "Front Desk", 
              phone: "+91 90000 11111", 
              hours: "24/7", 
              description: "General inquiries and immediate assistance" 
            }
          ]
        }
      );
    }
  };

  // New AI brick handlers
  const handleFAQSelect = (faq: any) => {
    addBotMessage(faq.answer, 'text');
    setShowFAQ(false);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    // Process suggestion as if user typed it
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
        addBotMessage("Here are our available rooms:", 'room-cards', {
          rooms: [
            { id: '1', name: 'Deluxe Room', type: 'deluxe', price_per_night: 200, features: ['City View', 'Free WiFi'], max_guests: 2, image_url: '/placeholder.svg', available: true },
            { id: '2', name: 'Ocean View Suite', type: 'suite', price_per_night: 350, features: ['Ocean View', 'Balcony'], max_guests: 4, image_url: '/placeholder.svg', available: true }
          ]
        });
      },
      room_service: () => {
        addBotMessage("Here's our room service menu:", 'menu-items', { items: menuItems, categorized: true });
      },
      amenities: () => {
        addBotMessage("Here are our world-class amenities:", 'amenity-info', { amenities: amenityServices });
      },
      verify_booking: () => {
        addBotMessage("Please provide your booking confirmation number or the phone number used for the reservation, and I'll help you access your booking details.");
      },
      show_faq: () => {
        setShowFAQ(true);
        setShowSuggestions(false);
      }
    };

    const actionHandler = quickActions[action];
    if (actionHandler) {
      actionHandler();
    }
  };

  const handleRoomSelection = (room: any) => {
    addBotMessage(`Excellent choice! The ${room.name} is perfect for your stay.`, 'text');
    setUserContext(prev => ({ ...prev, hasBooking: true }));
  };

  const handleMenuItemSelection = (item: any) => {
    addBotMessage(`Great selection! I've noted ${item.name} for your order.`, 'text');
    setUserContext(prev => ({ ...prev, lastOrderTime: new Date().toISOString() }));
  };

  const handleAmenityBooking = (amenity: any) => {
    addBotMessage(`Wonderful! ${amenity.name} has been added to your preferences.`, 'text');
    if (amenity.category === 'Spa') {
      setUserContext(prev => ({ ...prev, hasSpaBooking: true }));
    }
  };

  const handlePaymentClick = (data: any) => {
    addBotMessage("Processing your payment... Payment completed successfully!", 'text');
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
            <Badge variant="outline" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Fast AI
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Brain className="w-3 h-3 mr-1" />
              Enhanced
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intent Correction Engine */}
        {correctionSuggestions.length > 0 && (
          <IntentCorrectionEngine
            userInput={messages[messages.length - 1]?.content || ''}
            suggestions={correctionSuggestions}
            onAcceptCorrection={handleAcceptCorrection}
            onRejectCorrection={handleRejectCorrection}
          />
        )}

        {/* FAQ Engine */}
        {showFAQ && (
          <FAQEngine onQuestionSelect={handleFAQSelect} />
        )}

        {/* Smart Suggestion Engine */}
        {showSuggestions && messages.length > 2 && (
          <SmartSuggestionEngine
            userContext={userContext}
            onSuggestionSelect={handleSuggestionSelect}
          />
        )}

        {/* Messages */}
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
                <MessageRenderer
                  message={message}
                  onRoomSelection={handleRoomSelection}
                  onMenuItemSelection={handleMenuItemSelection}
                  onAmenityBooking={handleAmenityBooking}
                  onQuickAction={handleQuickAction}
                  onPaymentClick={handlePaymentClick}
                />
              )}
              <div className={`text-xs mt-1 flex items-center justify-between ${
                message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                <span>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.sender === 'bot' && message.confidence && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    {Math.round(message.confidence * 100)}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 max-w-[85%]">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-xs text-muted-foreground ml-2">Sofia is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={isTyping || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction('show_faq')}
            className="text-xs"
          >
            FAQ
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-xs"
          >
            {showSuggestions ? 'Hide' : 'Show'} Suggestions
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UnifiedHotelChatbot;
