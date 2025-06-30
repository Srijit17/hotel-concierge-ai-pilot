
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const IntentManager = () => {
  const intents = [
    {
      name: "CheckRoomAvailability",
      confidence: 0.95,
      trainingPhrases: [
        "What rooms are available?",
        "Do you have any rooms for tonight?",
        "Check availability for this weekend",
        "Are there any vacancies?",
        "I need a room for 2 nights",
        "Show me available rooms",
        "What's available from June 15th?",
        "Any rooms free tomorrow?",
        "I'm looking for accommodation",
        "Room availability check"
      ],
      entities: ["date", "duration", "room_type", "guests"],
      response: "I'll check our availability for you. What dates are you looking for and how many guests?"
    },
    {
      name: "BookRoom",
      confidence: 0.92,
      trainingPhrases: [
        "I want to book a room",
        "Make a reservation",
        "Book the deluxe suite",
        "Reserve a room for me",
        "I'd like to make a booking",
        "Can I book that room?",
        "Proceed with reservation",
        "Confirm the booking",
        "I'll take the ocean view room",
        "Yes, book it for me"
      ],
      entities: ["room_type", "check_in", "check_out", "guests"],
      response: "Perfect! I'll help you complete your booking. Let me gather the details..."
    },
    {
      name: "RequestRoomService",
      confidence: 0.89,
      trainingPhrases: [
        "I want to order room service",
        "Can I get food delivered?",
        "Order breakfast to my room",
        "I'd like the menu",
        "Room service menu please",
        "Send dinner to room 305",
        "Order food",
        "I'm hungry, what can I order?",
        "Bring me some coffee",
        "Food delivery to room"
      ],
      entities: ["food_item", "room_number", "time"],
      response: "I'd be happy to help with room service! Here's our menu selection..."
    },
    {
      name: "AskAboutAmenities",
      confidence: 0.91,
      trainingPhrases: [
        "What amenities do you have?",
        "Do you have a gym?",
        "Is there a swimming pool?",
        "What facilities are available?",
        "Tell me about your spa",
        "Do you have WiFi?",
        "What services do you offer?",
        "Is there a business center?",
        "Where is the fitness center?",
        "Hotel facilities"
      ],
      entities: ["amenity_type", "location"],
      response: "Here are our premium amenities and facilities..."
    },
    {
      name: "RequestLateCheckout",
      confidence: 0.87,
      trainingPhrases: [
        "Can I have late checkout?",
        "Extend my checkout time",
        "I need to check out later",
        "Late checkout request",
        "Can I stay until 2pm?",
        "Extend my stay by a few hours",
        "I need more time to check out",
        "Is late checkout available?",
        "Can I check out at 1pm?",
        "Request checkout extension"
      ],
      entities: ["time", "room_number"],
      response: "I can help arrange late checkout for you. What time would you prefer?"
    },
    {
      name: "CancelReservation",
      confidence: 0.93,
      trainingPhrases: [
        "Cancel my booking",
        "I want to cancel my reservation",
        "Cancel my room",
        "I need to cancel",
        "Remove my booking",
        "Cancel the reservation",
        "I can't make it, cancel please",
        "Cancellation request",
        "Cancel booking confirmation",
        "I want to cancel my stay"
      ],
      entities: ["booking_id", "confirmation_number"],
      response: "I understand you need to cancel. Let me help you with that..."
    },
    {
      name: "ChangeReservation",
      confidence: 0.88,
      trainingPhrases: [
        "Change my booking",
        "Modify my reservation",
        "Update my room",
        "Change the dates",
        "I need to modify my stay",
        "Update booking details",
        "Change check-in date",
        "Modify my reservation",
        "Edit my booking",
        "Update my stay"
      ],
      entities: ["booking_id", "new_date", "room_type"],
      response: "I can help you modify your reservation. What changes would you like to make?"
    },
    {
      name: "HotelPolicyInquiry",
      confidence: 0.85,
      trainingPhrases: [
        "What's your cancellation policy?",
        "Pet policy?",
        "Do you allow smoking?",
        "What are your policies?",
        "Check-in time?",
        "Parking policy",
        "What's the dress code?",
        "Are pets allowed?",
        "Smoking policy",
        "Hotel rules and policies"
      ],
      entities: ["policy_type"],
      response: "Here's information about our hotel policies..."
    },
    {
      name: "SpeakToHuman",
      confidence: 0.96,
      trainingPhrases: [
        "I want to speak to a human",
        "Connect me to an agent",
        "Transfer to reception",
        "I need human help",
        "Get me a real person",
        "Speak to concierge",
        "Connect to front desk",
        "I need to talk to someone",
        "Human agent please",
        "Transfer to staff member"
      ],
      entities: ["urgency_level"],
      response: "I'll connect you with our guest services team right away."
    },
    {
      name: "GeneralGreetings",
      confidence: 0.94,
      trainingPhrases: [
        "Hello",
        "Hi there",
        "Good morning",
        "Good evening",
        "Hey",
        "Good afternoon",
        "Hi Sofia",
        "Hello bot",
        "Greetings",
        "Good day"
      ],
      entities: [],
      response: "Hello! Welcome to The Grand Luxury Hotel. I'm Sofia, your personal concierge assistant. How may I help you today?"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intent Detection System</CardTitle>
          <p className="text-gray-600">Enhanced NLU with 10+ intents and comprehensive training data</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {intents.map((intent, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-blue-600">{intent.name}</h4>
                    <p className="text-sm text-gray-600">{intent.response}</p>
                  </div>
                  <Badge variant={intent.confidence > 0.9 ? "default" : "secondary"}>
                    {(intent.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <h5 className="text-sm font-medium mb-2">Training Phrases ({intent.trainingPhrases.length}):</h5>
                  <div className="flex flex-wrap gap-1">
                    {intent.trainingPhrases.slice(0, 5).map((phrase, phraseIndex) => (
                      <Badge key={phraseIndex} variant="outline" className="text-xs">
                        "{phrase}"
                      </Badge>
                    ))}
                    {intent.trainingPhrases.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{intent.trainingPhrases.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Entities:</h5>
                  <div className="flex flex-wrap gap-1">
                    {intent.entities.map((entity, entityIndex) => (
                      <Badge key={entityIndex} variant="secondary" className="text-xs">
                        @{entity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntentManager;
