
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Bot, MessageSquare, Phone } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isTyping: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onQuickAction: (action: string) => void;
  showSuggestions: boolean;
  onToggleSuggestions: () => void;
  showInteractiveFeatures: boolean;
  onToggleInteractiveFeatures: () => void;
  messageCount: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isTyping,
  onInputChange,
  onSendMessage,
  onQuickAction,
  showSuggestions,
  onToggleSuggestions,
  showInteractiveFeatures,
  onToggleInteractiveFeatures,
  messageCount
}) => {
  const quickActions = [
    { id: 'book_room', label: '🏨 Book Room', color: 'bg-blue-600' },
    { id: 'room_service', label: '🍽️ Room Service', color: 'bg-orange-600' },
    { id: 'amenities', label: '💆‍♀️ Amenities', color: 'bg-purple-600' },
    { id: 'verify_booking', label: '🎫 My Booking', color: 'bg-green-600' },
    { id: 'contact_support', label: '📞 Contact Support', color: 'bg-red-600' },
    { id: 'city_info', label: '🏔️ City Info', color: 'bg-teal-600' },
    { id: 'hotel_heritage', label: '🏛️ Hotel Heritage', color: 'bg-amber-600' }
  ];

  const serviceQueries = [
    { id: 'geyser_issue', label: '🚿 Geyser Not Working', query: 'geyser not working' },
    { id: 'need_towels', label: '🏨 Need Towels', query: 'need extra towels' },
    { id: 'no_soap', label: '🧼 No Soap', query: 'no soap in bathroom' },
    { id: 'need_water', label: '💧 Need Water', query: 'need water bottles' },
    { id: 'wifi_issue', label: '📶 WiFi Problem', query: 'wifi not working' },
    { id: 'ac_problem', label: '❄️ AC Issue', query: 'air conditioning problem' }
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleQuickActionClick = (actionId: string) => {
    if (actionId === 'city_info') {
      onInputChange('Tell me about Kashmir and Kolkata');
      setTimeout(() => onSendMessage(), 100);
    } else if (actionId === 'hotel_heritage') {
      onInputChange('Tell me about the hotel heritage and history');
      setTimeout(() => onSendMessage(), 100);
    } else {
      onQuickAction(actionId);
    }
  };

  const handleServiceQuery = (query: string) => {
    onInputChange(query);
    setTimeout(() => onSendMessage(), 100);
  };

  return (
    <div className="border-t p-4 bg-white">
      {/* Quick Actions */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleQuickActionClick(action.id)}
              className={`${action.color} hover:opacity-90 text-white text-xs px-3 py-1 h-8`}
              disabled={isTyping}
            >
              {action.label}
            </Button>
          ))}
        </div>
        
        {/* Service Queries */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-2">Common Service Requests:</p>
          <div className="flex flex-wrap gap-2">
            {serviceQueries.map((service) => (
              <Button
                key={service.id}
                onClick={() => handleServiceQuery(service.query)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 h-7"
                disabled={isTyping}
                variant="outline"
              >
                {service.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isTyping ? "AI is typing..." : "Ask me anything about the hotel, city, or services..."}
            disabled={isTyping}
            className="min-h-[40px] max-h-[120px] resize-none"
          />
        </div>
        <Button
          onClick={onSendMessage}
          disabled={isTyping || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-[40px]"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings */}
      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSuggestions}
            className="text-xs h-6"
          >
            {showSuggestions ? 'Hide' : 'Show'} Suggestions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleInteractiveFeatures}
            className="text-xs h-6"
          >
            {showInteractiveFeatures ? 'Hide' : 'Show'} Features
          </Button>
        </div>
        <span>Messages: {messageCount}</span>
      </div>
    </div>
  );
};
