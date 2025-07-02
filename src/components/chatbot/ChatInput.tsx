
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t p-4 space-y-3">
      {/* Enhanced Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAction('book_room')}
          className="text-xs"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Book Room
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAction('explore_dining')}
          className="text-xs"
        >
          <Bot className="w-3 h-3 mr-1" />
          Dining
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAction('explore_amenities')}
          className="text-xs"
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Amenities
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAction('contact_support')}
          className="text-xs"
        >
          <Phone className="w-3 h-3 mr-1" />
          Contact Us
        </Button>
      </div>

      {/* Message Input */}
      <div className="flex space-x-2">
        <Input
          placeholder="Ask me about rooms, dining, amenities, or anything else..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping}
          className="flex-1"
        />
        <Button 
          onClick={onSendMessage} 
          disabled={!input.trim() || isTyping}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Status and Controls */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="text-xs">
            Messages: {messageCount}
          </Badge>
          <span>🏨 24/7 Concierge Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSuggestions}
            className="text-xs h-6 px-2"
          >
            {showSuggestions ? 'Hide' : 'Show'} Suggestions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleInteractiveFeatures}
            className="text-xs h-6 px-2"
          >
            {showInteractiveFeatures ? 'Hide' : 'Show'} Features
          </Button>
        </div>
      </div>
    </div>
  );
};
