import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, User, Bot, Calendar, MapPin, Coffee, Bed, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'booking' | 'menu' | 'amenity' | 'fallback';
  intent?: string;
  confidence?: number;
  data?: any;
}

interface SessionContext {
  guestName?: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  roomNumber?: string;
  fallbackCount: number;
  previousIntents: string[];
}

const HotelChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to The Grand Luxury Hotel! I'm Sofia, your personal concierge assistant. How may I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      intent: 'greeting',
      confidence: 1.0
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    fallbackCount: 0,
    previousIntents: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickReplies = [
    { text: "Check room availability", icon: Calendar, intent: "CheckRoomAvailability" },
    { text: "Order room service", icon: Coffee, intent: "RequestRoomService" },
    { text: "Hotel amenities", icon: MapPin, intent: "AskAboutAmenities" },
    { text: "Speak to human", icon: Bed, intent: "SpeakToHuman" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectIntent = (text: string): { intent: string; confidence: number; entities: any } => {
    const lowerText = text.toLowerCase();
    
    // Enhanced intent detection with better pattern matching
    const intentPatterns = [
      {
        intent: 'CheckRoomAvailability',
        patterns: ['room', 'available', 'vacancy', 'book', 'reserve', 'accommodation', 'stay', 'check-in'],
        confidence: 0.9
      },
      {
        intent: 'RequestRoomService',
        patterns: ['room service', 'food', 'order', 'breakfast', 'dinner', 'menu', 'hungry', 'eat'],
        confidence: 0.85
      },
      {
        intent: 'AskAboutAmenities',
        patterns: ['gym', 'pool', 'spa', 'amenities', 'facilities', 'wifi', 'fitness', 'swimming'],
        confidence: 0.8
      },
      {
        intent: 'RequestLateCheckout',
        patterns: ['late checkout', 'extend', 'checkout time', 'stay longer'],
        confidence: 0.85
      },
      {
        intent: 'SpeakToHuman',
        patterns: ['human', 'agent', 'person', 'staff', 'help me', 'transfer', 'connect'],
        confidence: 0.9
      },
      {
        intent: 'GeneralGreetings',
        patterns: ['hello', 'hi', 'good morning', 'good evening', 'hey', 'greetings'],
        confidence: 0.95
      }
    ];

    // Check for intent matches
    for (const intentData of intentPatterns) {
      const matchCount = intentData.patterns.filter(pattern => lowerText.includes(pattern)).length;
      if (matchCount > 0) {
        const confidence = Math.min(intentData.confidence + (matchCount * 0.05), 0.98);
        return {
          intent: intentData.intent,
          confidence,
          entities: extractEntities(text, intentData.intent)
        };
      }
    }

    // Check if this might be a follow-up question
    if (sessionContext.previousIntents.length > 0) {
      const lastIntent = sessionContext.previousIntents[sessionContext.previousIntents.length - 1];
      if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much')) {
        return { intent: lastIntent, confidence: 0.75, entities: { followUp: 'pricing' } };
      }
      if (lowerText.includes('yes') || lowerText.includes('ok') || lowerText.includes('sure')) {
        return { intent: lastIntent, confidence: 0.8, entities: { confirmation: true } };
      }
    }

    return { intent: 'fallback', confidence: 0.1, entities: {} };
  };

  const extractEntities = (text: string, intent: string): any => {
    const entities: any = {};
    const lowerText = text.toLowerCase();

    // Date extraction
    if (lowerText.includes('tonight')) entities.date = 'tonight';
    if (lowerText.includes('tomorrow')) entities.date = 'tomorrow';
    if (lowerText.includes('weekend')) entities.date = 'weekend';
    if (lowerText.includes('next week')) entities.date = 'next week';

    // Room type extraction
    if (lowerText.includes('suite')) entities.roomType = 'suite';
    if (lowerText.includes('deluxe')) entities.roomType = 'deluxe';
    if (lowerText.includes('view')) entities.roomType = 'view';
    if (lowerText.includes('ocean')) entities.roomType = 'ocean view';

    // Food items
    if (intent === 'RequestRoomService') {
      if (lowerText.includes('breakfast')) entities.meal = 'breakfast';
      if (lowerText.includes('lunch')) entities.meal = 'lunch';
      if (lowerText.includes('dinner')) entities.meal = 'dinner';
    }

    return entities;
  };

  const generateResponse = (intent: string, confidence: number, entities: any, userText: string) => {
    console.log(`Intent: ${intent}, Confidence: ${confidence}, Entities:`, entities);

    // Handle low confidence with smart fallback
    if (confidence < 0.7) {
      return handleFallback(userText, confidence);
    }

    // Update session context
    setSessionContext(prev => ({
      ...prev,
      previousIntents: [...prev.previousIntents.slice(-2), intent],
      fallbackCount: 0 // Reset fallback count on successful intent
    }));

    switch (intent) {
      case 'CheckRoomAvailability':
        if (entities.followUp === 'pricing') {
          return {
            text: `For the ${sessionContext.roomType || 'rooms'} you asked about:\n• Sea View Room: $349/night\n• Garden View Room: $299/night\n• Deluxe Suite: $449/night\n\nAll rates include breakfast. Would you like to make a reservation?`,
            type: 'booking' as const,
            data: {
              rooms: [
                { type: 'Sea View Room', price: '$349/night', available: true },
                { type: 'Garden View Room', price: '$299/night', available: true },
                { type: 'Deluxe Suite', price: '$449/night', available: true }
              ]
            }
          };
        }
        
        const dateText = entities.date ? ` for ${entities.date}` : '';
        const roomText = entities.roomType ? ` with ${entities.roomType}` : '';
        
        return {
          text: `I'd be happy to help you find available rooms${roomText}${dateText}. Let me check our availability:`,
          type: 'booking' as const,
          data: {
            rooms: [
              { type: 'Sea View Room', price: '$349/night', available: true },
              { type: 'Garden View Room', price: '$299/night', available: true },
              { type: 'Deluxe Suite', price: '$449/night', available: true }
            ]
          }
        };

      case 'RequestRoomService':
        if (entities.meal) {
          return {
            text: `Perfect! Here's our ${entities.meal} menu:`,
            type: 'menu' as const,
            data: {
              categories: [
                {
                  name: entities.meal.charAt(0).toUpperCase() + entities.meal.slice(1),
                  items: entities.meal === 'breakfast' 
                    ? [
                        { name: 'Continental Breakfast', price: '$28' },
                        { name: 'Full English Breakfast', price: '$35' },
                        { name: 'Fresh Fruit Bowl', price: '$18' }
                      ]
                    : [
                        { name: 'Grilled Salmon', price: '$42' },
                        { name: 'Wagyu Steak', price: '$65' },
                        { name: 'Vegetarian Pasta', price: '$32' }
                      ]
                }
              ]
            }
          };
        }
        
        return {
          text: "I'd be happy to help with room service! Here's our menu selection:",
          type: 'menu' as const,
          data: {
            categories: [
              {
                name: 'Breakfast',
                items: [
                  { name: 'Continental Breakfast', price: '$28' },
                  { name: 'Full English Breakfast', price: '$35' }
                ]
              },
              {
                name: 'Dinner',
                items: [
                  { name: 'Grilled Salmon', price: '$42' },
                  { name: 'Wagyu Steak', price: '$65' }
                ]
              }
            ]
          }
        };

      case 'AskAboutAmenities':
        return {
          text: "Here are our premium amenities:",
          type: 'amenity' as const,
          data: {
            amenities: [
              { name: 'Fitness Center', hours: '24/7', location: 'Ground Floor' },
              { name: 'Spa & Wellness', hours: '6AM - 10PM', location: '2nd Floor' },
              { name: 'Swimming Pool', hours: '6AM - 11PM', location: 'Rooftop' },
              { name: 'Business Center', hours: '24/7', location: 'Lobby Level' }
            ]
          }
        };

      case 'SpeakToHuman':
        return {
          text: "I'll connect you with our guest services team right away. Please hold while I transfer you to a human agent who can provide personalized assistance.",
          type: 'text' as const
        };

      case 'GeneralGreetings':
        return {
          text: "Hello! I'm Sofia, your personal concierge assistant at The Grand Luxury Hotel. I can help you with room bookings, room service, amenities information, and general inquiries. What would you like to know about?",
          type: 'text' as const
        };

      default:
        return handleFallback(userText, confidence);
    }
  };

  const handleFallback = (userText: string, confidence: number) => {
    const newFallbackCount = sessionContext.fallbackCount + 1;
    
    setSessionContext(prev => ({
      ...prev,
      fallbackCount: newFallbackCount
    }));

    if (newFallbackCount === 1) {
      return {
        text: "I'm not sure I understood that completely. Are you looking to:\n• Check room availability\n• Order room service\n• Get information about amenities\n• Speak with a human agent?",
        type: 'fallback' as const
      };
    } else if (newFallbackCount === 2) {
      return {
        text: "Let me help you with our most common requests:\n\n🏨 Room Bookings - Check availability and make reservations\n🍽️ Room Service - Order food and beverages\n🏊 Amenities - Pool, gym, spa, and facilities\n👤 Human Agent - Speak with our guest services team\n\nWhat can I help you with?",
        type: 'fallback' as const
      };
    } else {
      return {
        text: "I want to make sure you get the best assistance possible. Let me connect you with our guest services team who can help you directly with any questions or requests.",
        type: 'text' as const
      };
    }
  };

  const processMessage = async (text: string) => {
    const { intent, confidence, entities } = detectIntent(text);
    return generateResponse(intent, confidence, entities, text);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      const botResponse = await processMessage(currentInput);
      const { intent, confidence } = detectIntent(currentInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        type: botResponse.type,
        data: botResponse.data,
        intent,
        confidence,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.type === 'booking' && message.data) {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>
          <div className="grid gap-2">
            {message.data.rooms.map((room: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-medium">{room.type}</p>
                  <p className="text-sm text-gray-600">{room.price}</p>
                </div>
                <Badge variant={room.available ? "default" : "secondary"}>
                  {room.available ? "Available" : "Booked"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'menu' && message.data) {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>
          {message.data.categories.map((category: any, index: number) => (
            <div key={index} className="bg-white rounded-lg p-3 border">
              <h4 className="font-medium mb-2">{category.name}</h4>
              {category.items.map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="flex justify-between py-1">
                  <span>{item.name}</span>
                  <span className="text-blue-600 font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (message.type === 'amenity' && message.data) {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>
          <div className="grid gap-2">
            {message.data.amenities.map((amenity: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-medium">{amenity.name}</p>
                  <p className="text-sm text-gray-600">{amenity.location}</p>
                </div>
                <Badge variant="outline">{amenity.hours}</Badge>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <p className={message.type === 'fallback' ? 'whitespace-pre-line' : ''}>{message.text}</p>;
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col shadow-2xl border-0 bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Sofia - Concierge Assistant</h3>
            <p className="text-sm opacity-90">The Grand Luxury Hotel • Enhanced NLU</p>
          </div>
          {sessionContext.fallbackCount > 0 && (
            <div className="ml-auto">
              <AlertCircle className="w-5 h-5 text-yellow-300" title={`Fallback count: ${sessionContext.fallbackCount}`} />
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : message.type === 'fallback'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : message.type === 'fallback' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : message.type === 'fallback'
                    ? 'bg-yellow-50 border border-yellow-200 rounded-bl-sm'
                    : 'bg-white border border-gray-200 rounded-bl-sm shadow-sm'
              }`}>
                {renderMessageContent(message)}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {message.sender === 'bot' && message.confidence && (
                    <Badge variant="outline" className="text-xs ml-2">
                      {(message.confidence * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="p-4 border-t bg-gray-50/50">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {quickReplies.map((reply, index) => {
            const IconComponent = reply.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-8 justify-start"
                onClick={() => handleQuickReply(reply.text)}
              >
                <IconComponent className="w-3 h-3 mr-1" />
                {reply.text}
              </Button>
            );
          })}
        </div>
        
        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HotelChatbot;
