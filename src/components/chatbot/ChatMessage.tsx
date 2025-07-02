
import React from 'react';
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
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] ${
        message.sender === 'user' 
          ? 'bg-primary text-primary-foreground rounded-lg p-3' 
          : 'bg-muted rounded-lg p-3'
      }`}>
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
      </div>
    </div>
  );
};
