
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Lightbulb, Settings, HelpCircle } from 'lucide-react';

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
  showFAQPrompts?: boolean;
  onToggleFAQPrompts?: () => void;
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
  messageCount,
  showFAQPrompts = false,
  onToggleFAQPrompts
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t p-4 space-y-3">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQuickAction('book_room')}
          className="text-xs"
        >
          📅 Book Room
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQuickAction('explore_dining')}
          className="text-xs"
        >
          🍽️ Dining
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQuickAction('explore_amenities')}
          className="text-xs"
        >
          🏊‍♂️ Amenities
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQuickAction('show_spa_amenities')}
          className="text-xs"
        >
          💆‍♀️ Spa
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQuickAction('contact_support')}
          className="text-xs"
        >
          📞 Support
        </Button>
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about the hotel, bookings, dining, or services..."
          className="flex-1 min-h-[40px] max-h-[120px] resize-none"
          disabled={isTyping}
        />
        <Button
          onClick={onSendMessage}
          disabled={!input.trim() || isTyping}
          size="icon"
          className="min-w-[40px] h-[40px]"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Feature Toggles */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex gap-3">
          <button
            onClick={onToggleSuggestions}
            className={`flex items-center gap-1 hover:text-gray-700 ${showSuggestions ? 'text-blue-600' : ''}`}
          >
            <Lightbulb className="w-3 h-3" />
            Smart Suggestions
          </button>
          
          <button
            onClick={onToggleInteractiveFeatures}
            className={`flex items-center gap-1 hover:text-gray-700 ${showInteractiveFeatures ? 'text-blue-600' : ''}`}
          >
            <Settings className="w-3 h-3" />
            Interactive
          </button>

          {onToggleFAQPrompts && (
            <button
              onClick={onToggleFAQPrompts}
              className={`flex items-center gap-1 hover:text-gray-700 ${showFAQPrompts ? 'text-blue-600' : ''}`}
            >
              <HelpCircle className="w-3 h-3" />
              FAQ Help
            </button>
          )}
        </div>
        
        <span>Messages: {messageCount}</span>
      </div>
    </div>
  );
};
