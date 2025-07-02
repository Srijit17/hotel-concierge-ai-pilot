
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, MessageSquare } from 'lucide-react';

interface FAQPrompt {
  id: string;
  question: string;
  category: 'booking' | 'dining' | 'amenities' | 'services' | 'technical';
  icon: string;
}

interface FAQPromptSuggestionsProps {
  onPromptSelect: (prompt: string) => void;
}

const FAQPromptSuggestions: React.FC<FAQPromptSuggestionsProps> = ({
  onPromptSelect
}) => {
  const faqPrompts: FAQPrompt[] = [
    // Booking Related
    { id: 'check_in_time', question: 'What time is check-in and check-out?', category: 'booking', icon: '🕒' },
    { id: 'cancellation', question: 'What is your cancellation policy?', category: 'booking', icon: '📋' },
    { id: 'room_types', question: 'What types of rooms do you have available?', category: 'booking', icon: '🏨' },
    { id: 'pet_policy', question: 'Do you allow pets in the hotel?', category: 'booking', icon: '🐕' },
    
    // Dining Related
    { id: 'restaurant_hours', question: 'What are the restaurant operating hours?', category: 'dining', icon: '🍽️' },
    { id: 'room_service', question: 'Is 24-hour room service available?', category: 'dining', icon: '🛎️' },
    { id: 'dietary_options', question: 'Do you have vegetarian/vegan options?', category: 'dining', icon: '🥗' },
    { id: 'breakfast_included', question: 'Is breakfast included in my booking?', category: 'dining', icon: '🍳' },
    
    // Amenities & Services
    { id: 'wifi_password', question: 'What is the WiFi password?', category: 'amenities', icon: '📶' },
    { id: 'pool_hours', question: 'What are the swimming pool hours?', category: 'amenities', icon: '🏊‍♂️' },
    { id: 'gym_access', question: 'Is the gym open 24 hours?', category: 'amenities', icon: '💪' },
    { id: 'spa_booking', question: 'How do I book a spa appointment?', category: 'amenities', icon: '💆‍♀️' },
    
    // Service Requests
    { id: 'housekeeping', question: 'I need extra towels and toiletries', category: 'services', icon: '🧴' },
    { id: 'maintenance', question: 'My air conditioning is not working', category: 'services', icon: '❄️' },
    { id: 'hot_water', question: 'There is no hot water in my room', category: 'services', icon: '🚿' },
    { id: 'laundry', question: 'Do you provide laundry services?', category: 'services', icon: '👕' },
    
    // Technical Support
    { id: 'tv_remote', question: 'The TV remote is not working', category: 'technical', icon: '📺' },
    { id: 'safe_help', question: 'I need help with the room safe', category: 'technical', icon: '🔒' },
    { id: 'phone_not_working', question: 'The room phone is not working', category: 'technical', icon: '☎️' },
    { id: 'keycard_issue', question: 'My keycard is not working', category: 'technical', icon: '🗝️' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking': return 'bg-blue-100 text-blue-800';
      case 'dining': return 'bg-green-100 text-green-800';
      case 'amenities': return 'bg-purple-100 text-purple-800';
      case 'services': return 'bg-orange-100 text-orange-800';
      case 'technical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'booking': return 'Booking & Reservations';
      case 'dining': return 'Dining & Food';
      case 'amenities': return 'Amenities & Facilities';
      case 'services': return 'Guest Services';
      case 'technical': return 'Technical Support';
      default: return 'General';
    }
  };

  const groupedPrompts = faqPrompts.reduce((acc, prompt) => {
    if (!acc[prompt.category]) {
      acc[prompt.category] = [];
    }
    acc[prompt.category].push(prompt);
    return acc;
  }, {} as Record<string, FAQPrompt[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Quick Help - FAQ Prompts</h3>
      </div>
      
      {Object.entries(groupedPrompts).map(([category, prompts]) => (
        <Card key={category} className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4" />
              <h4 className="font-medium">{getCategoryTitle(category)}</h4>
              <Badge className={`text-xs ${getCategoryColor(category)}`}>
                {prompts.length} questions
              </Badge>
            </div>
            
            <div className="grid gap-2">
              {prompts.slice(0, 4).map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="ghost"
                  className="justify-start text-left h-auto p-2 hover:bg-gray-50"
                  onClick={() => onPromptSelect(prompt.question)}
                >
                  <span className="mr-2">{prompt.icon}</span>
                  <span className="text-sm">{prompt.question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FAQPromptSuggestions;
