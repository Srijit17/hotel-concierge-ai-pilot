
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Activity } from 'lucide-react';

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
    if (e.key === 'Enter' && !isTyping) {
      onSendMessage();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={handleKeyPress}
          className="flex-1"
          disabled={isTyping}
        />
        <Button 
          onClick={onSendMessage} 
          size="icon"
          disabled={isTyping || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQuickAction('show_faq')}
          className="text-xs"
        >
          FAQ
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleSuggestions}
          className="text-xs"
        >
          {showSuggestions ? 'Hide' : 'Show'} Suggestions
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleInteractiveFeatures}
          className="text-xs"
        >
          <Activity className="w-3 h-3 mr-1" />
          Interactive
        </Button>
        <Badge variant="secondary" className="text-xs">
          {messageCount} messages
        </Badge>
      </div>
    </div>
  );
};
