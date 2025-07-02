
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Utensils, Sparkles, Clock, Gift } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  category: string;
  timing?: string;
}

interface SmartSuggestionEngineProps {
  userContext: {
    hasBooking: boolean;
    lastOrderTime?: string;
    hasSpaBooking: boolean;
    isLoyaltyMember: boolean;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  onSuggestionSelect: (suggestion: Suggestion) => void;
}

const SmartSuggestionEngine: React.FC<SmartSuggestionEngineProps> = ({
  userContext,
  onSuggestionSelect
}) => {
  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const { hasBooking, lastOrderTime, hasSpaBooking, isLoyaltyMember, timeOfDay } = userContext;

    // Time-based suggestions
    if (timeOfDay === 'morning') {
      suggestions.push({
        id: 'breakfast',
        title: 'Start Your Day Right',
        description: 'Would you like to order breakfast to your room?',
        action: 'order_breakfast',
        priority: 'high',
        icon: <Utensils className="w-4 h-4" />,
        category: 'Food',
        timing: 'Morning Special'
      });
    }

    if (timeOfDay === 'evening' && (!lastOrderTime || isMoreThanHoursAgo(lastOrderTime, 4))) {
      suggestions.push({
        id: 'dinner',
        title: 'Dinner Time Approaching',
        description: 'Browse our dinner menu and place your order',
        action: 'order_dinner',
        priority: 'high',
        icon: <Utensils className="w-4 h-4" />,
        category: 'Food',
        timing: 'Evening Special'
      });
    }

    // Wellness suggestions
    if (hasBooking && !hasSpaBooking) {
      suggestions.push({
        id: 'spa',
        title: 'Relax & Unwind',
        description: 'Add a spa treatment to make your stay perfect',
        action: 'book_spa',
        priority: 'medium',
        icon: <Sparkles className="w-4 h-4" />,
        category: 'Wellness'
      });
    }

    // Loyalty member special
    if (isLoyaltyMember) {
      suggestions.push({
        id: 'loyalty_perks',
        title: 'Member Exclusive',
        description: 'Check out your exclusive member benefits',
        action: 'view_loyalty_perks',
        priority: 'medium',
        icon: <Gift className="w-4 h-4" />,
        category: 'Rewards'
      });
    }

    // Late checkout suggestion
    if (hasBooking && timeOfDay === 'morning') {
      suggestions.push({
        id: 'late_checkout',
        title: 'Need More Time?',
        description: 'Request late checkout for a relaxed departure',
        action: 'request_late_checkout',
        priority: 'low',
        icon: <Clock className="w-4 h-4" />,
        category: 'Convenience'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const isMoreThanHoursAgo = (timeString: string, hours: number): boolean => {
    const lastTime = new Date(timeString);
    const now = new Date();
    const diffHours = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);
    return diffHours > hours;
  };

  const suggestions = generateSuggestions();

  if (suggestions.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Smart Suggestions for You</h3>
      </div>
      
      <div className="grid gap-3">
        {suggestions.slice(0, 3).map((suggestion) => (
          <Card key={suggestion.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto p-0"
                onClick={() => onSuggestionSelect(suggestion)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {suggestion.title}
                      </span>
                      <div className="flex items-center space-x-1">
                        {suggestion.timing && (
                          <Badge variant="outline" className="text-xs">
                            {suggestion.timing}
                          </Badge>
                        )}
                        <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {suggestion.description}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {suggestion.category}
                    </Badge>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestionEngine;
