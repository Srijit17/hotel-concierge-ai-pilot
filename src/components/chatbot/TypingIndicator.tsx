
import React from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping }) => {
  if (!isTyping) return null;

  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-lg p-3 max-w-[85%]">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <span className="text-xs text-muted-foreground ml-2">Sofia is thinking...</span>
        </div>
      </div>
    </div>
  );
};
