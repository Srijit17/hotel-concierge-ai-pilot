
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UIMockups = () => {
  const designPrinciples = [
    {
      principle: "Brand Consistency",
      description: "Hotel logo, colors, and typography aligned with brand guidelines",
      implementation: "CSS custom properties for theme colors, branded chat header"
    },
    {
      principle: "Accessibility",
      description: "WCAG 2.1 AA compliance with keyboard navigation and screen reader support",
      implementation: "ARIA labels, focus management, high contrast mode"
    },
    {
      principle: "Mobile-First",
      description: "Responsive design optimized for mobile guests",
      implementation: "Touch-friendly buttons, swipe gestures, adaptive layout"
    },
    {
      principle: "Micro-Interactions",
      description: "Subtle animations to enhance user experience",
      implementation: "Fade-in messages, typing indicators, button hover effects"
    }
  ];

  const uiComponents = [
    {
      component: "Chat Header",
      description: "Hotel branding with assistant name and status",
      features: ["Hotel logo", "Assistant avatar", "Online status indicator", "Minimize/expand controls"]
    },
    {
      component: "Message Bubbles",
      description: "Distinct styling for user and bot messages",
      features: ["Rounded corners", "Color differentiation", "Timestamp display", "Message status icons"]
    },
    {
      component: "Quick Replies",
      description: "Predefined response buttons for common actions",
      features: ["Horizontal scroll", "Icon + text", "Tap to select", "Dynamic suggestions"]
    },
    {
      component: "Rich Content",
      description: "Structured responses with interactive elements",
      features: ["Room cards", "Menu items", "Booking forms", "Image galleries"]
    },
    {
      component: "Input Area",
      description: "Text input with additional interaction options",
      features: ["Auto-resize text area", "Send button", "Voice input", "File upload"]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>UI Design Principles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {designPrinciples.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">{item.principle}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="bg-blue-50 p-3 rounded text-xs">
                  <strong>Implementation:</strong> {item.implementation}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Component Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uiComponents.map((component, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{component.component}</h4>
                    <p className="text-sm text-gray-600">{component.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {component.features.map((feature, featureIndex) => (
                    <Badge key={featureIndex} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual Design Mockup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-slate-100 to-blue-50 p-6 rounded-lg">
            <div className="max-w-sm mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">H</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Sofia - Concierge</h3>
                    <p className="text-xs opacity-90">The Grand Luxury Hotel</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="p-4 space-y-3 h-64 overflow-y-auto bg-gray-50">
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                    <p className="text-sm">Welcome! How may I assist you today?</p>
                    <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                    <p className="text-sm">What rooms are available tonight?</p>
                    <p className="text-xs opacity-80 mt-1">10:31 AM</p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                    <p className="text-sm">I found 3 rooms available:</p>
                    <div className="mt-2 space-y-1">
                      <div className="text-xs bg-blue-50 p-2 rounded">
                        🛏️ Deluxe King - $299/night
                      </div>
                      <div className="text-xs bg-blue-50 p-2 rounded">
                        🌊 Ocean View - $349/night
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">10:31 AM</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Replies */}
              <div className="p-3 bg-white border-t">
                <div className="flex space-x-2 mb-3 overflow-x-auto">
                  <Badge variant="outline" className="text-xs whitespace-nowrap">📅 Check Availability</Badge>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">🍽️ Room Service</Badge>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">🏊 Amenities</Badge>
                </div>
                
                {/* Input */}
                <div className="flex space-x-2">
                  <div className="flex-1 border rounded-full px-3 py-2 text-sm bg-gray-50">
                    Type your message...
                  </div>
                  <button className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-xs">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-blue-600">📱</span>
              </div>
              <p className="font-medium">Mobile Optimized</p>
              <p className="text-gray-600">Touch-friendly interface</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-green-600">⚡</span>
              </div>
              <p className="font-medium">Fast Loading</p>
              <p className="text-gray-600">Less than 2s initial load time</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-purple-600">♿</span>
              </div>
              <p className="font-medium">Accessible</p>
              <p className="text-gray-600">WCAG 2.1 AA compliant</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UIMockups;
