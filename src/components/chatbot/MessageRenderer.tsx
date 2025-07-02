import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Users, Phone, Mail, MessageSquare, Clock, Star, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type?: 'text' | 'greeting-buttons' | 'service-options' | 'room-cards' | 'booking-form' | 'booking-confirmation' | 'post-booking-services' | 'menu-items' | 'amenity-info' | 'department-contacts' | 'spa-suggestion' | 'spa-amenities' | 'spa-booking' | 'spa-time-slots' | 'spa-payment' | 'order-options';
  data?: any;
  confidence?: number;
}

interface MessageRendererProps {
  message: Message;
  onRoomSelection: (room: any) => void;
  onMenuItemSelection: (item: any) => void;
  onAmenityBooking: (amenity: any) => void;
  onQuickAction: (action: string) => void;
  onPaymentClick: (data: any) => void;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({
  message,
  onRoomSelection,
  onMenuItemSelection,
  onAmenityBooking,
  onQuickAction,
  onPaymentClick
}) => {
  const [checkInDate, setCheckInDate] = React.useState<Date>();
  const [checkOutDate, setCheckOutDate] = React.useState<Date>();
  const [guests, setGuests] = React.useState<number>(1);
  const [guestDetails, setGuestDetails] = React.useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const handleBookingSubmit = (room: any) => {
    const bookingData = {
      room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      ...guestDetails
    };
    onPaymentClick({ type: 'booking', booking: bookingData });
  };

  if (message.type === 'greeting-buttons') {
    return (
      <div className="space-y-3">
        <p className="text-sm mb-4">{message.content}</p>
        <div className="grid gap-3">
          <Button
            onClick={() => onQuickAction('existing_guest')}
            className="bg-blue-600 hover:bg-blue-700 text-white justify-start p-4 h-auto"
          >
            <div className="text-left">
              <div className="font-semibold">🎫 Existing Guest</div>
              <div className="text-xs opacity-90">I have a booking number</div>
            </div>
          </Button>
          <Button
            onClick={() => onQuickAction('book_room')}
            className="bg-green-600 hover:bg-green-700 text-white justify-start p-4 h-auto"
          >
            <div className="text-left">
              <div className="font-semibold">🏨 Book a Room</div>
              <div className="text-xs opacity-90">Make a new reservation</div>
            </div>
          </Button>
          <Button
            onClick={() => onQuickAction('explore_services')}
            className="bg-purple-600 hover:bg-purple-700 text-white justify-start p-4 h-auto"
          >
            <div className="text-left">
              <div className="font-semibold">🍽️ Explore Services</div>
              <div className="text-xs opacity-90">Dining and amenities</div>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  if (message.type === 'service-options') {
    return (
      <div className="space-y-3">
        <p className="text-sm mb-4">{message.content}</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onQuickAction('explore_dining')}
            className="bg-orange-600 hover:bg-orange-700 text-white p-4 h-auto"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🍽️</div>
              <div className="font-semibold">Dining</div>
            </div>
          </Button>
          <Button
            onClick={() => onQuickAction('explore_amenities')}
            className="bg-teal-600 hover:bg-teal-700 text-white p-4 h-auto"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">💆‍♀️</div>
              <div className="font-semibold">Amenities</div>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  if (message.type === 'room-cards' && message.data?.rooms) {
    return (
      <div className="space-y-3">
        <p className="text-sm mb-4">{message.content}</p>
        <div className="grid gap-4">
          {message.data.rooms.map((room: any) => (
            <Card key={room.id} className="border-2 hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{room.name}</h3>
                    <p className="text-green-600 font-semibold">${room.price_per_night}/night</p>
                  </div>
                  <Badge variant="secondary">{room.max_guests} guests max</Badge>
                </div>
                
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {room.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Check-in</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-xs h-8",
                              !checkInDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {checkInDate ? format(checkInDate, "MMM dd") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={setCheckInDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Check-out</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-xs h-8",
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {checkOutDate ? format(checkOutDate, "MMM dd") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Guests</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                      >
                        -
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{guests}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setGuests(Math.min(room.max_guests, guests + 1))}
                      >
                        +
                      </Button>
                      <Users className="w-4 h-4 text-gray-400 ml-2" />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleBookingSubmit(room)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  disabled={!checkInDate || !checkOutDate}
                >
                  Book Now - ${room.price_per_night}/night
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (message.type === 'spa-suggestion' && message.data?.suggestedActions) {
    return (
      <div className="space-y-3">
        <p className="text-sm mb-4">{message.content}</p>
        <div className="grid grid-cols-2 gap-2">
          {message.data.suggestedActions.map((action: any, index: number) => (
            <Button
              key={index}
              onClick={() => onQuickAction(action.action)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs p-2 h-auto"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (message.type === 'spa-amenities' && message.data?.amenities) {
    return (
      <div className="space-y-3">
        <p className="text-sm mb-4">{message.content}</p>
        <div className="grid gap-3">
          {message.data.amenities.map((amenity: any) => (
            <Card key={amenity.id} className="border hover:border-purple-300 transition-colors">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{amenity.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{amenity.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">{amenity.duration}</Badge>
                      <Badge variant="outline" className="text-xs">{amenity.availability}</Badge>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-bold text-green-600">${amenity.price}</p>
                    <Button
                      size="sm"
                      onClick={() => onAmenityBooking(amenity)}
                      className="mt-1 text-xs h-7"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (message.type === 'menu-items' && message.data) {
    const { items, categorized } = message.data;
    return (
      <div className="space-y-3">
        <p className="text-sm mb-4">{message.content}</p>
        <div className="grid gap-3">
          {items.map((item: any) => (
            <Card key={item.id} className="border hover:border-orange-300 transition-colors">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-bold text-green-600">${item.price}</p>
                    <Button
                      size="sm"
                      onClick={() => onMenuItemSelection(item)}
                      className="mt-1 text-xs h-7"
                    >
                      Add to Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (message.type === 'amenity-info' && message.data?.amenities) {
    return (
      <div className="space-y-3">
        <p className="text-sm mb-4">{message.content}</p>
        <div className="grid gap-3">
          {message.data.amenities.map((amenity: any) => (
            <Card key={amenity.id} className="border hover:border-teal-300 transition-colors">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{amenity.name}</h4>
                    <p className="text-xs text-gray-600">{amenity.description}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-bold text-green-600">${amenity.price}</p>
                    <Button
                      size="sm"
                      onClick={() => onAmenityBooking(amenity)}
                      className="mt-1 text-xs h-7"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
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
        <p className="text-sm mb-4">{message.content}</p>
        <div className="grid gap-3">
          {message.data.departments.map((department: any) => (
            <Card key={department.department} className="border hover:border-gray-300 transition-colors">
              <CardContent className="p-3">
                <h4 className="font-semibold">{department.department}</h4>
                <p className="text-xs text-gray-600">{department.description}</p>
                <div className="text-xs mt-2">
                  <p>Phone: {department.phone}</p>
                  <p>Email: {department.email}</p>
                  <p>Hours: {department.hours}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (message.type === 'order-options') {
    return (
      <div className="space-y-3">
        <p className="text-sm mb-4">{message.content}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onQuickAction('add_more_items')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs p-2 h-auto"
          >
            Add More Items
          </Button>
          <Button
            onClick={() => onQuickAction('proceed_to_payment')}
            className="bg-green-600 hover:bg-green-700 text-white text-xs p-2 h-auto"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    );
  }

  return <p className="text-sm whitespace-pre-line">{message.content}</p>;
};
