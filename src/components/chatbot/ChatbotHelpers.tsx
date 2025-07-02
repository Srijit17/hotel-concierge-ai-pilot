
import { type Message } from './MessageRenderer';

export const scrollToBottom = (messagesEndRef: React.RefObject<HTMLDivElement>) => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
};

export const addBotMessage = (
  content: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  type?: string,
  data?: any,
  confidence?: number
) => {
  try {
    if (!content || typeof content !== 'string') {
      console.error('Invalid message content');
      return;
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'bot',
      content: content.trim(),
      timestamp: new Date(),
      type: type as any,
      data,
      confidence: confidence || 0.9
    };

    setMessages(prev => {
      // Prevent duplicate messages
      const isDuplicate = prev.some(msg => 
        msg.content === newMessage.content && 
        msg.sender === newMessage.sender &&
        Date.now() - msg.timestamp.getTime() < 1000
      );

      if (isDuplicate) {
        console.warn('Duplicate message prevented');
        return prev;
      }

      return [...prev, newMessage];
    });
  } catch (error) {
    console.error('Error adding bot message:', error);
  }
};

export const addDepartmentContacts = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  try {
    addBotMessage(
      "Need direct assistance? Here are our department contacts available 24/7:",
      setMessages,
      'department-contacts',
      {
        departments: [
          { 
            department: "Booking & Reservations", 
            phone: "+91 90000 11111", 
            email: "booking@grandluxury.com",
            hours: "24/7", 
            description: "Room bookings, modifications, cancellations" 
          },
          { 
            department: "Food & Room Service", 
            phone: "+91 90000 22222", 
            email: "food@grandluxury.com",
            hours: "24/7", 
            description: "Menu, orders, dietary requirements" 
          },
          { 
            department: "Spa & Wellness", 
            phone: "+91 90000 44444", 
            email: "spa@grandluxury.com",
            hours: "6 AM - 11 PM", 
            description: "Spa treatments, wellness programs" 
          },
          { 
            department: "Guest Relations", 
            phone: "+91 90000 33333", 
            email: "support@grandluxury.com",
            hours: "24/7", 
            description: "General assistance and special requests" 
          }
        ]
      }
    );
  } catch (error) {
    console.error('Error adding department contacts:', error);
    addBotMessage(
      "For immediate assistance, please call our main number: +91 90000 11111",
      setMessages,
      'text'
    );
  }
};
