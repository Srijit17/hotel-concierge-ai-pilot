
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Edit3 } from 'lucide-react';

interface CorrectionSuggestion {
  original: string;
  corrected: string;
  confidence: number;
  intent: string;
  action: string;
}

interface IntentCorrectionEngineProps {
  userInput: string;
  suggestions: CorrectionSuggestion[];
  onAcceptCorrection: (suggestion: CorrectionSuggestion) => void;
  onRejectCorrection: () => void;
}

const IntentCorrectionEngine: React.FC<IntentCorrectionEngineProps> = ({
  userInput,
  suggestions,
  onAcceptCorrection,
  onRejectCorrection
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  const bestSuggestion = suggestions[0];

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-orange-800 mb-1">
                Did you mean something else?
              </h4>
              <p className="text-xs text-orange-700">
                I noticed some typos or unclear phrases in your message. Here's what I think you meant:
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">Original:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-red-600">
                  "{userInput}"
                </code>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs text-gray-600">Suggested:</span>
                <code className="text-xs bg-green-100 px-2 py-1 rounded text-green-700">
                  "{bestSuggestion.corrected}"
                </code>
                <Badge variant="outline" className="text-xs">
                  {Math.round(bestSuggestion.confidence * 100)}% confidence
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Intent:</span>
                <Badge className="text-xs bg-blue-100 text-blue-800">
                  {bestSuggestion.intent}
                </Badge>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => onAcceptCorrection(bestSuggestion)}
                className="flex-1"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Yes, that's right
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onRejectCorrection}
                className="flex-1"
              >
                No, use original
              </Button>
            </div>

            {suggestions.length > 1 && (
              <div className="pt-2 border-t border-orange-200">
                <p className="text-xs text-orange-600 mb-2">Other suggestions:</p>
                <div className="space-y-1">
                  {suggestions.slice(1, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start text-xs h-auto py-1"
                      onClick={() => onAcceptCorrection(suggestion)}
                    >
                      <span className="truncate">"{suggestion.corrected}"</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to generate correction suggestions
export const generateCorrectionSuggestions = (userInput: string): CorrectionSuggestion[] => {
  const suggestions: CorrectionSuggestion[] = [];
  const lowerInput = userInput.toLowerCase();

  // Common misspellings and their corrections
  const corrections = [
    // Food related
    { pattern: /fodr?|fod|foo[dt]/, correction: 'food', intent: 'RequestRoomService', confidence: 0.9 },
    { pattern: /ordre?|oder/, correction: 'order', intent: 'RequestRoomService', confidence: 0.85 },
    { pattern: /brekfast|breakfst/, correction: 'breakfast', intent: 'RequestRoomService', confidence: 0.9 },
    
    // Amenity related
    { pattern: /amnity|ameniti|amenty/, correction: 'amenity', intent: 'AskAboutAmenities', confidence: 0.9 },
    { pattern: /sp[ao]|sap/, correction: 'spa', intent: 'AddAmenity', confidence: 0.85 },
    { pattern: /masage|massag/, correction: 'massage', intent: 'AddAmenity', confidence: 0.9 },
    
    // Booking related
    { pattern: /bok|book?ing/, correction: 'booking', intent: 'ViewBooking', confidence: 0.85 },
    { pattern: /resrv|reserv[ae]/, correction: 'reservation', intent: 'BookRoom', confidence: 0.9 },
    { pattern: /cansel|cancl/, correction: 'cancel', intent: 'CancelReservation', confidence: 0.9 },
    
    // Payment related
    { pattern: /paymnt|paymt/, correction: 'payment', intent: 'PaymentInquiry', confidence: 0.85 },
    { pattern: /bil[l]?/, correction: 'bill', intent: 'PaymentInquiry', confidence: 0.8 },
    
    // General
    { pattern: /problm|prblem/, correction: 'problem', intent: 'Complaints', confidence: 0.85 },
    { pattern: /hlp|halp/, correction: 'help', intent: 'SpeakToHuman', confidence: 0.8 }
  ];

  // Check for matches
  corrections.forEach(({ pattern, correction, intent, confidence }) => {
    if (pattern.test(lowerInput)) {
      const correctedText = userInput.replace(new RegExp(pattern.source, 'gi'), correction);
      suggestions.push({
        original: userInput,
        corrected: correctedText,
        confidence,
        intent,
        action: intent.toLowerCase()
      });
    }
  });

  // Handle common phrase patterns
  if (lowerInput.includes('plz') || lowerInput.includes('pls')) {
    suggestions.push({
      original: userInput,
      corrected: userInput.replace(/plz|pls/gi, 'please'),
      confidence: 0.95,
      intent: 'General',
      action: 'polite_request'
    });
  }

  // Remove duplicates and sort by confidence
  return suggestions
    .filter((item, index, self) => 
      index === self.findIndex(s => s.corrected === item.corrected)
    )
    .sort((a, b) => b.confidence - a.confidence);
};

export default IntentCorrectionEngine;
