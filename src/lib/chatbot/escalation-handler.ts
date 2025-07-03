
import { type SessionContext } from '../chatbot-ai';

export interface EscalationResponse {
  text: string;
  type: string;
  confidence: number;
  data?: any;
}

export class EscalationHandler {
  getEscalationResponse(sessionContext: SessionContext): EscalationResponse {
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
}
