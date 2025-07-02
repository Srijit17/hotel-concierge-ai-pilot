import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, CheckCircle, Brain, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageRenderer, type Message } from './chatbot/MessageRenderer';
import { 
  detectIntent, 
  searchFAQ, 
  routeToModule, 
  type SessionContext 
} from '../lib/chatbot-ai';
import { menuItems, amenityServices } from '../lib/chatbot-data';

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
        text: "I want to make sure I understand you perfectly. Could you rephrase that or tell me more specifically what you'd like help with?",
        type: 'text' as const
      };
    } else {
      return {
        text: "I'd love to connect you with one of our helpful staff members who can assist you better.",
        type: 'department-contacts' as const,
        data: {
          departments: [
            { department: "Front Desk", phone: "+1 (555) 123-4567", hours: "24/7", description: "Check-in, reservations, general inquiries" }
          ]
        }
      };
    }
  };

  const generateResponse = (intent: string, confidence: number, entities: any, userText: string) => {
    // Check for FAQ first
    if (intent === 'FAQ' || confidence < 0.65) {
      const faqResult = searchFAQ(userText);
      if (faqResult && faqResult.confidence > 0.8) {
        return {
          text: faqResult.answer,
          type: 'text' as const
        };
      }
    }

    // Route to appropriate module
    const moduleResponse = routeToModule(intent, userText, entities);
    if (moduleResponse) {
      return moduleResponse;
    }

    if (confidence < 0.65) {
      return handleFallback(userText, confidence);
    }

    // Update session context
    setSessionContext(prev => ({
      ...prev,
      previousIntents: [...prev.previousIntents.slice(-2), intent],
      fallbackCount: 0
    }));

    switch (intent) {
      case 'GreetGuest':
        return {
          text: "Hello! Welcome to The Grand Luxury Hotel. I'm Sofia, your AI concierge assistant. How can I help you today?",
          type: 'greeting-buttons' as const
        };

      case 'CheckRoomAvailability':
        return {
          text: "I'd be delighted to help you find the perfect room. Here are our available options:",
          type: 'room-cards' as const,
          data: {
            rooms: [
              { id: '1', name: 'Sea View Deluxe', type: 'deluxe', price_per_night: 349, features: ['Ocean views'], max_guests: 2, image_url: '/placeholder.svg', available: true }
            ]
          }
        };

      case 'RequestRoomService':
        return {
          text: "I'd be delighted to show you our room service menu:",
          type: 'menu-items' as const,
          data: {
            items: menuItems,
            categorized: true
          }
        };

      case 'AskAboutAmenities':
        return {
          text: "Here are our world-class amenities:",
          type: 'amenity-info' as const,
          data: {
            amenities: amenityServices
          }
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
    const userInput = input;
    setInput('');

    // Detect intent and generate response
    const { intent, confidence, entities } = detectIntent(userInput, sessionContext);
    const response = generateResponse(intent, confidence, entities, userInput);

    setTimeout(() => {
      addBotMessage(response.text, response.type, response.data);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'room_availability':
        addBotMessage("Here are our available rooms:", 'room-cards', {
          rooms: [{ id: '1', name: 'Sea View Deluxe', type: 'deluxe', price_per_night: 349, features: ['Ocean views'], max_guests: 2, image_url: '/placeholder.svg', available: true }]
        });
        break;
      case 'room_service':
        addBotMessage("Here's our room service menu:", 'menu-items', { items: menuItems, categorized: true });
        break;
      case 'amenities':
        addBotMessage("Here are our amenities:", 'amenity-info', { amenities: amenityServices });
        break;
    }
  };

  const handleRoomSelection = (room: Room) => {
    addBotMessage(`Excellent choice! The ${room.name} is perfect.`, 'text');
  };

  const handleMenuItemSelection = (item: MenuItem) => {
    setCurrentOrder(prev => ({ ...prev, items: [...prev.items, item] }));
    addBotMessage(`Added ${item.name} to your order.`, 'text');
  };

  const handleAmenityBooking = (amenity: AmenityService) => {
    addBotMessage(`Great choice! ${amenity.name} has been noted.`, 'text');
  };

  const handlePaymentClick = (data: any) => {
    addBotMessage("Payment processed successfully!", 'text');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-primary" />
            <span>Sofia - AI Hotel Concierge</span>
          </div>
          <Badge variant="outline" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
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
                <MessageRenderer
                  message={message}
                  onRoomSelection={handleRoomSelection}
                  onMenuItemSelection={handleMenuItemSelection}
                  onAmenityBooking={handleAmenityBooking}
                  onQuickAction={handleQuickAction}
                  onPaymentClick={handlePaymentClick}
                />
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
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UnifiedHotelChatbot;