import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Users, MapPin, Star, Phone, Clock, Utensils, User, CheckCircle, 
  CreditCard, Car, Dumbbell, Coffee, Wifi, Bot, AlertCircle, MessageSquare, Brain, Heart 
} from 'lucide-react';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type?: 'text' | 'room-cards' | 'booking-summary' | 'menu-items' | 'amenity-info' | 'contact-info' | 'guest-profile' | 'smart-suggestions' | 'greeting-buttons' | 'department-contacts' | 'amenity-booking' | 'payment-options' | 'activity-prompts' | 'ai-response' | 'booking-modification' | 'payment-summary' | 'order-modification' | 'service-options' | 'booking-form' | 'booking-confirmation' | 'post-booking-services' | 'order-options' | 'spa-suggestion' | 'spa-booking-time';
  data?: any;
  intent?: string;
  confidence?: number;
  entities?: any;
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
  if (message.type === 'service-options') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => onQuickAction('book_room')}>
            <Calendar className="w-4 h-4 mr-2" />
            Book Room
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQuickAction('explore_dining')}>
            <Utensils className="w-4 h-4 mr-2" />
            Dining Menu
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQuickAction('explore_amenities')}>
            <MapPin className="w-4 h-4 mr-2" />
            Amenities
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQuickAction('contact_support')}>
            <Phone className="w-4 h-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </div>
    );
  }

  if (message.type === 'booking-form' && message.data?.room) {
    const room = message.data.room;
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <Card className="border border-primary/20">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">Selected Room: {room.name}</h4>
            <div className="space-y-2 text-sm">
              <p>Please provide the following details:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Check-in Date</li>
                <li>Check-out Date</li>
                <li>Number of Guests</li>
                <li>Special Requests (optional)</li>
              </ul>
            </div>
            <div className="mt-3 p-3 bg-muted rounded">
              <p className="text-sm">💡 <strong>Tip:</strong> You can provide these details in your next message, or call our booking department at <strong>+91 90000 11111</strong> for immediate assistance.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (message.type === 'booking-confirmation' && message.data?.booking) {
    const booking = message.data.booking;
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-800">Booking Confirmed!</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Booking Number:</span>
                  <p className="text-muted-foreground">{booking.bookingNumber}</p>
                </div>
                <div>
                  <span className="font-medium">Room:</span>
                  <p className="text-muted-foreground">{booking.room.name}</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="text-xs text-muted-foreground">Total Amount: <span className="font-semibold text-green-600">${booking.total}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (message.type === 'post-booking-services') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => onQuickAction('explore_dining')}>
            <Utensils className="w-4 h-4 mr-2" />
            Dining Menu
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQuickAction('explore_amenities')}>
            <Dumbbell className="w-4 h-4 mr-2" />
            Spa & Wellness
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQuickAction('room_service')}>
            <Coffee className="w-4 h-4 mr-2" />
            Room Service
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQuickAction('contact_support')}>
            <Phone className="w-4 h-4 mr-2" />
            Need Help?
          </Button>
        </div>
      </div>
    );
  }

  if (message.type === 'order-options' && message.data?.selectedItem) {
    const item = message.data.selectedItem;
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <Card className="border border-primary/20">
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium">Selected: {item.name}</h5>
              <span className="text-primary font-semibold">${item.price}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onQuickAction('add_more_items')}>
                Add More
              </Button>
              <Button size="sm" onClick={() => onPaymentClick({ type: 'food', items: [item], total: item.price })}>
                Order Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (message.type === 'greeting-buttons') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => onQuickAction('room_availability')}>
            <Calendar className="w-4 h-4 mr-2" />
            Check Rooms
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQuickAction('room_service')}>
            <Coffee className="w-4 h-4 mr-2" />
            Room Service
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQuickAction('amenities')}>
            <MapPin className="w-4 h-4 mr-2" />
            Amenities
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQuickAction('verify_booking')}>
            <User className="w-4 h-4 mr-2" />
            My Booking
          </Button>
        </div>
      </div>
    );
  }

  if (message.type === 'room-cards' && message.data?.rooms) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <div className="space-y-3">
          {message.data.rooms.map((room: any) => (
            <Card key={room.id} className="border border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onRoomSelection(room)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{room.name}</h4>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">${room.price_per_night}</div>
                    <div className="text-xs text-muted-foreground">per night</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Max {room.max_guests} guests
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {room.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" className="w-full">
                  Select Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (message.type === 'menu-items' && message.data) {
    const { items, categorized } = message.data;
    const categories = [...new Set(items.map((item: any) => item.category))];
    
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        {categorized ? (
          categories.map((category: string) => (
            <div key={category} className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">{category}</h4>
              <div className="grid gap-2">
                {items.filter((item: any) => item.category === category).map((item: any) => (
                  <Card 
                    key={item.id} 
                    className="border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => onMenuItemSelection(item)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-foreground">{item.name}</h5>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="text-primary font-semibold ml-2">
                          ${item.price}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="grid gap-2">
            {items.map((item: any) => (
              <Card 
                key={item.id} 
                className="border border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => onMenuItemSelection(item)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground">{item.name}</h5>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-primary font-semibold ml-2">
                      ${item.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (message.type === 'amenity-info' && message.data?.amenities) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <div className="space-y-3">
          {message.data.amenities.map((amenity: any) => (
            <Card key={amenity.id} className="border border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onAmenityBooking(amenity)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{amenity.name}</h4>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {amenity.price > 0 ? `$${amenity.price}` : 'Free'}
                    </div>
                    <div className="text-xs text-muted-foreground">{amenity.duration}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{amenity.description}</p>
                <div className="text-xs text-muted-foreground mb-3">
                  Available: {amenity.availability}
                </div>
                <Button size="sm" className="w-full">
                  {amenity.price > 0 ? 'Book Now' : 'Learn More'}
                </Button>
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
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <div className="space-y-3">
          {message.data.departments.map((dept: any, index: number) => (
            <Card key={index} className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{dept.department}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {dept.phone}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {dept.hours}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (message.type === 'guest-profile' && message.data?.booking) {
    const booking = message.data.booking;
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Booking Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Guest:</span>
                <p className="text-muted-foreground">{booking.guest_name}</p>
              </div>
              <div>
                <span className="font-medium">Room:</span>
                <p className="text-muted-foreground">{booking.room_type}</p>
              </div>
              <div>
                <span className="font-medium">Check-in:</span>
                <p className="text-muted-foreground">{booking.check_in}</p>
              </div>
              <div>
                <span className="font-medium">Check-out:</span>
                <p className="text-muted-foreground">{booking.check_out}</p>
              </div>
            </div>
            {booking.special_requests && (
              <div>
                <span className="font-medium">Special Requests:</span>
                <p className="text-muted-foreground text-sm">{booking.special_requests}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (message.type === 'payment-summary' && message.data) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <Card className="border border-border">
          <CardContent className="p-4">
            {message.data.type === 'food' && (
              <>
                <h4 className="font-semibold mb-2">Order Summary</h4>
                {message.data.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${message.data.total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
            {message.data.type === 'booking' && (
              <>
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Booking Number:</span>
                    <span>{message.data.booking.booking_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span>{message.data.booking.room_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span>${message.data.total}</span>
                  </div>
                </div>
              </>
            )}
            <Button 
              className="w-full mt-3 bg-green-600 hover:bg-green-700"
              onClick={() => onPaymentClick(message.data)}
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (message.type === 'spa-suggestion') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <Card className="border border-pink-200 bg-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Heart className="w-5 h-5 text-pink-600 mr-2" />
              <h4 className="font-semibold text-pink-800">Spa Treatment Suggestion</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Enhance your room service experience with one of our rejuvenating spa treatments.
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => onQuickAction('show_spa_amenities')}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                View Spa Menu
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onQuickAction('book_spa_treatment')}
              >
                Book Treatment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (message.type === 'spa-booking-time') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
        <Card className="border border-primary/20">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Available Time Slots</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => onQuickAction('book_spa_morning')}>
                <Clock className="w-4 h-4 mr-2" />
                Morning (9-12 PM)
              </Button>
              <Button variant="outline" size="sm" onClick={() => onQuickAction('book_spa_afternoon')}>
                <Clock className="w-4 h-4 mr-2" />
                Afternoon (1-5 PM)
              </Button>
              <Button variant="outline" size="sm" onClick={() => onQuickAction('book_spa_evening')}>
                <Clock className="w-4 h-4 mr-2" />
                Evening (6-9 PM)
              </Button>
              <Button variant="outline" size="sm" onClick={() => onQuickAction('contact_support')}>
                <Phone className="w-4 h-4 mr-2" />
                Custom Time
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default text message
  return (
    <div className="space-y-2">
      <p className="text-sm text-foreground whitespace-pre-line">{message.content}</p>
      {message.intent && message.confidence && (
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Brain className="w-3 h-3" />
          <span>Intent: {message.intent}</span>
          <Badge variant="outline" className="text-xs">
            {(message.confidence * 100).toFixed(0)}%
          </Badge>
        </div>
      )}
    </div>
  );
};
