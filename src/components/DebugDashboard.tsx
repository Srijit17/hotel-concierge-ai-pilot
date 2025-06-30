
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DebugDashboard = () => {
  const [selectedMessage, setSelectedMessage] = useState(0);

  const conversationDebugData = [
    {
      id: 1,
      userMessage: "Can I get a room with a view?",
      detectedIntent: "CheckRoomAvailability",
      confidence: 0.87,
      entities: { room_type: "view" },
      botResponse: "I'd be happy to help you find a room with a view! We have Sea View and Garden View rooms available. What dates are you looking for?",
      status: "success",
      context: { session_id: "sess_123", turn: 1 }
    },
    {
      id: 2,
      userMessage: "Next weekend",
      detectedIntent: "CheckRoomAvailability",
      confidence: 0.73,
      entities: { date: "next weekend" },
      botResponse: "Perfect! For next weekend (June 29-30), I found these rooms with views available:",
      status: "success",
      context: { session_id: "sess_123", turn: 2, previous_intent: "CheckRoomAvailability" }
    },
    {
      id: 3,
      userMessage: "asdfgh",
      detectedIntent: "fallback",
      confidence: 0.12,
      entities: {},
      botResponse: "I didn't quite understand that. Are you looking to check room availability, order room service, or need information about our amenities?",
      status: "fallback_triggered",
      context: { session_id: "sess_456", turn: 1, fallback_count: 1 }
    },
    {
      id: 4,
      userMessage: "I want food",
      detectedIntent: "RequestRoomService",
      confidence: 0.91,
      entities: {},
      botResponse: "I'd be happy to help with room service! Here's our menu selection:",
      status: "success",
      context: { session_id: "sess_789", turn: 1 }
    },
    {
      id: 5,
      userMessage: "help me",
      detectedIntent: "GeneralGreetings",
      confidence: 0.45,
      entities: {},
      botResponse: "I understand you need assistance. I can help with:\n• Room bookings and availability\n• Room service orders\n• Hotel amenities information\n• General inquiries\n\nWhat would you like to know about?",
      status: "low_confidence_handled",
      context: { session_id: "sess_101", turn: 1, fallback_count: 0 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'fallback_triggered': return 'bg-red-100 text-red-800';
      case 'low_confidence_handled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intent Detection Debugging Dashboard</CardTitle>
          <p className="text-gray-600">Real-time monitoring of conversation flows and intent recognition</p>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Conversation List */}
            <div>
              <h4 className="font-semibold mb-4">Recent Conversations</h4>
              <div className="space-y-3">
                {conversationDebugData.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMessage === index ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedMessage(index)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm truncate">{msg.userMessage}</p>
                      <Badge className={`text-xs ${getStatusColor(msg.status)}`}>
                        {msg.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Intent: {msg.detectedIntent}</span>
                      <span className={`text-xs font-medium ${getConfidenceColor(msg.confidence)}`}>
                        {(msg.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed View */}
            <div>
              <h4 className="font-semibold mb-4">Debug Details</h4>
              {conversationDebugData[selectedMessage] && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">User Input</h5>
                    <p className="text-sm">{conversationDebugData[selectedMessage].userMessage}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">Bot Response</h5>
                    <p className="text-sm whitespace-pre-line">{conversationDebugData[selectedMessage].botResponse}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <h6 className="text-xs font-medium text-gray-600 mb-1">DETECTED INTENT</h6>
                      <p className="text-sm font-medium">{conversationDebugData[selectedMessage].detectedIntent}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <h6 className="text-xs font-medium text-gray-600 mb-1">CONFIDENCE SCORE</h6>
                      <p className={`text-sm font-medium ${getConfidenceColor(conversationDebugData[selectedMessage].confidence)}`}>
                        {(conversationDebugData[selectedMessage].confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded">
                    <h6 className="text-xs font-medium text-purple-600 mb-2">EXTRACTED ENTITIES</h6>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(conversationDebugData[selectedMessage].entities).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {value as string}
                        </Badge>
                      ))}
                      {Object.keys(conversationDebugData[selectedMessage].entities).length === 0 && (
                        <span className="text-xs text-gray-500">No entities detected</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded">
                    <h6 className="text-xs font-medium text-yellow-600 mb-2">SESSION CONTEXT</h6>
                    <div className="text-xs space-y-1">
                      {Object.entries(conversationDebugData[selectedMessage].context).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{key.replace('_', ' ')}:</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fallback Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <p className="text-sm text-gray-600">Intent Recognition Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">8%</div>
              <p className="text-sm text-gray-600">Low Confidence Handled</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">5%</div>
              <p className="text-sm text-gray-600">Fallback Triggered</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1.2</div>
              <p className="text-sm text-gray-600">Avg Fallback per Session</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugDashboard;
