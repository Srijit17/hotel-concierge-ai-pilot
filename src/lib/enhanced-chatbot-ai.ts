
import { detectIntentLocal, generateAIResponse, getQuickResponse, type AIContext } from './local-ai';
import { 
  detectIntent, 
  routeToModule, 
  type SessionContext,
  correctSpellingAndDetectIntent
} from './chatbot-ai';
import { ResponseCacheManager } from './chatbot/cache-manager';
import { FallbackHandler } from './chatbot/fallback-handler';
import { EscalationHandler } from './chatbot/escalation-handler';
import { ContextualDataProvider } from './chatbot/contextual-data-provider';
import { InputValidator } from './chatbot/input-validator';

// Enhanced AI system that combines local AI with existing logic
export class EnhancedChatbotAI {
  private static instance: EnhancedChatbotAI;
  private cacheManager: ResponseCacheManager;
  private fallbackHandler: FallbackHandler;
  private escalationHandler: EscalationHandler;
  private contextualDataProvider: ContextualDataProvider;
  private inputValidator: InputValidator;
  
  private readonly MIN_CONFIDENCE_THRESHOLD = 0.3;

  constructor() {
    this.cacheManager = new ResponseCacheManager();
    this.fallbackHandler = new FallbackHandler();
    this.escalationHandler = new EscalationHandler();
    this.contextualDataProvider = new ContextualDataProvider();
    this.inputValidator = new InputValidator();
  }

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
      const validation = this.inputValidator.validateInput(userMessage);
      if (!validation.isValid) {
        return this.fallbackHandler.getFallbackResponse(validation.error!, sessionContext);
      }

      const sanitizedMessage = this.inputValidator.sanitizeInput(userMessage);

      // Check cache first for identical messages
      const cacheKey = `${sanitizedMessage.toLowerCase()}_${JSON.stringify(sessionContext)}`;
      const cached = this.cacheManager.getCachedResponse(cacheKey);
      
      if (cached) {
        return { text: cached, type: 'text', confidence: 0.9 };
      }

      // Handle repeated fallbacks
      if (this.fallbackHandler.shouldEscalate(sessionContext)) {
        return this.escalationHandler.getEscalationResponse(sessionContext);
      }

      // Try quick response first (fastest)
      const quickResponse = getQuickResponse(sanitizedMessage);
      if (quickResponse) {
        this.cacheManager.cacheResponse(cacheKey, quickResponse);
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
        return this.fallbackHandler.getFallbackResponse('low_confidence', sessionContext);
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
        this.cacheManager.cacheResponse(cacheKey, moduleResponse.text);
        return moduleResponse;
      }

      // Use local AI to generate response with fallback
      let aiResponse;
      try {
        aiResponse = generateAIResponse(aiContext);
      } catch (error) {
        console.warn('AI response generation failed:', error);
        return this.fallbackHandler.getFallbackResponse('ai_error', sessionContext);
      }

      this.cacheManager.cacheResponse(cacheKey, aiResponse);
      
      return {
        text: aiResponse,
        type: 'text',
        confidence: bestIntent.confidence,
        data: this.contextualDataProvider.getContextualData(bestIntent.intent)
      };

    } catch (error) {
      console.error('Critical error in response generation:', error);
      return this.fallbackHandler.getFallbackResponse('critical_error', sessionContext);
    }
  }

  // Clear cache manually if needed
  clearCache(): void {
    this.cacheManager.clearCache();
  }

  // Health check method
  getHealthStatus(): { status: string; cacheSize: number; timestamp: number } {
    return {
      status: 'healthy',
      cacheSize: this.cacheManager.getCacheSize(),
      timestamp: Date.now()
    };
  }
}

// Export singleton instance
export const enhancedAI = EnhancedChatbotAI.getInstance();
