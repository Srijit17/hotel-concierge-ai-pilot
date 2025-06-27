
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, User, Bot, Calendar, MapPin, Coffee, Bed } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'booking' | 'menu' | 'amenity';
  data?: any;
}

const HotelChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to The Grand Luxury Hotel! I'm Sofia, your personal concierge assistant. How may I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickReplies = [
    { text: "Check room availability", icon: Calendar },
    { text: "Order room service", icon: Coffee },
    { text: "Hotel amenities", icon: MapPin },
    { text: "Concierge services", icon: Bed }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = async (text: string) => {
    const lowerText = text.toLowerCase();
    let response = '';
    let responseType: 'text' | 'booking' | 'menu' | 'amenity' = 'text';
    let responseData = null;

    // Simple intent recognition
    if (lowerText.includes('room') && (lowerText.includes('available') || lowerText.includes('book'))) {
      response = "I'd be happy to help you check room availability! What dates are you looking for?";
      responseType = 'booking';
      responseData = {
        action: 'room_inquiry',
        rooms: [
          { type: 'Deluxe King', price: '$299/night', available: true },
          { type: 'Executive Suite', price: '$449/night', available: true },
          { type: 'Presidential Suite', price: '$899/night', available: false }
        ]
      };
    } else if (lowerText.includes('room service') || lowerText.includes('food') || lowerText.includes('order')) {
      response = "I can help you with room service! Here's our menu selection:";
      responseType = 'menu';
      responseData = {
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
      };
    } else if (lowerText.includes('amenities') || lowerText.includes('facilities') || lowerText.includes('gym')) {
      response = "Here are our premium amenities:";
      responseType = 'amenity';
      responseData = {
        amenities: [
          { name: 'Fitness Center', hours: '24/7', location: 'Ground Floor' },
          { name: 'Spa & Wellness', hours: '6AM - 10PM', location: '2nd Floor' },
          { name: 'Swimming Pool', hours: '6AM - 11PM', location: 'Rooftop' },
          { name: 'Business Center', hours: '24/7', location: 'Lobby Level' }
        ]
      };
    } else if (lowerText.includes('concierge') || lowerText.includes('recommend') || lowerText.includes('local')) {
      response = "I can provide local recommendations! Are you interested in dining, shopping, or attractions?";
    } else {
      response = "I understand you're asking about hotel services. I can help with room bookings, room service, amenities information, or local recommendations. What would you like to know more about?";
    }

    return { text: response, type: responseType, data: responseData };
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
    setInputText('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(async () => {
      const botResponse = await processMessage(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        type: botResponse.type,
        data: botResponse.data,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
    handleSendMessage();
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

    return <p>{message.text}</p>;
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
            <p className="text-sm opacity-90">The Grand Luxury Hotel</p>
          </div>
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
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white border border-gray-200 rounded-bl-sm shadow-sm'
              }`}>
                {renderMessageContent(message)}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
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
