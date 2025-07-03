
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Clock, CreditCard, Car, Wifi, Coffee } from 'lucide-react';
import DynamicFAQEngine from './DynamicFAQEngine';
import { type DynamicFAQ } from '../../lib/dynamic-faq-service';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  popularity: number;
  icon: React.ReactNode;
}

interface FAQEngineProps {
  onQuestionSelect: (faq: FAQ | DynamicFAQ) => void;
}

const topFAQs: FAQ[] = [
  {
    id: '1',
    question: 'What are the check-in and check-out times?',
    answer: 'Check-in is from 3:00 PM onwards. Check-out is until 11:00 AM. Early check-in and late check-out are available based on availability.',
    category: 'General',
    popularity: 95,
    icon: <Clock className="w-4 h-4" />
  },
  {
    id: '2',
    question: 'What is the cancellation policy?',
    answer: 'Free cancellation up to 24 hours before check-in. Cancellations within 24 hours incur a one-night charge.',
    category: 'Booking',
    popularity: 88,
    icon: <CreditCard className="w-4 h-4" />
  },
  {
    id: '3',
    question: 'Is parking available?',
    answer: 'Yes! Complimentary valet parking is available for all guests. Self-parking is also available in our secure garage.',
    category: 'Amenities',
    popularity: 82,
    icon: <Car className="w-4 h-4" />
  },
  {
    id: '4',
    question: 'Is WiFi free?',
    answer: 'Yes, complimentary high-speed WiFi is available throughout the hotel. Password: GrandLuxury2024',
    category: 'Amenities',
    popularity: 79,
    icon: <Wifi className="w-4 h-4" />
  },
  {
    id: '5',
    question: 'What are the breakfast hours?',
    answer: 'Breakfast is served from 6:30 AM to 10:30 AM daily. We offer both continental and à la carte options.',
    category: 'Dining',
    popularity: 75,
    icon: <Coffee className="w-4 h-4" />
  }
];

const FAQEngine: React.FC<FAQEngineProps> = ({ onQuestionSelect }) => {
  const [activeTab, setActiveTab] = useState('dynamic');

  const handleStaticQuestionSelect = (faq: FAQ) => {
    onQuestionSelect(faq);
  };

  const handleDynamicQuestionSelect = (faq: DynamicFAQ) => {
    onQuestionSelect(faq);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dynamic">Live FAQs</TabsTrigger>
          <TabsTrigger value="static">Popular FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dynamic" className="mt-4">
          <DynamicFAQEngine 
            onQuestionSelect={handleDynamicQuestionSelect}
            showSearch={true}
            maxItems={10}
          />
        </TabsContent>
        
        <TabsContent value="static" className="mt-4">
          <div className="grid gap-3">
            {topFAQs.map((faq, index) => (
              <Card key={faq.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-0"
                    onClick={() => handleStaticQuestionSelect(faq)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="flex-shrink-0 mt-1">
                        {faq.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {faq.question}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              #{index + 1}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {faq.popularity}% ask this
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FAQEngine;
