
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Star, ThumbsUp, ThumbsDown, Calendar, Users, DollarSign, 
  Filter, TrendingUp, Clock, MapPin, Coffee, Utensils 
} from 'lucide-react';

interface InteractiveFeaturesProps {
  onFeedback: (type: 'positive' | 'negative', message: string) => void;
  onRoomFilter: (filters: any) => void;
  onQuickPoll: (response: string) => void;
  userPreferences: any;
}

export const InteractiveFeatures: React.FC<InteractiveFeaturesProps> = ({
  onFeedback,
  onRoomFilter,
  onQuickPoll,
  userPreferences
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [pollResponse, setPollResponse] = useState('');

  const amenities = [
    { id: 'wifi', name: 'Free WiFi', icon: '📶' },
    { id: 'pool', name: 'Pool', icon: '🏊' },
    { id: 'gym', name: 'Gym', icon: '💪' },
    { id: 'spa', name: 'Spa', icon: '🧘' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'parking', name: 'Parking', icon: '🚗' }
  ];

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleApplyFilters = () => {
    onRoomFilter({
      priceRange,
      amenities: selectedAmenities,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-4">
      {/* Interactive Room Filters */}
      <Card className="border border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <Filter className="w-4 h-4 mr-2" />
            Smart Room Finder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Price Range: ${priceRange[0]} - ${priceRange[1]} per night
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              min={50}
              step={25}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Preferred Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {amenities.map(amenity => (
                <Button
                  key={amenity.id}
                  variant={selectedAmenities.includes(amenity.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleAmenity(amenity.id)}
                  className="justify-start"
                >
                  <span className="mr-2">{amenity.icon}</span>
                  {amenity.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Button onClick={handleApplyFilters} className="w-full">
            Find Perfect Rooms
          </Button>
        </CardContent>
      </Card>

      {/* Quick Feedback */}
      <Card className="border border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <ThumbsUp className="w-4 h-4 mr-2" />
            How am I doing?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onFeedback('positive', 'Great service!')}
              className="flex-1"
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              Great!
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onFeedback('negative', 'Could be better')}
              className="flex-1"
            >
              <ThumbsDown className="w-3 h-3 mr-1" />
              Needs work
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Tell me more..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="flex-1"
            />
            <Button 
              size="sm"
              onClick={() => {
                onFeedback('positive', feedbackText);
                setFeedbackText('');
              }}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Poll */}
      <Card className="border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Quick Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            What's most important for your stay?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['Comfort', 'Location', 'Price', 'Amenities'].map(option => (
              <Button
                key={option}
                variant={pollResponse === option ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPollResponse(option);
                  onQuickPoll(option);
                }}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
