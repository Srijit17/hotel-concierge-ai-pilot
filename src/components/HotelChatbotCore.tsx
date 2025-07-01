
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Star, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type?: 'text' | 'room-cards' | 'booking-summary';
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

interface BookingData {
  room?: Room;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  guestName?: string;
}

const HotelChatbotCore = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [currentBooking, setCurrentBooking] = useState<BookingData>({});
  const [awaitingInput, setAwaitingInput] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');

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
        // BRICK 1: Greeting & Identity Recognition
        addBotMessage("👋 Welcome to our hotel! I'm here to help you with room bookings and information. What's your name?", 'text');
        setAwaitingInput('name');
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const addBotMessage = (content: string, type: 'text' | 'room-cards' | 'booking-summary' = 'text', data?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      content,
      timestamp: new Date(),
      type,
      data
    };
    setMessages(prev => [...prev, message]);
    
    // Store in database
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
    
    // Store in database
    if (sessionId) {
      supabase.from('messages').insert({
        session_id: sessionId,
        sender: 'user',
        content,
        timestamp: new Date().toISOString()
      });
    }
  };

  const detectIntent = (message: string): string => {
    const lower = message.toLowerCase();
    
    if (lower.includes('room') && (lower.includes('available') || lower.includes('availability'))) {
      return 'CheckRoomAvailability';
    }
    if (lower.includes('book') || lower.includes('reserve')) {
      return 'BookRoom';
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return 'GreetGuest';
    }
    
    return 'Unknown';
  };

  const handleRoomAvailability = async () => {
    try {
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('available', true);
      
      if (rooms && rooms.length > 0) {
        addBotMessage("Here are our available rooms:", 'room-cards', rooms);
        setTimeout(() => {
          addBotMessage("Would you like to book any of these rooms? Just let me know which one interests you!");
        }, 1000);
      } else {
        addBotMessage("I'm sorry, we don't have any rooms available at the moment. Please check back later!");
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      addBotMessage("I'm having trouble accessing our room information right now. Please try again in a moment.");
    }
  };

  const handleBookingFlow = (roomName?: string) => {
    if (roomName) {
      // Find the selected room
      const room = messages
        .find(m => m.type === 'room-cards')?.data
        ?.find((r: Room) => r.name === roomName);
      
      if (room) {
        setCurrentBooking({ room });
        addBotMessage(`Great choice! You've selected the ${room.name}. When would you like to check in? (Please provide a date in YYYY-MM-DD format)`);
        setAwaitingInput('checkin');
      }
    } else {
      addBotMessage("I'd be happy to help you book a room! Let me first show you what's available.");
      handleRoomAvailability();
    }
  };

  const processBookingInput = (input: string) => {
    switch (awaitingInput) {
      case 'checkin':
        setCurrentBooking(prev => ({ ...prev, checkIn: input }));
        addBotMessage(`Check-in: ${input}. When would you like to check out? (YYYY-MM-DD format)`);
        setAwaitingInput('checkout');
        break;
      
      case 'checkout':
        setCurrentBooking(prev => ({ ...prev, checkOut: input }));
        addBotMessage("How many guests will be staying?");
        setAwaitingInput('guests');
        break;
      
      case 'guests':
        const guests = parseInt(input);
        setCurrentBooking(prev => ({ ...prev, guests }));
        showBookingSummary({ ...currentBooking, guests });
        setAwaitingInput('');
        break;
    }
  };

  const showBookingSummary = async (booking: BookingData) => {
    if (booking.room && booking.checkIn && booking.checkOut && booking.guests) {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = nights * booking.room.price_per_night;

      addBotMessage("Perfect! Here's your booking summary:", 'booking-summary', {
        ...booking,
        nights,
        totalAmount,
        guestName
      });

      // Save to database
      try {
        await supabase.from('bookings').insert({
          room_type: booking.room.type,
          check_in: booking.checkIn,
          check_out: booking.checkOut,
          guests: booking.guests,
          total_amount: totalAmount,
          status: 'confirmed'
        });
        
        setTimeout(() => {
          addBotMessage("Your booking has been confirmed! Is there anything else I can help you with today?");
        }, 1000);
      } catch (error) {
        console.error('Error saving booking:', error);
        addBotMessage("Your booking details look good, but I had trouble saving them. Please contact our front desk to complete the reservation.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);
    
    // Handle name input first
    if (awaitingInput === 'name') {
      setGuestName(input);
      addBotMessage(`Nice to meet you, ${input}! 🌟 How can I assist you today?`, 'text');
      setTimeout(() => {
        addBotMessage("You can ask me about:\n• Room availability\n• Making a booking\n• Hotel services");
      }, 1000);
      setAwaitingInput('');
      setInput('');
      return;
    }

    // Handle booking flow inputs
    if (awaitingInput) {
      processBookingInput(input);
      setInput('');
      return;
    }

    // Regular intent detection
    const intent = detectIntent(input);
    
    switch (intent) {
      case 'GreetGuest':
        addBotMessage(`Hello${guestName ? ' ' + guestName : ''}! 👋 How can I help you today?`);
        break;
      
      case 'CheckRoomAvailability':
        handleRoomAvailability();
        break;
      
      case 'BookRoom':
        handleBookingFlow();
        break;
      
      default:
        // Check if user is selecting a room
        const roomSelection = messages
          .find(m => m.type === 'room-cards')?.data
          ?.find((r: Room) => input.toLowerCase().includes(r.name.toLowerCase()));
        
        if (roomSelection) {
          handleBookingFlow(roomSelection.name);
        } else {
          addBotMessage("I'm not sure I understand. You can ask me about room availability, make a booking, or ask about our services. How can I help?");
        }
    }
    
    setInput('');
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'room-cards' && message.data) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <div className="grid gap-3">
            {message.data.map((room: Room) => (
              <Card key={room.id} className="border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => handleBookingFlow(room.name)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-blue-900">{room.name}</h4>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${room.price_per_night}</p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{room.type}</Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      Up to {room.max_guests} guests
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {room.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'booking-summary' && message.data) {
      const { room, checkIn, checkOut, guests, nights, totalAmount, guestName } = message.data;
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">{message.content}</p>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Guest:</span>
                  <span>{guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Room:</span>
                  <span>{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-in:</span>
                  <span>{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-out:</span>
                  <span>{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Nights:</span>
                  <span>{nights}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">${totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <p className="text-sm whitespace-pre-line">{message.content}</p>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Hotel Concierge Assistant
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
                    ? 'bg-blue-600 text-white'
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
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelChatbotCore;
