
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, User, Bot } from 'lucide-react';

const ConversationFlows = () => {
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);

  const conversationFlows = [
    {
      id: "booking",
      title: "Room Booking Inquiry",
      description: "Guest inquires about room availability and makes reservations",
      complexity: "Medium",
      steps: [
        { speaker: "user", message: "What rooms are available tomorrow?" },
        { speaker: "bot", message: "I'd be happy to help you check room availability! For tomorrow, what type of room are you looking for?" },
        { speaker: "user", message: "A deluxe king room for 2 guests" },
        { speaker: "bot", message: "Perfect! I found 3 deluxe king rooms available for tomorrow:\n• Deluxe King - City View ($299/night)\n• Deluxe King - Ocean View ($349/night)\n• Deluxe King - Suite ($449/night)\nWhich would you prefer?" },
        { speaker: "user", message: "The ocean view room sounds great" },
        { speaker: "bot", message: "Excellent choice! I'll need a few details to complete your reservation. May I have your name and email address?" }
      ],
      intents: ["check_availability", "room_preference", "booking_confirmation"],
      entities: ["date", "room_type", "guest_count", "guest_info"]
    },
    {
      id: "room_service",
      title: "Room Service Order",
      description: "Guest places food orders for room delivery",
      complexity: "Low",
      steps: [
        { speaker: "user", message: "I'd like to order breakfast" },
        { speaker: "bot", message: "Great! Here's our breakfast menu:\n• Continental Breakfast ($28)\n• Full English Breakfast ($35)\n• Fresh Fruit Bowl ($18)\n• Avocado Toast ($22)\nWhat would you like to order?" },
        { speaker: "user", message: "Full English Breakfast and coffee" },
        { speaker: "bot", message: "Perfect! Full English Breakfast ($35) and coffee ($8). Your room number is 412, correct? Delivery time is approximately 25-30 minutes." }
      ],
      intents: ["order_food", "menu_inquiry", "order_confirmation"],
      entities: ["food_item", "room_number", "delivery_time"]
    },
    {
      id: "amenities",
      title: "Amenities Information",
      description: "Guest asks about hotel facilities and services",
      complexity: "Low",
      steps: [
        { speaker: "user", message: "Do you have a gym?" },
        { speaker: "bot", message: "Yes! Our fitness center is open 24/7 and located on the ground floor. It features:\n• Cardio equipment\n• Free weights\n• Yoga studio\n• Towel service\nWould you like directions or information about our personal training services?" },
        { speaker: "user", message: "What are the pool hours?" },
        { speaker: "bot", message: "Our rooftop pool is open daily from 6 AM to 11 PM. It includes a heated pool, hot tub, and poolside bar service until 9 PM." }
      ],
      intents: ["amenity_inquiry", "facility_hours", "directions"],
      entities: ["amenity_type", "location", "hours"]
    },
    {
      id: "fallback",
      title: "Fallback & Escalation",
      description: "Handling unclear requests and human handoff",
      complexity: "High",
      steps: [
        { speaker: "user", message: "My shower isn't working properly" },
        { speaker: "bot", message: "I'm sorry to hear about the issue with your shower. For maintenance requests, I'll connect you with our front desk team who can dispatch someone immediately. Would you like me to call your room, or would you prefer to speak with someone at extension 0?" },
        { speaker: "user", message: "Please have someone call my room" },
        { speaker: "bot", message: "I've notified our maintenance team about the shower issue in room 412. Someone will call you within 5 minutes to schedule an immediate repair. Is there anything else I can help you with?" }
      ],
      intents: ["maintenance_request", "escalation", "human_handoff"],
      entities: ["issue_type", "room_number", "urgency"]
    }
  ];

  const toggleFlow = (flowId: string) => {
    setExpandedFlow(expandedFlow === flowId ? null : flowId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Features & Conversation Flows</CardTitle>
          <p className="text-gray-600">Interactive examples of key chatbot conversations</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversationFlows.map((flow) => (
              <div key={flow.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleFlow(flow.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{flow.title}</h3>
                      <Badge variant={flow.complexity === 'High' ? 'destructive' : 
                                   flow.complexity === 'Medium' ? 'secondary' : 'default'}>
                        {flow.complexity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{flow.description}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedFlow === flow.id ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </Button>
                </div>
                
                {expandedFlow === flow.id && (
                  <div className="p-4 border-t">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <h4 className="font-medium mb-3">Conversation Example</h4>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                          {flow.steps.map((step, index) => (
                            <div
                              key={index}
                              className={`flex ${step.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex items-start space-x-2 max-w-[80%] ${
                                step.speaker === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                              }`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  step.speaker === 'user' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-600 text-white'
                                }`}>
                                  {step.speaker === 'user' ? (
                                    <User className="w-3 h-3" />
                                  ) : (
                                    <Bot className="w-3 h-3" />
                                  )}
                                </div>
                                <div className={`p-2 rounded-lg text-sm ${
                                  step.speaker === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border'
                                }`}>
                                  {step.message.split('\n').map((line, lineIndex) => (
                                    <div key={lineIndex}>{line}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Intents Recognized</h4>
                            <div className="flex flex-wrap gap-1">
                              {flow.intents.map((intent, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {intent}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Entities Extracted</h4>
                            <div className="flex flex-wrap gap-1">
                              {flow.entities.map((entity, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {entity}
                                </Badge>
                              ))}
                            </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Context Management</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Persist guest preferences across sessions</li>
                <li>• Remember booking details throughout conversation</li>
                <li>• Track conversation state and history</li>
                <li>• Smart follow-up suggestions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Multilingual Support</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Real-time translation layer integration</li>
                <li>• Language detection from user input</li>
                <li>• Separate NLU models per language</li>
                <li>• Cultural adaptation of responses</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationFlows;
