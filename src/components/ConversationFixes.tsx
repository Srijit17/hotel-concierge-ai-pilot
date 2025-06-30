
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const ConversationFixes = () => {
  const conversationFixes = [
    {
      scenario: "Room Inquiry with Specificity",
      before: {
        user: "Can I get a room with a view?",
        bot: "How can I help you today?",
        issue: "Generic fallback instead of understanding room request"
      },
      after: {
        user: "Can I get a room with a view?",
        bot: "I'd be happy to help you find a room with a view! We have Sea View and Garden View rooms available. What dates are you looking for?",
        improvement: "Proper intent detection with contextual follow-up"
      }
    },
    {
      scenario: "Room Service Context Building",
      before: {
        user: "I want breakfast",
        bot: "I can help you with room service! Here's our menu selection:",
        issue: "No context retention for room number or delivery details"
      },
      after: {
        user: "I want breakfast",
        bot: "I'd be happy to help with breakfast! Our breakfast menu includes Continental ($28) and Full English ($35). What's your room number for delivery?",
        improvement: "Context-aware response that gathers necessary information"
      }
    },
    {
      scenario: "Repeated Fallback Prevention",
      before: {
        user: "help me please",
        bot: "I didn't understand that. Can you rephrase?",
        issue: "Generic fallback without helpful guidance"
      },
      after: {
        user: "help me please",
        bot: "I'm here to assist! I can help with:\n• Room bookings and availability\n• Room service orders\n• Hotel amenities information\n• Speaking with a human agent\n\nWhat would you like to know about?",
        improvement: "Structured help with clear options to guide conversation"
      }
    },
    {
      scenario: "Follow-up Context Maintenance",
      before: {
        user: "What about the price?",
        bot: "I'm sorry, I don't understand. What would you like to know?",
        issue: "Lost conversation context from previous booking inquiry"
      },
      after: {
        user: "What about the price?",
        bot: "For the Sea View room you asked about, it's $349/night. The Garden View is $299/night. Both include breakfast. Would you like to proceed with a booking?",
        improvement: "Maintains conversation context and provides relevant pricing"
      }
    }
  ];

  const fallbackStrategy = {
    levels: [
      {
        trigger: "Confidence < 0.7 (First attempt)",
        action: "Ask clarifying question with suggestions",
        example: "I'm not sure I understood. Are you looking to check room availability, order room service, or get information about amenities?"
      },
      {
        trigger: "Confidence < 0.7 (Second attempt)",
        action: "Provide structured help menu",
        example: "Let me help you with common requests:\n• Press 1 for Room Bookings\n• Press 2 for Room Service\n• Press 3 for Amenities\n• Press 4 to speak with a human"
      },
      {
        trigger: "Third fallback in session",
        action: "Escalate to human agent",
        example: "I want to make sure you get the best help. Let me connect you with our guest services team who can assist you directly."
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversation Flow Improvements</CardTitle>
          <p className="text-gray-600">Before and after examples showing enhanced intent handling</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {conversationFixes.map((fix, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0">
                <h4 className="font-semibold text-lg mb-4 text-blue-600">{fix.scenario}</h4>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <h5 className="font-medium text-red-700">Before (Problematic)</h5>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                        <p className="text-sm"><strong>User:</strong> {fix.before.user}</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded border-l-4 border-gray-400">
                        <p className="text-sm"><strong>Bot:</strong> {fix.before.bot}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-red-100 rounded">
                      <p className="text-xs text-red-700"><strong>Issue:</strong> {fix.before.issue}</p>
                    </div>
                  </div>

                  {/* After */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <h5 className="font-medium text-green-700">After (Improved)</h5>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                        <p className="text-sm"><strong>User:</strong> {fix.after.user}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <p className="text-sm"><strong>Bot:</strong> {fix.after.bot}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-green-100 rounded">
                      <p className="text-xs text-green-700"><strong>Improvement:</strong> {fix.after.improvement}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Smart Fallback Strategy</CardTitle>
          <p className="text-gray-600">Multi-level fallback system to prevent conversation loops</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fallbackStrategy.levels.map((level, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="mr-2">
                      {level.trigger}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium text-sm">{level.action}</span>
                  </div>
                  <div className="bg-white p-3 rounded border text-sm">
                    <strong>Example:</strong> "{level.example}"
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h5 className="font-medium text-yellow-800 mb-2">Fallback Prevention Features:</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Session memory tracks previous intents and context</li>
              <li>• Fallback counter prevents infinite loops (max 2 retries)</li>
              <li>• Context-aware suggestions based on conversation history</li>
              <li>• Automatic escalation to human after 3 fallbacks</li>
              <li>• Analytics logging for fallback pattern analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationFixes;
