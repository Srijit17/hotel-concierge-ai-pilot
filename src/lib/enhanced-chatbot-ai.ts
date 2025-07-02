
import { detectIntentLocal, generateAIResponse, getQuickResponse, type AIContext } from './local-ai';
import { 
  detectIntent, 
  searchFAQ, 
  routeToModule, 
  type SessionContext,
  levenshteinDistance,
  correctSpellingAndDetectIntent
} from './chatbot-ai';

// Enhanced AI system that combines local AI with existing logic
export class EnhancedChatbotAI {
  private static instance: EnhancedChatbotAI;
  private responseCache: Map<string, { response: string; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): EnhancedChatbotAI {
    if (!EnhancedChatbotAI.instance) {
      EnhancedChatbotAI.instance = new EnhancedChatbotAI();
    }
    return EnhancedChatbotAI.instance;
  }

  // Fast response generation with caching
  async generateResponse(
    userMessage: string, 
    sessionContext: SessionContext,
    previousMessages: string[] = []
  ): Promise<{ text: string; type: string; data?: any; confidence: number }> {
    
    // Check cache first for identical messages
    const cacheKey = `${userMessage.toLowerCase()}_${JSON.stringify(sessionContext)}`;
    const cached = this.responseCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return { text: cached.response, type: 'text', confidence: 0.9 };
    }

    // Try quick response first (fastest)
    const quickResponse = getQuickResponse(userMessage);
    if (quickResponse) {
      this.cacheResponse(cacheKey, quickResponse);
      return { text: quickResponse, type: 'text', confidence: 0.95 };
    }

    // Apply spell correction
    const { correctedText } = correctSpellingAndDetectIntent(userMessage);
    
    // Use local AI for fast intent detection
    const localIntent = detectIntentLocal(correctedText);
    
    // Use existing system for complex intents
    const existingIntent = detectIntent(correctedText, sessionContext);
    
    // Choose the best intent based on confidence
    const bestIntent = localIntent.confidence > existingIntent.confidence ? localIntent : existingIntent;
    
    // Create AI context
    const aiContext: AIContext = {
      userMessage: correctedText,
      sessionContext,
      previousMessages,
      intent: bestIntent.intent,
      confidence: bestIntent.confidence
    };

    // Try to get response from existing modules first
    const moduleResponse = routeToModule(bestIntent.intent, correctedText, existingIntent.entities || {});
    
    if (moduleResponse && moduleResponse.confidence > 0.8) {
      this.cacheResponse(cacheKey, moduleResponse.text);
      return moduleResponse;
    }

    // Use local AI to generate response
    const aiResponse = generateAIResponse(aiContext);
    this.cacheResponse(cacheKey, aiResponse);
    
    return {
      text: aiResponse,
      type: 'text',
      confidence: bestIntent.confidence,
      data: this.getContextualData(bestIntent.intent)
    };
  }

  // Get contextual data based on intent
  private getContextualData(intent: string): any {
    const contextualData: Record<string, any> = {
      roomAvailability: {
        action: 'show_rooms',
        rooms: [
          { id: '1', name: 'Deluxe Room', price: 200, available: true },
          { id: '2', name: 'Ocean View Suite', price: 350, available: true },
          { id: '3', name: 'Presidential Suite', price: 500, available: true }
        ]
      },
      amenities: {
        action: 'show_amenities',
        amenities: [
          { name: 'Spa Treatment', price: 80, duration: '60 min' },
          { name: 'Gym Access', price: 0, duration: 'Full day' },
          { name: 'Pool Access', price: 0, duration: 'Full day' }
        ]
      },
      dining: {
        action: 'show_menu',
        categories: ['Breakfast', 'Lunch', 'Dinner', 'Room Service']
      }
    };

    return contextualData[intent] || null;
  }

  // Cache management
  private cacheResponse(key: string, response: string): void {
    this.responseCache.set(key, { response, timestamp: Date.now() });
    
    // Clean old cache entries
    if (this.responseCache.size > 100) {
      const now = Date.now();
      for (const [k, v] of this.responseCache.entries()) {
        if (now - v.timestamp > this.CACHE_DURATION) {
          this.responseCache.delete(k);
        }
      }
    }
  }

  // Clear cache manually if needed
  clearCache(): void {
    this.responseCache.clear();
  }
}

// Export singleton instance
export const enhancedAI = EnhancedChatbotAI.getInstance();
