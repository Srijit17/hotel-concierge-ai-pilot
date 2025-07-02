
// Simple local AI response system with pattern matching and context awareness
export interface AIContext {
  userMessage: string;
  sessionContext: any;
  previousMessages: string[];
  intent: string;
  confidence: number;
}

// Enhanced AI response patterns with more comprehensive coverage
const aiResponsePatterns = {
  // Greetings and general
  greeting: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'greetings'],
    responses: [
      "Hello! Welcome to The Grand Luxury Hotel. I'm Sofia, your AI assistant. How can I help you today?",
      "Hi there! I'm Sofia, ready to assist you with your hotel needs. What would you like to know?",
      "Welcome! I'm here to help make your stay perfect. What can I do for you?"
    ]
  },
  
  // Hotel information
  hotelInfo: {
    patterns: ['about hotel', 'hotel info', 'facilities', 'what do you offer', 'tell me about'],
    responses: [
      "The Grand Luxury Hotel offers world-class amenities including a spa, fitness center, multiple restaurants, and ocean views. We're committed to providing exceptional service for all our guests.",
      "Our hotel features luxury accommodations with premium amenities, 24/7 room service, spa treatments, and stunning views. What specific aspect would you like to know more about?"
    ]
  },
  
  // Room availability
  roomAvailability: {
    patterns: ['rooms available', 'check availability', 'book room', 'room types', 'accommodation'],
    responses: [
      "I'd be happy to help you find the perfect room! We have various room types including Deluxe, Ocean View, and Suites. Let me show you our available options.",
      "Our rooms range from cozy Deluxe rooms to luxurious Suites with ocean views. Would you like to see our current availability?"
    ]
  },
  
  // Amenities
  amenities: {
    patterns: ['amenities', 'spa', 'gym', 'pool', 'fitness', 'wellness', 'facilities'],
    responses: [
      "Our amenities include a luxury spa, state-of-the-art fitness center, infinity pool, and various wellness treatments. Would you like to book any of these services?",
      "We offer world-class amenities: spa treatments, fitness facilities, swimming pool, and wellness programs. Which one interests you most?"
    ]
  },
  
  // Food and dining
  dining: {
    patterns: ['food', 'restaurant', 'dining', 'menu', 'room service', 'breakfast', 'lunch', 'dinner'],
    responses: [
      "Our culinary offerings include fine dining restaurant, casual café, and 24/7 room service. Would you like to see our menu or place an order?",
      "We have excellent dining options with international cuisine, local specialties, and room service available 24/7. What would you like to try?"
    ]
  },
  
  // Booking and reservations
  booking: {
    patterns: ['book', 'reserve', 'reservation', 'check in', 'check out', 'my booking'],
    responses: [
      "I can help you with bookings and reservations. Do you have an existing booking you'd like to check, or would you like to make a new reservation?",
      "For booking assistance, I can help you check your current reservation or create a new one. What would you prefer?"
    ]
  },
  
  // Pricing
  pricing: {
    patterns: ['price', 'cost', 'how much', 'rates', 'charges', 'fee'],
    responses: [
      "Our room rates vary by season and room type, starting from $200 per night for Deluxe rooms. Amenity services have separate pricing. Would you like specific pricing information?",
      "Pricing depends on your selections. Rooms start at $200/night, spa services from $80, and dining varies by menu. What specific pricing do you need?"
    ]
  },
  
  // Policies
  policies: {
    patterns: ['policy', 'cancellation', 'refund', 'terms', 'conditions', 'rules'],
    responses: [
      "Our cancellation policy allows free cancellation up to 24 hours before check-in. For detailed terms and conditions, I can connect you with our front desk.",
      "We have flexible policies for most services. Cancellations are generally accepted 24 hours in advance. Would you like specific policy information?"
    ]
  },
  
  // Location and directions
  location: {
    patterns: ['location', 'address', 'directions', 'how to get', 'where are you', 'nearby'],
    responses: [
      "We're located in the heart of the city with easy access to major attractions. Our concierge can provide detailed directions and transportation options.",
      "Our prime location offers convenient access to shopping, dining, and entertainment. Would you like specific directions or nearby attraction information?"
    ]
  },
  
  // Support and help
  support: {
    patterns: ['help', 'support', 'problem', 'issue', 'assistance', 'contact'],
    responses: [
      "I'm here to help! If I can't solve your specific issue, I can connect you with the appropriate department. What do you need assistance with?",
      "I'd be happy to assist you. For complex issues, I can transfer you to our specialized departments. What kind of help do you need?"
    ]
  }
};

// Enhanced intent detection with better accuracy
export const detectIntentLocal = (text: string): { intent: string; confidence: number } => {
  const lowerText = text.toLowerCase();
  let bestMatch = { intent: 'general', confidence: 0.1 };
  
  for (const [intentName, intentData] of Object.entries(aiResponsePatterns)) {
    const matches = intentData.patterns.filter(pattern => {
      // Check for exact phrase matches
      if (lowerText.includes(pattern)) return true;
      
      // Check for word matches
      const words = lowerText.split(' ');
      const patternWords = pattern.split(' ');
      
      return patternWords.some(patternWord => 
        words.some(word => word.includes(patternWord) || patternWord.includes(word))
      );
    });
    
    if (matches.length > 0) {
      const confidence = Math.min(0.85 + (matches.length * 0.05), 0.95);
      if (confidence > bestMatch.confidence) {
        bestMatch = { intent: intentName, confidence };
      }
    }
  }
  
  return bestMatch;
};

// Generate AI response based on detected intent
export const generateAIResponse = (context: AIContext): string => {
  const { intent, userMessage, confidence } = context;
  
  // If confidence is too low, provide a helpful fallback
  if (confidence < 0.6) {
    return "I want to make sure I understand you correctly. Could you please rephrase your question or tell me specifically what you'd like help with? I can assist with bookings, amenities, dining, or general hotel information.";
  }
  
  // Get response pattern for the detected intent
  const intentPattern = aiResponsePatterns[intent as keyof typeof aiResponsePatterns];
  
  if (intentPattern) {
    // Select a random response from the pattern
    const responses = intentPattern.responses;
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }
  
  // Default fallback response
  return "I'm here to help you with your hotel experience! I can assist with room bookings, amenities, dining, and general information. What would you like to know more about?";
};

// Quick response for common queries
export const getQuickResponse = (text: string): string | null => {
  const lowerText = text.toLowerCase();
  
  // Quick responses for very common questions
  const quickResponses: Record<string, string> = {
    'thank you': "You're welcome! Is there anything else I can help you with?",
    'thanks': "You're welcome! Let me know if you need anything else.",
    'yes': "Great! How would you like to proceed?",
    'no': "No problem! Is there something else I can help you with?",
    'ok': "Perfect! What would you like to do next?",
    'wifi password': "The WiFi password is 'GrandLuxury2024'. You can also find it on your room key card.",
    'checkout time': "Checkout time is 11:00 AM. Late checkout may be available upon request.",
    'checkin time': "Check-in time is 3:00 PM. Early check-in is subject to availability.",
    'pool hours': "Our pool is open from 6:00 AM to 10:00 PM daily.",
    'gym hours': "The fitness center is open 24/7 for your convenience.",
    'room service': "Room service is available 24/7. Would you like to see our menu?",
    'spa hours': "Our spa is open from 9:00 AM to 9:00 PM daily."
  };
  
  for (const [key, response] of Object.entries(quickResponses)) {
    if (lowerText.includes(key)) {
      return response;
    }
  }
  
  return null;
};
