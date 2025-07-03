
import { type SessionContext } from '../chatbot-ai';

export interface FallbackResponse {
  text: string;
  type: string;
  confidence: number;
  data?: any;
}

export class FallbackHandler {
  private readonly FALLBACK_THRESHOLD = 3;

  getFallbackResponse(reason: string, sessionContext: SessionContext): FallbackResponse {
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

  shouldEscalate(sessionContext: SessionContext): boolean {
    return sessionContext.fallbackCount >= this.FALLBACK_THRESHOLD;
  }
}
