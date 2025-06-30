
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Brain, MessageSquare, Target } from 'lucide-react';

interface Intent {
  name: string;
  description: string;
  trainingPhrases: string[];
  slots: string[];
  expectedBehavior: string;
  confidence: number;
  category: string;
}

const IntentTrainingData = () => {
  const [expandedIntent, setExpandedIntent] = useState<string | null>(null);

  const intents: Intent[] = [
    {
      name: "GreetGuest",
      description: "Friendly welcome and conversation starter",
      trainingPhrases: [
        "Hello", "Hi there", "Good morning", "Good evening", "Hey", "Hi",
        "Good afternoon", "Hello Sofia", "Hi bot", "Greetings", "Good day",
        "How are you", "What's up", "Howdy", "Hi again", "Hello again"
      ],
      slots: ["time_of_day", "guest_name"],
      expectedBehavior: "Warm greeting with personalization, offer assistance menu",
      confidence: 0.95,
      category: "Greeting"
    },
    {
      name: "CheckRoomAvailability",
      description: "Inquire about room availability with dates and preferences",
      trainingPhrases: [
        "What rooms are available?", "Do you have any rooms for tonight?", "Check availability for this weekend",
        "Are there any vacancies?", "I need a room for 2 nights", "Show me available rooms",
        "What's available from June 15th?", "Any rooms free tomorrow?", "I'm looking for accommodation",
        "Room availability check", "Do you have a suite available?", "Looking for ocean view rooms",
        "What rooms do you have for 3 guests?", "Available rooms this month", "Check vacancy",
        "I want to see room options", "What's free next week?", "Room search", "Hotel availability"
      ],
      slots: ["check_in_date", "check_out_date", "guests", "room_type", "preferences"],
      expectedBehavior: "Present available rooms with details, ask for booking confirmation",
      confidence: 0.92,
      category: "Booking"
    },
    {
      name: "BookRoom",
      description: "Make a reservation with guest details",
      trainingPhrases: [
        "I want to book a room", "Make a reservation", "Book the deluxe suite", "Reserve a room for me",
        "I'd like to make a booking", "Can I book that room?", "Proceed with reservation",
        "Confirm the booking", "I'll take the ocean view room", "Yes, book it for me",
        "Let's make a reservation", "I want to reserve", "Book now", "Make booking",
        "I'll book the suite", "Reserve that room", "Confirm reservation", "Book it"
      ],
      slots: ["guest_name", "email", "phone", "room_type", "special_requests"],
      expectedBehavior: "Collect guest information, confirm booking details, send confirmation",
      confidence: 0.94,
      category: "Booking"
    },
    {
      name: "ModifyReservation",
      description: "Change existing booking details",
      trainingPhrases: [
        "Change my booking", "Modify my reservation", "Update my room", "Change the dates",
        "I need to modify my stay", "Update booking details", "Change check-in date",
        "Edit my booking", "Update my stay", "Reschedule my reservation", "Change room type",
        "Modify reservation", "Update my booking", "Change my room preference", "Edit reservation"
      ],
      slots: ["booking_id", "new_dates", "new_room_type", "guest_name"],
      expectedBehavior: "Locate booking, present modification options, confirm changes",
      confidence: 0.89,
      category: "Booking"
    },
    {
      name: "CancelReservation",
      description: "Cancel existing booking with proper handling",
      trainingPhrases: [
        "Cancel my booking", "I want to cancel my reservation", "Cancel my room",
        "I need to cancel", "Remove my booking", "Cancel the reservation",
        "I can't make it, cancel please", "Cancellation request", "Cancel booking",
        "I want to cancel my stay", "Delete my reservation", "Cancel everything",
        "I need to cancel my trip", "Cancel hotel booking", "Remove reservation"
      ],
      slots: ["booking_id", "guest_name", "reason"],
      expectedBehavior: "Verify booking, explain cancellation policy, process cancellation",
      confidence: 0.93,
      category: "Booking"
    },
    {
      name: "RoomServiceOrder",
      description: "Order food and beverages to guest room",
      trainingPhrases: [
        "I want to order room service", "Can I get food delivered?", "Order breakfast to my room",
        "I'd like the menu", "Room service menu please", "Send dinner to room 305",
        "Order food", "I'm hungry, what can I order?", "Bring me some coffee",
        "Food delivery to room", "I want breakfast", "Order lunch", "Can I get dinner?",
        "Room service please", "Food menu", "What's for breakfast?", "Order drinks",
        "I want to eat", "Deliver food", "Restaurant menu"
      ],
      slots: ["room_number", "food_items", "dietary_restrictions", "delivery_time"],
      expectedBehavior: "Show menu, take order, confirm delivery details and timing",
      confidence: 0.90,
      category: "Service"
    },
    {
      name: "AskAboutAmenities",
      description: "Inquire about hotel facilities and services",
      trainingPhrases: [
        "What amenities do you have?", "Do you have a gym?", "Is there a swimming pool?",
        "What facilities are available?", "Tell me about your spa", "Do you have WiFi?",
        "What services do you offer?", "Is there a business center?", "Where is the fitness center?",
        "Hotel facilities", "Do you have parking?", "Is there a restaurant?", "What about breakfast?",
        "Pool hours", "Spa services", "Fitness center", "Business services", "Hotel amenities"
      ],
      slots: ["amenity_type", "hours", "location"],
      expectedBehavior: "Provide detailed amenity information with hours and locations",
      confidence: 0.91,
      category: "Information"
    },
    {
      name: "RequestLateCheckout",
      description: "Request extended checkout time",
      trainingPhrases: [
        "Can I have late checkout?", "Extend my checkout time", "I need to check out later",
        "Late checkout request", "Can I stay until 2pm?", "Extend my stay by a few hours",
        "I need more time to check out", "Is late checkout available?", "Can I check out at 1pm?",
        "Request checkout extension", "Late checkout please", "Can I stay longer?",
        "Extend checkout", "I need extra time", "Late checkout options"
      ],
      slots: ["room_number", "requested_time", "reason"],
      expectedBehavior: "Check availability, explain fees if any, confirm extension",
      confidence: 0.87,
      category: "Service"
    },
    {
      name: "AskHotelPolicy",
      description: "Inquire about hotel rules and policies",
      trainingPhrases: [
        "What's your cancellation policy?", "Pet policy?", "Do you allow smoking?",
        "What are your policies?", "Check-in time?", "Parking policy", "What's the dress code?",
        "Are pets allowed?", "Smoking policy", "Hotel rules", "ID requirements",
        "Age restrictions", "Payment policy", "Early check-in policy", "Baggage policy",
        "Guest policy", "What do I need to bring?", "Hotel guidelines"
      ],
      slots: ["policy_type"],
      expectedBehavior: "Provide clear policy information with helpful context",
      confidence: 0.85,
      category: "Information"
    },
    {
      name: "SubmitComplaint",
      description: "Handle guest complaints with empathy",
      trainingPhrases: [
        "I have a complaint", "My room is dirty", "The AC isn't working", "I'm not satisfied",
        "There's a problem with my room", "The service is poor", "I want to complain",
        "This is unacceptable", "I'm disappointed", "The room is too noisy",
        "My shower isn't working", "The WiFi is down", "Room service was late",
        "I'm unhappy with", "There's an issue", "Problem with my stay", "Not happy"
      ],
      slots: ["issue_type", "room_number", "urgency_level"],
      expectedBehavior: "Show empathy, apologize, offer immediate solution, escalate if needed",
      confidence: 0.88,
      category: "Support"
    },
    {
      name: "AskForDirections",
      description: "Provide directions to hotel facilities",
      trainingPhrases: [
        "Where is the gym?", "How do I get to the pool?", "Where's the restaurant?",
        "Directions to the spa", "Where is the parking?", "How to get to my room?",
        "Where's the lobby?", "Directions to the business center", "Where is the elevator?",
        "How do I find the conference room?", "Where's the nearest bathroom?",
        "Directions please", "How to get there?", "Where is it located?", "Show me the way"
      ],
      slots: ["destination", "current_location"],
      expectedBehavior: "Provide clear directions with landmarks and visual cues",
      confidence: 0.86,
      category: "Information"
    },
    {
      name: "SpeakToHuman",
      description: "Escalate to human support",
      trainingPhrases: [
        "I want to speak to a human", "Connect me to an agent", "Transfer to reception",
        "I need human help", "Get me a real person", "Speak to concierge",
        "Connect to front desk", "I need to talk to someone", "Human agent please",
        "Transfer to staff member", "Let me talk to a person", "I need real help",
        "Connect me to someone", "Human support", "Live agent", "Real person please"
      ],
      slots: ["urgency_level", "reason"],
      expectedBehavior: "Acknowledge request, explain transfer process, connect to human agent",
      confidence: 0.96,
      category: "Support"
    },
    {
      name: "ExpressGratitude",
      description: "Handle thank you messages gracefully",
      trainingPhrases: [
        "Thank you", "Thanks", "I appreciate it", "That's helpful", "Perfect",
        "Great service", "You're amazing", "Thanks so much", "Appreciate your help",
        "Wonderful", "Excellent", "That's perfect", "Amazing", "Fantastic",
        "You've been so helpful", "Great job", "Thanks a lot"
      ],
      slots: [],
      expectedBehavior: "Acknowledge gratitude, offer continued assistance",
      confidence: 0.92,
      category: "Social"
    },
    {
      name: "CheckBookingStatus",
      description: "Verify existing reservation details",
      trainingPhrases: [
        "Check my booking", "What's my reservation status?", "Do I have a booking?",
        "My reservation details", "Booking confirmation", "Check my stay",
        "What room am I in?", "My booking info", "Reservation lookup",
        "Check my reservation", "Booking status", "Am I booked?", "My room details"
      ],
      slots: ["booking_id", "guest_name", "email"],
      expectedBehavior: "Verify identity, retrieve booking details, display information",
      confidence: 0.90,
      category: "Information"
    },
    {
      name: "RequestWakeUpCall",
      description: "Schedule wake-up call service",
      trainingPhrases: [
        "Set a wake up call", "I need a wake up call", "Can you wake me up at 7am?",
        "Schedule wake up call", "Morning call please", "Set alarm call",
        "Wake me up tomorrow", "I need to be woken up", "Can you call my room at 6am?",
        "Set up wake up service", "Morning wake up call", "Schedule a call"
      ],
      slots: ["time", "room_number", "date"],
      expectedBehavior: "Confirm time and room, schedule wake-up call, provide confirmation",
      confidence: 0.88,
      category: "Service"
    }
  ];

  const toggleIntent = (intentName: string) => {
    setExpandedIntent(expandedIntent === intentName ? null : intentName);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Greeting': 'bg-green-100 text-green-800',
      'Booking': 'bg-blue-100 text-blue-800', 
      'Service': 'bg-purple-100 text-purple-800',
      'Information': 'bg-yellow-100 text-yellow-800',
      'Support': 'bg-red-100 text-red-800',
      'Social': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span>Advanced Intent Training System</span>
          </CardTitle>
          <p className="text-gray-600">
            Complete NLU training data with {intents.length} hospitality-specific intents
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{intents.length}</div>
              <div className="text-sm text-gray-600">Total Intents</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {intents.reduce((acc, intent) => acc + intent.trainingPhrases.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Training Phrases</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">94.2%</div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
          </div>

          <div className="space-y-4">
            {intents.map((intent, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleIntent(intent.name)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{intent.name}</h3>
                      <Badge className={getCategoryColor(intent.category)}>
                        {intent.category}
                      </Badge>
                      <Badge variant="outline">
                        {(intent.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{intent.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{intent.trainingPhrases.length} phrases</span>
                      <span>{intent.slots.length} slots</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedIntent === intent.name ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </Button>
                </div>
                
                {expandedIntent === intent.name && (
                  <div className="p-4 border-t bg-white">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Training Phrases ({intent.trainingPhrases.length})
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                          <div className="grid gap-1">
                            {intent.trainingPhrases.map((phrase, phraseIndex) => (
                              <div key={phraseIndex} className="text-sm px-2 py-1 bg-white rounded border">
                                "{phrase}"
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            Required Slots
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {intent.slots.length > 0 ? intent.slots.map((slot, slotIndex) => (
                              <Badge key={slotIndex} variant="secondary" className="text-xs">
                                @{slot}
                              </Badge>
                            )) : (
                              <span className="text-sm text-gray-500">No slots required</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Expected Behavior</h4>
                          <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                            {intent.expectedBehavior}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntentTrainingData;
