
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
  visitCount: number;
  currentBooking?: any;
}

const HotelChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to The Grand Luxury Hotel! I'm Sofia, your personal concierge assistant. I'm here to make your stay absolutely perfect. How may I assist you today?",
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
    previousIntents: [],
    visitCount: 1
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickReplies = [
    { text: "Check room availability", icon: Calendar, intent: "CheckRoomAvailability" },
    { text: "Order room service", icon: Coffee, intent: "RequestRoomService" },
    { text: "Hotel amenities", icon: MapPin, intent: "AskAboutAmenities" },
    { text: "Speak to concierge", icon: Bed, intent: "SpeakToHuman" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectIntent = (text: string): { intent: string; confidence: number; entities: any } => {
    const lowerText = text.toLowerCase();
    
    // Enhanced intent detection with hospitality-specific patterns
    const intentPatterns = [
      {
        intent: 'CheckRoomAvailability',
        patterns: [
          'room', 'available', 'vacancy', 'free', 'tonight', 'tomorrow', 'weekend', 
          'suite', 'king', 'queen', 'double', 'single', 'view', 'balcony', 'ocean',
          'check availability', 'any rooms', 'book', 'reserve'
        ],
        confidence: 0.92,
        weight: 2
      },
      {
        intent: 'BookRoom',
        patterns: [
          'book', 'reserve', 'reservation', 'confirm booking', 'take it', 'yes book',
          'proceed', 'confirm', 'make reservation', 'i want', 'ill take'
        ],
        confidence: 0.94,
        weight: 3
      },
      {
        intent: 'RequestRoomService',
        patterns: [
          'room service', 'food', 'order', 'breakfast', 'lunch', 'dinner', 'menu', 
          'hungry', 'eat', 'drink', 'coffee', 'tea', 'sandwich', 'meal', 'deliver'
        ],
        confidence: 0.90,
        weight: 2
      },
      {
        intent: 'AskAboutAmenities',
        patterns: [
          'gym', 'pool', 'spa', 'amenities', 'facilities', 'wifi', 'fitness', 
          'swimming', 'restaurant', 'bar', 'parking', 'concierge', 'business center',
          'laundry', 'dry cleaning'
        ],
        confidence: 0.88,
        weight: 2
      },
      {
        intent: 'RequestLateCheckout',
        patterns: [
          'late checkout', 'extend', 'checkout time', 'stay longer', 'more time',
          'check out later', 'until', 'extra hours'
        ],
        confidence: 0.87,
        weight: 3
      },
      {
        intent: 'CancelReservation',
        patterns: [
          'cancel', 'cancellation', 'remove booking', 'delete reservation',
          'cant make it', 'need to cancel', 'cancel my'
        ],
        confidence: 0.95,
        weight: 4
      },
      {
        intent: 'ChangeReservation',
        patterns: [
          'change', 'modify', 'update', 'reschedule', 'different date',
          'edit booking', 'alter reservation'
        ],
        confidence: 0.89,
        weight: 3
      },
      {
        intent: 'Complaints',
        patterns: [
          'problem', 'issue', 'broken', 'not working', 'dirty', 'noisy', 'cold',
          'hot', 'complaint', 'wrong', 'bad', 'terrible', 'awful', 'disappointed'
        ],
        confidence: 0.91,
        weight: 4
      },
      {
        intent: 'HotelPolicyInquiry',
        patterns: [
          'policy', 'rules', 'pet', 'smoking', 'cancellation policy', 'check-in time',
          'check-out time', 'parking', 'dress code', 'children', 'age limit'
        ],
        confidence: 0.86,
        weight: 2
      },
      {
        intent: 'SpeakToHuman',
        patterns: [
          'human', 'person', 'agent', 'staff', 'concierge', 'manager', 'help',
          'talk to someone', 'real person', 'transfer', 'connect'
        ],
        confidence: 0.93,
        weight: 3
      },
      {
        intent: 'GeneralGreetings',
        patterns: [
          'hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon',
          'greetings', 'good day', 'howdy'
        ],
        confidence: 0.95,
        weight: 1
      },
      {
        intent: 'ThankYou',
        patterns: [
          'thank', 'thanks', 'appreciate', 'grateful', 'perfect', 'great',
          'awesome', 'wonderful', 'excellent'
        ],
        confidence: 0.85,
        weight: 1
      }
    ];

    // Calculate weighted scores
    let bestMatch = { intent: 'fallback', confidence: 0.1, entities: {} };
    
    for (const intentData of intentPatterns) {
      const matches = intentData.patterns.filter(pattern => lowerText.includes(pattern));
      if (matches.length > 0) {
        const baseScore = matches.length * intentData.weight * 0.1;
        const confidence = Math.min(intentData.confidence + baseScore, 0.98);
        
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            intent: intentData.intent,
            confidence,
            entities: extractEntities(text, intentData.intent)
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
      case 'CheckRoomAvailability':
        if (entities.followUp === 'pricing') {
          return {
            text: `Here are our current rates${personalGreeting ? ` for you, ${personalGreeting}` : ''}:\n\n🌊 **Sea View Deluxe** - $349/night\n• King bed, ocean balcony, complimentary champagne\n\n🏙️ **City View Premium** - $299/night  \n• Queen bed, city skyline, work desk\n\n🌴 **Garden Suite** - $449/night\n• Separate living area, garden terrace, butler service\n\nAll rates include breakfast, WiFi, and gym access. Shall I reserve one of these beautiful rooms for you?`,
            type: 'booking' as const,
            data: {
              rooms: [
                { type: 'Sea View Deluxe', price: '$349/night', available: true, features: 'Ocean balcony, champagne' },
                { type: 'City View Premium', price: '$299/night', available: true, features: 'City skyline, work desk' },
                { type: 'Garden Suite', price: '$449/night', available: true, features: 'Living area, terrace, butler' }
              ]
            }
          };
        }
        
        const dateText = entities.date ? ` for ${entities.date}` : '';
        const roomText = entities.roomType ? ` ${entities.roomType}` : '';
        
        return {
          text: `Absolutely! I'd be delighted to help you find the perfect${roomText} room${dateText}. Let me check our availability...\n\nWonderful news! We have several beautiful options available:`,
          type: 'booking' as const,
          data: {
            rooms: [
              { type: 'Sea View Deluxe', price: '$349/night', available: true, features: 'Ocean views, complimentary champagne' },
              { type: 'City View Premium', price: '$299/night', available: true, features: 'City skyline, work area' },
              { type: 'Garden Suite', price: '$449/night', available: true, features: 'Private terrace, butler service' }
            ]
          }
        };

      case 'BookRoom':
        if (entities.confirmation) {
          return {
            text: `Perfect choice${personalGreeting ? `, ${personalGreeting}` : ''}! I'm excited to confirm your reservation. To complete your booking, I'll need just a few details:\n\n• Your full name\n• Email address\n• Phone number\n• Any special requests?\n\nI'll also send you a confirmation with our concierge's direct number for anything you need during your stay!`,
            type: 'booking' as const,
            data: { bookingStep: 'collecting_details' }
          };
        }
        
        return {
          text: `Excellent! I can see you're ready to book with us - that's wonderful! Which of our beautiful rooms caught your eye? I can walk you through the booking process and even arrange some special touches to make your stay memorable.`,
          type: 'booking' as const
        };

      case 'RequestRoomService':
        const mealType = entities.meal || 'our signature dishes';
        
        return {
          text: `I'd be absolutely delighted to arrange room service for you! Our culinary team creates magic in the kitchen. Here's what we're featuring for ${mealType}:`,
          type: 'menu' as const,
          data: {
            categories: [
              {
                name: entities.meal === 'breakfast' ? 'Breakfast Delights' : 'Gourmet Selection',
                items: entities.meal === 'breakfast' 
                  ? [
                      { name: 'Chef\'s Continental Breakfast', price: '$32', description: 'Fresh pastries, seasonal fruits, artisan coffee' },
                      { name: 'Royal English Breakfast', price: '$38', description: 'Farm eggs, premium bacon, grilled tomatoes' },
                      { name: 'Healthy Paradise Bowl', price: '$28', description: 'Quinoa, fresh berries, Greek yogurt, honey' }
                    ]
                  : [
                      { name: 'Wagyu Beef Tenderloin', price: '$75', description: 'With truffle mashed potatoes, seasonal vegetables' },
                      { name: 'Pan-Seared Salmon', price: '$48', description: 'Lemon herb butter, wild rice, asparagus' },
                      { name: 'Vegetarian Risotto', price: '$36', description: 'Wild mushrooms, parmesan, fresh herbs' }
                    ]
              }
            ]
          }
        };

      case 'AskAboutAmenities':
        return {
          text: `I'm thrilled to share our world-class amenities with you! The Grand Luxury Hotel offers everything you need for an unforgettable stay:`,
          type: 'amenity' as const,
          data: {
            amenities: [
              { name: '🏋️ Platinum Fitness Center', hours: 'Open 24/7', location: 'Ground Floor', description: 'State-of-the-art equipment, personal trainers available' },
              { name: '🧘 Serenity Spa & Wellness', hours: '6AM - 10PM', location: '2nd Floor', description: 'Full-service spa, massage therapy, meditation room' },
              { name: '🏊 Infinity Rooftop Pool', hours: '6AM - 11PM', location: 'Rooftop (25th Floor)', description: 'Heated pool, poolside bar, stunning city views' },
              { name: '💼 Executive Business Lounge', hours: '24/7', location: 'Lobby Level', description: 'High-speed WiFi, printing services, meeting rooms' }
            ]
          }
        };

      case 'RequestLateCheckout':
        return {
          text: `Of course${personalGreeting ? `, ${personalGreeting}` : ''}! I completely understand - sometimes you need a little extra time to soak in the luxury. \n\nI can arrange late checkout until 2 PM at no additional charge, or until 4 PM for just $50. Which would work better for your schedule? I'll make sure housekeeping knows to give you all the time you need!`,
          type: 'text' as const
        };

      case 'CancelReservation':
        return {
          text: `I understand${personalGreeting ? `, ${personalGreeting}` : ''}, and I'm here to help make this as easy as possible for you. While I'm sad we won't be hosting you this time, I'd be happy to assist with your cancellation.\n\nMay I have your confirmation number? I'll process this right away and ensure any applicable refunds are handled promptly. Perhaps we can welcome you another time!`,
          type: 'text' as const
        };

      case 'ChangeReservation':
        return {
          text: `Absolutely${personalGreeting ? `, ${personalGreeting}` : ''}! I'd be happy to help modify your reservation. Flexibility is part of our exceptional service.\n\nWhat changes would you like to make? Different dates, room type, or number of guests? I'll check availability and make sure everything is perfect for your stay.`,
          type: 'text' as const
        };

      case 'Complaints':
        return {
          text: `I am truly sorry to hear about this issue${personalGreeting ? `, ${personalGreeting}` : ''}. This is absolutely not the experience we want for you at The Grand Luxury Hotel, and I take full responsibility for making this right immediately.\n\nI'm alerting our maintenance team right now, and I'd like to offer you a complimentary room upgrade and dinner voucher as an apology. May I also send up some refreshments while we resolve this? Your comfort is my priority.`,
          type: 'text' as const
        };

      case 'HotelPolicyInquiry':
        return {
          text: `I'm happy to clarify our policies for you! At The Grand Luxury Hotel, we strive to be as accommodating as possible:\n\n• **Check-in**: 3:00 PM (early check-in available upon request)\n• **Check-out**: 11:00 AM (late check-out complimentary until 2 PM)\n• **Cancellation**: 24 hours before arrival for full refund\n• **Pets**: Welcomed with advance notice ($75/night pet fee)\n• **Smoking**: Designated outdoor areas only\n\nIs there a specific policy you'd like me to explain in more detail?`,
          type: 'text' as const
        };

      case 'SpeakToHuman':
        return {
          text: `Of course! I'll connect you with our Guest Relations team right away. They're absolutely wonderful and will give you the personalized attention you deserve.\n\nI'm transferring you now to one of our concierge specialists who can assist with anything you need. Thank you for choosing The Grand Luxury Hotel!`,
          type: 'text' as const
        };

      case 'GeneralGreetings':
        const timeGreeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';
        const returnGuest = sessionContext.visitCount > 1 ? ' Welcome back!' : '';
        
        return {
          text: `${timeGreeting}${personalGreeting ? `, ${personalGreeting}` : ''}!${returnGuest} I'm Sofia, your dedicated concierge assistant here at The Grand Luxury Hotel. I'm here to make your experience absolutely exceptional.\n\nHow may I create a perfect moment for you today? Whether it's finding the ideal room, arranging dining, or sharing our amenities - I'm at your service!`,
          type: 'text' as const
        };

      case 'ThankYou':
        return {
          text: `You're so very welcome${personalGreeting ? `, ${personalGreeting}` : ''}! It's my absolute pleasure to assist you. Creating wonderful experiences for our guests is what makes my day.\n\nIs there anything else I can help you with? I'm here whenever you need me!`,
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
        text: `I want to make sure I understand you perfectly! Are you looking to:\n\n🏨 **Check room availability** or make a reservation?\n🍽️ **Order room service** or see our dining options?\n🌟 **Learn about our amenities** like spa, pool, or fitness center?\n👨‍💼 **Speak with our concierge team** for personalized assistance?\n\nJust let me know, and I'll take excellent care of you!`,
        type: 'fallback' as const
      };
    } else if (newFallbackCount === 2) {
      return {
        text: `Let me help you in the best way possible! Here are our most popular services:\n\n🔹 **Room Reservations** - Find and book your perfect room\n🔹 **Dining & Room Service** - Gourmet meals delivered to you  \n🔹 **Spa & Amenities** - Relaxation and wellness facilities\n🔹 **Guest Services** - Our human concierge team\n\nWhich of these interests you most? I'm here to make your stay unforgettable!`,
        type: 'fallback' as const
      };
    } else {
      return {
        text: `I want to ensure you get the very best assistance! Let me connect you directly with our amazing guest services team who can help with absolutely anything you need. They're the true experts at creating magical hotel experiences!\n\nTransferring you now to our concierge desk... 🌟`,
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
        data: 'data' in botResponse ? botResponse.data : undefined,
        intent,
        confidence,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
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
          <p className="whitespace-pre-line">{message.text}</p>
          <div className="grid gap-3">
            {message.data.rooms?.map((room: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg border shadow-sm">
                <div className="flex-1">
                  <p className="font-semibold text-blue-900">{room.type}</p>
                  <p className="text-sm text-gray-600 mt-1">{room.features}</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">{room.price}</p>
                </div>
                <Badge variant={room.available ? "default" : "secondary"} className="ml-3">
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
        <div className="space-y-4">
          <p className="whitespace-pre-line">{message.text}</p>
          {message.data.categories?.map((category: any, index: number) => (
            <div key={index} className="bg-white rounded-lg p-4 border shadow-sm">
              <h4 className="font-bold text-blue-900 mb-3">{category.name}</h4>
              {category.items?.map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="flex justify-between items-start py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                  </div>
                  <span className="text-blue-600 font-bold ml-3">{item.price}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (message.type === 'amenity' && message.data) {
      return (
        <div className="space-y-4">
          <p className="whitespace-pre-line">{message.text}</p>
          <div className="grid gap-3">
            {message.data.amenities?.map((amenity: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <div className="flex-1">
                  <p className="font-bold text-blue-900">{amenity.name}</p>
                  <p className="text-sm text-gray-700 mt-1">{amenity.description}</p>
                  <p className="text-xs text-blue-600 mt-1">📍 {amenity.location}</p>
                </div>
                <Badge variant="outline" className="ml-3 text-xs">
                  {amenity.hours}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <p className={message.type === 'fallback' ? 'whitespace-pre-line' : 'whitespace-pre-line'}>{message.text}</p>;
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
            <h3 className="font-semibold">Sofia - Personal Concierge</h3>
            <p className="text-sm opacity-90">The Grand Luxury Hotel • Always Here for You</p>
          </div>
          {sessionContext.fallbackCount > 0 && (
            <div className="ml-auto">
              <AlertCircle className="w-5 h-5 text-yellow-300" />
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
            <div className={`flex items-start space-x-2 max-w-[85%] ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : message.type === 'fallback'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
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
                    ? 'bg-amber-50 border border-amber-200 rounded-bl-sm'
                    : 'bg-white border border-gray-200 rounded-bl-sm shadow-sm'
              }`}>
                {renderMessageContent(message)}
                <div className="flex justify-between items-center mt-2">
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
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
                className="text-xs h-8 justify-start hover:bg-blue-50 hover:border-blue-300"
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
          <Button onClick={handleSendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HotelChatbot;
