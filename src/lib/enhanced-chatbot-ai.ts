
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
  private readonly MAX_CACHE_SIZE = 200;
  private readonly MIN_CONFIDENCE_THRESHOLD = 0.3;
  private readonly FALLBACK_THRESHOLD = 3;

  static getInstance(): EnhancedChatbotAI {
    if (!EnhancedChatbotAI.instance) {
      EnhancedChatbotAI.instance = new EnhancedChatbotAI();
    }
    return EnhancedChatbotAI.instance;
  }

  // Enhanced response generation with comprehensive edge case handling
  async generateResponse(
    userMessage: string, 
    sessionContext: SessionContext,
    previousMessages: string[] = []
  ): Promise<{ text: string; type: string; data?: any; confidence: number }> {
    
    try {
      // Input validation and sanitization
      if (!userMessage || typeof userMessage !== 'string') {
        return this.getFallbackResponse('invalid_input', sessionContext);
      }

      const sanitizedMessage = userMessage.trim();
      if (sanitizedMessage.length === 0) {
        return this.getFallbackResponse('empty_input', sessionContext);
      }

      if (sanitizedMessage.length > 1000) {
        return this.getFallbackResponse('message_too_long', sessionContext);
      }

      // Check cache first for identical messages
      const cacheKey = `${sanitizedMessage.toLowerCase()}_${JSON.stringify(sessionContext)}`;
      const cached = this.responseCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return { text: cached.response, type: 'text', confidence: 0.9 };
      }

      // Handle repeated fallbacks
      if (sessionContext.fallbackCount >= this.FALLBACK_THRESHOLD) {
        return this.getEscalationResponse(sessionContext);
      }

      // Try quick response first (fastest)
      const quickResponse = getQuickResponse(sanitizedMessage);
      if (quickResponse) {
        this.cacheResponse(cacheKey, quickResponse);
        return { text: quickResponse, type: 'text', confidence: 0.95 };
      }

      // Apply spell correction with error handling
      let correctedText = sanitizedMessage;
      try {
        const correction = correctSpellingAndDetectIntent(sanitizedMessage);
        correctedText = correction.correctedText;
      } catch (error) {
        console.warn('Spell correction failed:', error);
        correctedText = sanitizedMessage;
      }

      // Use local AI for fast intent detection with fallback
      let localIntent;
      try {
        localIntent = detectIntentLocal(correctedText);
      } catch (error) {
        console.warn('Local intent detection failed:', error);
        localIntent = { intent: 'fallback', confidence: 0.1 };
      }
      
      // Use existing system for complex intents with fallback
      let existingIntent;
      try {
        existingIntent = detectIntent(correctedText, sessionContext);
      } catch (error) {
        console.warn('Existing intent detection failed:', error);
        existingIntent = { intent: 'fallback', confidence: 0.1, entities: {} };
      }
      
      // Choose the best intent based on confidence
      const bestIntent = localIntent.confidence > existingIntent.confidence ? localIntent : existingIntent;
      
      // Confidence threshold check
      if (bestIntent.confidence < this.MIN_CONFIDENCE_THRESHOLD) {
        return this.getFallbackResponse('low_confidence', sessionContext);
      }

      // Create AI context with error handling
      const aiContext: AIContext = {
        userMessage: correctedText,
        sessionContext: { ...sessionContext },
        previousMessages: previousMessages.slice(-5), // Limit context
        intent: bestIntent.intent,
        confidence: bestIntent.confidence
      };

      // Try to get response from existing modules first
      let moduleResponse;
      try {
        moduleResponse = routeToModule(bestIntent.intent, correctedText, existingIntent.entities || {});
      } catch (error) {
        console.warn('Module routing failed:', error);
        moduleResponse = null;
      }
      
      if (moduleResponse && moduleResponse.confidence > 0.8) {
        this.cacheResponse(cacheKey, moduleResponse.text);
        return moduleResponse;
      }

      // Use local AI to generate response with fallback
      let aiResponse;
      try {
        aiResponse = generateAIResponse(aiContext);
      } catch (error) {
        console.warn('AI response generation failed:', error);
        return this.getFallbackResponse('ai_error', sessionContext);
      }

      this.cacheResponse(cacheKey, aiResponse);
      
      return {
        text: aiResponse,
        type: 'text',
        confidence: bestIntent.confidence,
        data: this.getContextualData(bestIntent.intent)
      };

    } catch (error) {
      console.error('Critical error in response generation:', error);
      return this.getFallbackResponse('critical_error', sessionContext);
    }
  }

  // Enhanced fallback response system
  private getFallbackResponse(reason: string, sessionContext: SessionContext): { text: string; type: string; confidence: number; data?: any } {
    const fallbackResponses = {
      invalid_input: "I'm sorry, I couldn't process your message. Could you please rephrase it?",
      empty_input: "I didn't receive any message. How can I help you today?",
      message_too_long: "Your message is quite long. Could you please break it down into smaller questions?",
      low_confidence: "I'm not entirely sure I understand. Could you please be more specific about what you need help with?",
      ai_error: "I'm experiencing some technical difficulties. Let me connect you with our support team.",
      critical_error: "I apologize for the inconvenience. Our support team will assist you shortly.",
      escalation: "I understand you're looking for specific help. Let me connect you with our human support team who can better assist you."
    };

    const fallbackActions = {
      invalid_input: { action: 'show_help_options' },
      empty_input: { action: 'show_quick_actions' },
      message_too_long: { action: 'show_help_tips' },
      low_confidence: { action: 'show_clarification_options' },
      ai_error: { action: 'show_contact_support' },
      critical_error: { action: 'show_contact_support' },
      escalation: { action: 'show_contact_support' }
    };

    return {
      text: fallbackResponses[reason] || fallbackResponses.critical_error,
      type: 'fallback',
      confidence: 0.1,
      data: fallbackActions[reason] || fallbackActions.critical_error
    };
  }

  // Enhanced escalation response
  private getEscalationResponse(sessionContext: SessionContext): { text: string; type: string; confidence: number; data?: any } {
    return {
      text: "I notice you might need more specific assistance. Let me connect you with our support team for personalized help.",
      type: 'escalation',
      confidence: 0.95,
      data: {
        action: 'show_contact_support',
        escalationReason: 'repeated_fallbacks',
        sessionInfo: {
          fallbackCount: sessionContext.fallbackCount,
          previousIntents: sessionContext.previousIntents
        }
      }
    };
  }

  // Enhanced contextual data with error handling
  private getContextualData(intent: string): any {
    try {
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
        },
        support: {
          action: 'show_contact_support',
          departments: [
            { name: 'Front Desk', phone: '+1-555-0123' },
            { name: 'Room Service', phone: '+1-555-0124' },
            { name: 'Concierge', phone: '+1-555-0125' }
          ]
        }
      };

      return contextualData[intent] || null;
    } catch (error) {
      console.error('Error getting contextual data:', error);
      return null;
    }
  }

  // Enhanced cache management with size limits
  private cacheResponse(key: string, response: string): void {
    try {
      // Clean old entries first if cache is too large
      if (this.responseCache.size >= this.MAX_CACHE_SIZE) {
        this.cleanOldCacheEntries();
      }

      this.responseCache.set(key, { response, timestamp: Date.now() });
    } catch (error) {
      console.error('Cache management error:', error);
    }
  }

  // Enhanced cache cleanup
  private cleanOldCacheEntries(): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];

    for (const [key, value] of this.responseCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        entriesToDelete.push(key);
      }
    }

    // Delete expired entries
    entriesToDelete.forEach(key => this.responseCache.delete(key));

    // If still too large, delete oldest entries
    if (this.responseCache.size >= this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.responseCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, Math.floor(this.MAX_CACHE_SIZE * 0.3));
      toDelete.forEach(([key]) => this.responseCache.delete(key));
    }
  }

  // Clear cache manually if needed
  clearCache(): void {
    try {
      this.responseCache.clear();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Health check method
  getHealthStatus(): { status: string; cacheSize: number; timestamp: number } {
    return {
      status: 'healthy',
      cacheSize: this.responseCache.size,
      timestamp: Date.now()
    };
  }
}

// Export singleton instance
export const enhancedAI = EnhancedChatbotAI.getInstance();
