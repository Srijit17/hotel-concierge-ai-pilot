
export class InputValidator {
  private readonly MAX_MESSAGE_LENGTH = 1000;

  validateInput(userMessage: string): { isValid: boolean; error?: string } {
    if (!userMessage || typeof userMessage !== 'string') {
      return { isValid: false, error: 'invalid_input' };
    }

    const sanitizedMessage = userMessage.trim();
    if (sanitizedMessage.length === 0) {
      return { isValid: false, error: 'empty_input' };
    }

    if (sanitizedMessage.length > this.MAX_MESSAGE_LENGTH) {
      return { isValid: false, error: 'message_too_long' };
    }

    return { isValid: true };
  }

  sanitizeInput(userMessage: string): string {
    return userMessage.trim();
  }
}
