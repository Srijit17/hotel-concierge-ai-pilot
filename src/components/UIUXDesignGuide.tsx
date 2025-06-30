
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Smartphone, Palette, Accessibility, Zap, Star } from 'lucide-react';

const UIUXDesignGuide = () => {
  const designPrinciples = [
    {
      icon: Bot,
      title: "Conversational Interface",
      description: "Natural chat experience with personality",
      features: [
        "Sofia - Personal concierge avatar with friendly personality",
        "Typing indicators with realistic timing (1-2 seconds)",
        "Message status indicators (sent, delivered, read)",
        "Conversation bubbles with rounded corners and shadows",
        "Timestamp display for message history"
      ]
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices and responsive across all screens",
      features: [
        "Touch-friendly button sizes (minimum 44px tap targets)",
        "Swipe gestures for navigation and quick actions",
        "Optimized keyboard handling and input focus",
        "Full-screen chat mode on mobile devices",
        "Progressive Web App (PWA) capabilities"
      ]
    },
    {
      icon: Palette,
      title: "Visual Design System",
      description: "Consistent, premium hotel brand experience",
      features: [
        "Luxury hotel color palette (deep blues, gold accents, whites)",
        "Custom typography with hospitality-focused font choices",
        "Micro-animations for smooth interactions",
        "Branded quick reply buttons and UI elements",
        "Professional photography integration for room/amenity cards"
      ]
    },
    {
      icon: Accessibility,
      title: "Accessibility (WCAG 2.1 AA)",
      description: "Inclusive design for all users",
      features: [
        "High contrast ratios (4.5:1 minimum)",
        "Screen reader compatible with proper ARIA labels",
        "Keyboard navigation support throughout",
        "Focus indicators clearly visible",
        "Text alternatives for all images and icons"
      ]
    }
  ];

  const uiComponents = [
    {
      component: "Chat Header",
      description: "Professional header with hotel branding",
      specifications: [
        "Hotel logo and 'Sofia - Digital Concierge' branding",
        "Online status indicator with guest service hours",
        "Settings/menu button for chat preferences",
        "Minimize/maximize controls for web widget"
      ]
    },
    {
      component: "Message Bubbles",
      description: "Visually distinct user and bot messages",
      specifications: [
        "User messages: Blue gradient, right-aligned",
        "Bot messages: Light background, left-aligned with avatar",
        "Rich content cards for bookings, menus, amenities",
        "Message reactions and quick actions (thumbs up/down)"
      ]
    },
    {
      component: "Quick Replies",
      description: "Contextual action buttons for common requests",
      specifications: [
        "Horizontally scrollable button row",
        "Icon + text combinations for clarity",
        "Dynamic suggestions based on conversation context",
        "Maximum 4 visible options to avoid overwhelm"
      ]
    },
    {
      component: "Rich Cards",
      description: "Interactive content for bookings and services",
      specifications: [
        "Room availability cards with images and pricing",
        "Menu items with descriptions and dietary indicators",
        "Amenity information with hours and locations",
        "Booking confirmation with QR codes"
      ]
    },
    {
      component: "Input Area",
      description: "Text input with smart features",
      specifications: [
        "Auto-expanding text area (up to 4 lines)",
        "Send button with paper plane icon",
        "Voice input option for accessibility",
        "Attachment button for sharing images/documents"
      ]
    },
    {
      component: "Status Indicators",
      description: "Clear communication of system state",
      specifications: [
        "Typing indicator with animated dots",
        "Connection status (online/offline)",
        "Message delivery confirmation",
        "Queue position when transferring to human"
      ]
    }
  ];

  const interactionPatterns = [
    {
      pattern: "Progressive Disclosure",
      usage: "Reveal information gradually to avoid overwhelming users",
      example: "Show 3 room options initially, then 'View More' for additional choices"
    },
    {
      pattern: "Contextual Quick Actions",
      usage: "Offer relevant shortcuts based on conversation state",
      example: "After showing room prices, provide 'Book Now' and 'Compare Options' buttons"
    },
    {
      pattern: "Confirmation Flows",
      usage: "Always confirm important actions before execution",
      example: "Show booking summary with 'Confirm Reservation' before processing payment"
    },
    {
      pattern: "Error Recovery",
      usage: "Graceful handling of errors with clear next steps",
      example: "If booking fails, offer alternative dates or room types immediately"
    },
    {
      pattern: "Multi-Modal Input",
      usage: "Support various input methods for user convenience",
      example: "Allow text, voice, quick replies, and button interactions"
    }
  ];

  const brandPersonality = {
    tone: "Warm, Professional, Attentive",
    characteristics: [
      "Sophisticated yet approachable language",
      "Proactive suggestions and personalization",
      "Apologetic and solution-focused when issues arise",
      "Celebratory for special occasions and bookings",
      "Knowledgeable about local area and hotel services"
    ],
    avoidances: [
      "Overly casual or slang language",
      "Robotic or scripted responses",
      "Negative language or can't-do attitudes",
      "Technical jargon or confusing terms",
      "Generic responses without personalization"
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-6 h-6 text-blue-600" />
            <span>UI/UX Design System</span>
          </CardTitle>
          <p className="text-gray-600">
            Complete design guide for premium hospitality chatbot experience
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {designPrinciples.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{principle.title}</h3>
                      <p className="text-sm text-gray-600">{principle.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {principle.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm flex items-start">
                        <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>UI Component Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {uiComponents.map((component, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-lg mb-1">{component.component}</h3>
                <p className="text-gray-600 mb-3">{component.description}</p>
                <div className="grid gap-2">
                  {component.specifications.map((spec, specIndex) => (
                    <div key={specIndex} className="flex items-start">
                      <Badge variant="outline" className="mr-2 text-xs">SPEC</Badge>
                      <span className="text-sm">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-purple-600" />
            <span>Interaction Patterns</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interactionPatterns.map((pattern, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{pattern.pattern}</h4>
                  <Badge variant="secondary">UX Pattern</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{pattern.usage}</p>
                <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                  <span className="text-xs font-medium text-purple-600">EXAMPLE:</span>
                  <p className="text-sm mt-1">{pattern.example}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-gold-600" />
            <span>Brand Personality & Tone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-600">✅ Do Use</h4>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">{brandPersonality.tone}</h5>
                </div>
                {brandPersonality.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span className="text-sm">{characteristic}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-red-600">❌ Avoid</h4>
              <div className="space-y-2">
                {brandPersonality.avoidances.map((avoidance, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span className="text-sm">{avoidance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Frontend Technologies</h4>
              <ul className="space-y-1 text-sm">
                <li>• React 18+ with TypeScript for type safety</li>
                <li>• Tailwind CSS for responsive design system</li>
                <li>• Framer Motion for smooth animations</li>
                <li>• React Hook Form for form validation</li>
                <li>• Shadcn/ui for consistent component library</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Performance Optimization</h4>
              <ul className="space-y-1 text-sm">
                <li>• Lazy loading for images and components</li>
                <li>• Virtual scrolling for long chat histories</li>
                <li>• WebSocket connections for real-time messaging</li>
                <li>• Service Worker for offline capabilities</li>
                <li>• Image optimization and CDN integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UIUXDesignGuide;
