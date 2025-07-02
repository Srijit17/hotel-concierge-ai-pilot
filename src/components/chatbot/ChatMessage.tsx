
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MessageRenderer, type Message } from './MessageRenderer';

interface ChatMessageProps {
  message: Message;
  onRoomSelection: (room: any) => void;
  onMenuItemSelection: (item: any) => void;
  onAmenityBooking: (amenity: any) => void;
  onQuickAction: (action: string) => void;
  onPaymentClick: (data: any) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRoomSelection,
  onMenuItemSelection,
  onAmenityBooking,
  onQuickAction,
  onPaymentClick
}) => {
  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-lg p-3 ${
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {message.sender === 'user' ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <MessageRenderer
            message={message}
            onRoomSelection={onRoomSelection}
            onMenuItemSelection={onMenuItemSelection}
            onAmenityBooking={onAmenityBooking}
            onQuickAction={onQuickAction}
            onPaymentClick={onPaymentClick}
          />
        )}
        <div className={`text-xs mt-1 flex items-center justify-between ${
          message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
        }`}>
          <span>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.sender === 'bot' && message.confidence && (
            <Badge variant="secondary" className="text-xs ml-2">
              {Math.round(message.confidence * 100)}%
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
