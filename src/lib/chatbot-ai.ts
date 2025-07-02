import { intentTrainingData, faqDatabase, departmentContacts } from './chatbot-data';

export interface SessionContext {
  guestName?: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  roomNumber?: string;
  fallbackCount: number;
  previousIntents: string[];
  visitCount: number;
  currentBooking?: any;
}

// Levenshtein distance for fuzzy matching
export const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Spell correction and intent enhancement
export const correctSpellingAndDetectIntent = (text: string): { correctedText: string; suggestedIntent?: string } => {
  let correctedText = text;
  
  // Common hotel-related spelling corrections
  const corrections = {
    'amenity': ['amnity', 'ameniti', 'amenty'],
    'reservation': ['reservaton', 'resevation', 'reserv'],
    'restaurant': ['restarant', 'resturant', 'restrant'],
    'breakfast': ['brekfast', 'breakfst', 'breckfast'],
    'available': ['availabel', 'avalible', 'availble'],
    'massage': ['masage', 'massag', 'mesage'],
    'concierge': ['consierge', 'concierj', 'concierg'],
    'facility': ['faciliti', 'facillity', 'facilitie']
  };

  for (const [correct, misspellings] of Object.entries(corrections)) {
    misspellings.forEach(misspell => {
      if (correctedText.toLowerCase().includes(misspell)) {
        correctedText = correctedText.replace(new RegExp(misspell, 'gi'), correct);
      }
    });
  }

  return { correctedText };
};

// Enhanced FAQ search function
export const searchFAQ = (text: string): any => {
  const lowerText = text.toLowerCase();
  
  for (const [key, faq] of Object.entries(faqDatabase)) {
    const matchesKeywords = faq.keywords.some(keyword => lowerText.includes(keyword));
    const matchesQuestion = lowerText.includes(faq.question.toLowerCase());
    
    if (matchesKeywords || matchesQuestion) {
      return {
        question: faq.question,
        answer: faq.answer,
        confidence: matchesQuestion ? 0.95 : 0.85
      };
    }
  }
  return null;
};

// Enhanced intent detection with spell correction and fuzzy matching
export const detectIntent = (text: string, sessionContext: SessionContext): { intent: string; confidence: number; entities: any } => {
  // First apply spell correction
  const { correctedText } = correctSpellingAndDetectIntent(text);
  const lowerText = correctedText.toLowerCase();
  let bestMatch = { intent: 'fallback', confidence: 0.1, entities: {} };

  // Use training data for intent detection
  for (const [intentName, intentData] of Object.entries(intentTrainingData)) {
    const matches = intentData.patterns.filter((pattern: string) => {
      // Exact match
      if (lowerText.includes(pattern)) return true;
      
      // Fuzzy match for common typos
      const words = lowerText.split(' ');
      return words.some(word => {
        const distance = levenshteinDistance(word, pattern);
        return distance <= 2 && word.length > 3; // Allow 2 character differences for words longer than 3
      });
    });
    
    if (matches.length > 0) {
      const baseScore = matches.length * intentData.weight * 0.1;
      const confidence = Math.min(intentData.confidence + baseScore, 0.98);
      
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          intent: intentName,
          confidence,
          entities: extractEntities(correctedText, intentName)
        };
      }
    }
  }

  // Context-based follow-up detection
  if (sessionContext.previousIntents.length > 0) {
    const lastIntent = sessionContext.previousIntents[sessionContext.previousIntents.length - 1];
    
    if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much')) {
      return { intent: 'PaymentInquiry', confidence: 0.85, entities: { followUp: 'pricing', relatedIntent: lastIntent } };
    }
    if (lowerText.match(/^(yes|yeah|ok|sure|sounds good|perfect)$/i)) {
      return { intent: lastIntent, confidence: 0.90, entities: { confirmation: true } };
    }
    if (lowerText.match(/^(no|nope|not now|maybe later)$/i)) {
      return { intent: 'decline', confidence: 0.88, entities: { decline: true } };
    }
  }

  return bestMatch;
};

export const extractEntities = (text: string, intent: string): any => {
  const entities: any = {};
  const lowerText = text.toLowerCase();

  // Date extraction
  if (lowerText.includes('tonight')) entities.date = 'tonight';
  if (lowerText.includes('tomorrow')) entities.date = 'tomorrow';
  if (lowerText.includes('weekend')) entities.date = 'weekend';
  if (lowerText.includes('next week')) entities.date = 'next week';
  if (lowerText.match(/\d{1,2}[\/\-]\d{1,2}/)) entities.date = 'specific_date';

  // Room type extraction
  if (lowerText.includes('suite')) entities.roomType = 'suite';
  if (lowerText.includes('deluxe')) entities.roomType = 'deluxe';
  if (lowerText.includes('ocean view') || lowerText.includes('sea view')) entities.roomType = 'ocean view';
  if (lowerText.includes('king')) entities.bedType = 'king';
  if (lowerText.includes('queen')) entities.bedType = 'queen';

  // Guest count
  const guestMatch = text.match(/(\d+)\s*(guest|person|people)/i);
  if (guestMatch) entities.guests = parseInt(guestMatch[1]);

  // Food items
  if (intent === 'RequestRoomService') {
    if (lowerText.includes('breakfast')) entities.meal = 'breakfast';
    if (lowerText.includes('lunch')) entities.meal = 'lunch';
    if (lowerText.includes('dinner')) entities.meal = 'dinner';
    if (lowerText.includes('coffee')) entities.beverage = 'coffee';
  }

  // Time extraction
  const timeMatch = text.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm)/i);
  if (timeMatch) entities.time = timeMatch[0];

  return entities;
};

// Enhanced module-based response routing
export const routeToModule = (intent: string, userText: string, entities: any): any => {
  const module = intentTrainingData[intent]?.module;
  
  switch (module) {
    case 'faq':
      const faqResult = searchFAQ(userText);
      if (faqResult) {
        return {
          text: faqResult.answer,
          type: 'text' as const,
          confidence: faqResult.confidence
        };
      }
      break;
    
    case 'support':
      return {
        text: "I'm sorry you're experiencing an issue. Let me connect you with the right department to help resolve this quickly:",
        type: 'department-contacts' as const,
        data: {
          departments: Object.values(departmentContacts).map(dept => ({
            department: dept.name,
            phone: dept.phone,
            email: dept.email,
            hours: dept.hours,
            description: dept.description
          }))
        }
      };
    
    case 'payment':
      return {
        text: "I can help you with payment and billing inquiries. Here are your options:",
        type: 'payment-options' as const,
        data: {
          options: [
            { title: "Pay Outstanding Balance", action: "pay_balance", description: "Complete any pending payments" },
            { title: "View Bill Details", action: "view_bill", description: "See detailed breakdown of charges" },
            { title: "Payment History", action: "payment_history", description: "Review past transactions" },
            { title: "Billing Support", action: "billing_support", description: "Speak with billing department" }
          ]
        }
      };
  }
  
  return null;
};