
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Clock, MapPin, Star, Heart, 
  ThumbsUp, MessageSquare, Sparkles, Gift 
} from 'lucide-react';

interface InteractiveElement {
  id: string;
  type: 'rating' | 'quick-reply' | 'calendar' | 'location' | 'preference';
  title: string;
  data: any;
}

interface InteractiveChatElementsProps {
  elements: InteractiveElement[];
  onInteraction: (elementId: string, value: any) => void;
}

export const InteractiveChatElements: React.FC<InteractiveChatElementsProps> = ({
  elements,
  onInteraction
}) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const renderRatingElement = (element: InteractiveElement) => {
    const currentRating = ratings[element.id] || 0;
    
    return (
      <Card key={element.id} className="border border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{element.title}</span>
            <Badge variant="outline" className="text-xs">Rate this</Badge>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRatings(prev => ({ ...prev, [element.id]: star }));
                  onInteraction(element.id, star);
                }}
                className="p-1"
              >
                <Star 
                  className={`w-4 h-4 ${
                    star <= currentRating 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              </Button>
            ))}
          </div>
          {currentRating > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              Thanks for rating! ({currentRating}/5 stars)
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderQuickReplyElement = (element: InteractiveElement) => {
    return (
      <Card key={element.id} className="border border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{element.title}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {element.data.options.map((option: string) => (
              <Button
                key={option}
                variant={selectedOptions[element.id] === option ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedOptions(prev => ({ ...prev, [element.id]: option }));
                  onInteraction(element.id, option);
                }}
                className="text-xs"
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCalendarElement = (element: InteractiveElement) => {
    const [selectedDate, setSelectedDate] = useState('');
    
    return (
      <Card key={element.id} className="border border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{element.title}</span>
          </div>
          <div className="flex space-x-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="text-sm"
            />
            <Button 
              size="sm"
              onClick={() => onInteraction(element.id, selectedDate)}
              disabled={!selectedDate}
            >
              Select
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLocationElement = (element: InteractiveElement) => {
    return (
      <Card key={element.id} className="border border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{element.title}</span>
          </div>
          <div className="space-y-2">
            {element.data.locations.map((location: any) => (
              <Button
                key={location.id}
                variant="outline"
                size="sm"
                onClick={() => onInteraction(element.id, location)}
                className="w-full justify-start text-xs"
              >
                <MapPin className="w-3 h-3 mr-2" />
                {location.name} - {location.distance}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPreferenceElement = (element: InteractiveElement) => {
    return (
      <Card key={element.id} className="border border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <Heart className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{element.title}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {element.data.preferences.map((pref: string) => (
              <Button
                key={pref}
                variant="outline"
                size="sm"
                onClick={() => onInteraction(element.id, pref)}
                className="text-xs"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {pref}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderElement = (element: InteractiveElement) => {
    switch (element.type) {
      case 'rating':
        return renderRatingElement(element);
      case 'quick-reply':
        return renderQuickReplyElement(element);
      case 'calendar':
        return renderCalendarElement(element);
      case 'location':
        return renderLocationElement(element);
      case 'preference':
        return renderPreferenceElement(element);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {elements.map(renderElement)}
    </div>
  );
};
