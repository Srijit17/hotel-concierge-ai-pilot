
import { type SessionContext } from './chatbot-ai';

export interface ConversationFlow {
  id: string;
  name: string;
  steps: FlowStep[];
  currentStep: number;
  data: Record<string, any>;
  status: 'active' | 'completed' | 'cancelled' | 'error';
  metadata: {
    startTime: Date;
    lastActivity: Date;
    retryCount: number;
    errorReason?: string;
  };
}

export interface FlowStep {
  id: string;
  name: string;
  type: 'input' | 'choice' | 'confirmation' | 'action' | 'display';
  prompt: string;
  validation?: (input: any) => boolean | string;
  nextStep?: string | ((data: any) => string);
  errorMessage?: string;
  maxRetries?: number;
}

export class ConversationFlowManager {
  private static instance: ConversationFlowManager;
  private activeFlows: Map<string, ConversationFlow> = new Map();
  private flowDefinitions: Map<string, FlowStep[]> = new Map();

  static getInstance(): ConversationFlowManager {
    if (!ConversationFlowManager.instance) {
      ConversationFlowManager.instance = new ConversationFlowManager();
      ConversationFlowManager.instance.initializeFlows();
    }
    return ConversationFlowManager.instance;
  }

  private initializeFlows() {
    // Room Booking Flow
    this.flowDefinitions.set('room_booking', [
      {
        id: 'check_dates',
        name: 'Check-in/Check-out Dates',
        type: 'input',
        prompt: 'What are your check-in and check-out dates?',
        validation: (input) => {
          if (!input || typeof input !== 'string') return 'Please provide valid dates';
          // Add date validation logic
          return true;
        },
        nextStep: 'guest_count',
        errorMessage: 'Please provide valid check-in and check-out dates.',
        maxRetries: 3
      },
      {
        id: 'guest_count',
        name: 'Number of Guests',
        type: 'input',
        prompt: 'How many guests will be staying?',
        validation: (input) => {
          const num = parseInt(input);
          if (isNaN(num) || num < 1 || num > 10) return 'Please enter a number between 1 and 10';
          return true;
        },
        nextStep: 'room_preferences',
        errorMessage: 'Please enter a valid number of guests (1-10).',
        maxRetries: 3
      },
      {
        id: 'room_preferences',
        name: 'Room Preferences',
        type: 'choice',
        prompt: 'What type of room would you prefer?',
        nextStep: 'show_available_rooms',
        maxRetries: 2
      },
      {
        id: 'show_available_rooms',
        name: 'Available Rooms',
        type: 'display',
        prompt: 'Here are the available rooms matching your preferences:',
        nextStep: 'room_selection'
      },
      {
        id: 'room_selection',
        name: 'Room Selection',
        type: 'choice',
        prompt: 'Please select a room:',
        validation: (input) => {
          if (!input || !input.id) return 'Please select a valid room';
          return true;
        },
        nextStep: 'guest_details',
        errorMessage: 'Please select a room from the available options.',
        maxRetries: 3
      },
      {
        id: 'guest_details',
        name: 'Guest Details',
        type: 'input',
        prompt: 'Please provide your contact details:',
        validation: (input) => {
          if (!input.name || !input.email || !input.phone) {
            return 'Please provide your name, email, and phone number';
          }
          return true;
        },
        nextStep: 'booking_confirmation',
        errorMessage: 'Please provide all required contact information.',
        maxRetries: 3
      },
      {
        id: 'booking_confirmation',
        name: 'Booking Confirmation',
        type: 'confirmation',
        prompt: 'Please confirm your booking details:',
        nextStep: 'payment_processing',
        maxRetries: 1
      },
      {
        id: 'payment_processing',
        name: 'Payment Processing',
        type: 'action',
        prompt: 'Processing your payment...',
        nextStep: 'booking_complete'
      },
      {
        id: 'booking_complete',
        name: 'Booking Complete',
        type: 'display',
        prompt: 'Your booking is confirmed! Here are your confirmation details:'
      }
    ]);

    // Spa Booking Flow
    this.flowDefinitions.set('spa_booking', [
      {
        id: 'service_selection',
        name: 'Spa Service Selection',
        type: 'choice',
        prompt: 'Which spa service would you like to book?',
        nextStep: 'date_time_selection',
        maxRetries: 3
      },
      {
        id: 'date_time_selection',
        name: 'Date and Time Selection',
        type: 'input',
        prompt: 'When would you like to schedule your appointment?',
        validation: (input) => {
          if (!input.date || !input.time) return 'Please select both date and time';
          return true;
        },
        nextStep: 'guest_info',
        errorMessage: 'Please select a valid date and time.',
        maxRetries: 3
      },
      {
        id: 'guest_info',
        name: 'Guest Information',
        type: 'input',
        prompt: 'Please provide your contact information:',
        validation: (input) => {
          if (!input.name || !input.phone) return 'Please provide your name and phone number';
          return true;
        },
        nextStep: 'special_requests',
        errorMessage: 'Please provide your name and phone number.',
        maxRetries: 3
      },
      {
        id: 'special_requests',
        name: 'Special Requests',
        type: 'input',
        prompt: 'Any special requests or preferences?',
        nextStep: 'spa_confirmation',
        maxRetries: 1
      },
      {
        id: 'spa_confirmation',
        name: 'Spa Booking Confirmation',
        type: 'confirmation',
        prompt: 'Please confirm your spa appointment:',
        nextStep: 'spa_complete'
      },
      {
        id: 'spa_complete',
        name: 'Spa Booking Complete',
        type: 'display',
        prompt: 'Your spa appointment is confirmed!'
      }
    ]);

    // Room Service Flow
    this.flowDefinitions.set('room_service', [
      {
        id: 'menu_selection',
        name: 'Menu Selection',
        type: 'choice',
        prompt: 'What would you like to order from our menu?',
        nextStep: 'order_customization',
        maxRetries: 3
      },
      {
        id: 'order_customization',
        name: 'Order Customization',
        type: 'input',
        prompt: 'Any special instructions or dietary requirements?',
        nextStep: 'delivery_details',
        maxRetries: 2
      },
      {
        id: 'delivery_details',
        name: 'Delivery Details',
        type: 'input',
        prompt: 'Please provide your room number and preferred delivery time:',
        validation: (input) => {
          if (!input.roomNumber) return 'Please provide your room number';
          return true;
        },
        nextStep: 'order_confirmation',
        errorMessage: 'Please provide a valid room number.',
        maxRetries: 3
      },
      {
        id: 'order_confirmation',
        name: 'Order Confirmation',
        type: 'confirmation',
        prompt: 'Please confirm your room service order:',
        nextStep: 'order_processing'
      },
      {
        id: 'order_processing',
        name: 'Order Processing',
        type: 'action',
        prompt: 'Your order is being prepared...',
        nextStep: 'order_complete'
      },
      {
        id: 'order_complete',
        name: 'Order Complete',
        type: 'display',
        prompt: 'Your order has been confirmed and will be delivered shortly!'
      }
    ]);

    // General Inquiry Flow
    this.flowDefinitions.set('general_inquiry', [
      {
        id: 'inquiry_type',
        name: 'Inquiry Type',
        type: 'choice',
        prompt: 'What would you like to know about?',
        nextStep: (data) => {
          switch (data.inquiryType) {
            case 'amenities': return 'amenities_info';
            case 'services': return 'services_info';
            case 'location': return 'location_info';
            case 'policies': return 'policies_info';
            default: return 'general_info';
          }
        },
        maxRetries: 2
      },
      {
        id: 'amenities_info',
        name: 'Amenities Information',
        type: 'display',
        prompt: 'Here are our available amenities:',
        nextStep: 'follow_up'
      },
      {
        id: 'services_info',
        name: 'Services Information',
        type: 'display',
        prompt: 'Here are our available services:',
        nextStep: 'follow_up'
      },
      {
        id: 'location_info',
        name: 'Location Information',
        type: 'display',
        prompt: 'Here is information about our location:',
        nextStep: 'follow_up'
      },
      {
        id: 'policies_info',
        name: 'Policies Information',
        type: 'display',
        prompt: 'Here are our hotel policies:',
        nextStep: 'follow_up'
      },
      {
        id: 'general_info',
        name: 'General Information',
        type: 'display',
        prompt: 'Here is general information about our hotel:',
        nextStep: 'follow_up'
      },
      {
        id: 'follow_up',
        name: 'Follow-up',
        type: 'choice',
        prompt: 'Is there anything else you would like to know?',
        nextStep: 'inquiry_complete'
      },
      {
        id: 'inquiry_complete',
        name: 'Inquiry Complete',
        type: 'display',
        prompt: 'Thank you for your inquiry! Is there anything else I can help you with?'
      }
    ]);
  }

  // Start a new conversation flow
  startFlow(flowId: string, sessionId: string, initialData: Record<string, any> = {}): ConversationFlow | null {
    try {
      const flowDefinition = this.flowDefinitions.get(flowId);
      if (!flowDefinition) {
        console.error(`Flow definition not found: ${flowId}`);
        return null;
      }

      const flow: ConversationFlow = {
        id: `${flowId}_${sessionId}_${Date.now()}`,
        name: flowId,
        steps: flowDefinition,
        currentStep: 0,
        data: { ...initialData },
        status: 'active',
        metadata: {
          startTime: new Date(),
          lastActivity: new Date(),
          retryCount: 0
        }
      };

      this.activeFlows.set(flow.id, flow);
      return flow;
    } catch (error) {
      console.error('Error starting flow:', error);
      return null;
    }
  }

  // Process user input for active flow
  processFlowInput(flowId: string, userInput: any): {
    success: boolean;
    message: string;
    data?: any;
    nextStep?: FlowStep;
    completed?: boolean;
    error?: string;
  } {
    try {
      const flow = this.activeFlows.get(flowId);
      if (!flow || flow.status !== 'active') {
        return {
          success: false,
          message: 'Flow not found or not active',
          error: 'FLOW_NOT_FOUND'
        };
      }

      const currentStep = flow.steps[flow.currentStep];
      if (!currentStep) {
        return {
          success: false,
          message: 'Invalid flow state',
          error: 'INVALID_STEP'
        };
      }

      // Update last activity
      flow.metadata.lastActivity = new Date();

      // Validate input if validation function exists
      if (currentStep.validation) {
        const validationResult = currentStep.validation(userInput);
        if (validationResult !== true) {
          flow.metadata.retryCount++;
          
          if (flow.metadata.retryCount >= (currentStep.maxRetries || 3)) {
            flow.status = 'error';
            flow.metadata.errorReason = 'Max retries exceeded';
            return {
              success: false,
              message: 'Maximum retry attempts exceeded. Please start over or contact support.',
              error: 'MAX_RETRIES_EXCEEDED'
            };
          }

          return {
            success: false,
            message: typeof validationResult === 'string' ? validationResult : (currentStep.errorMessage || 'Invalid input'),
            error: 'VALIDATION_FAILED'
          };
        }
      }

      // Store the input data
      flow.data[currentStep.id] = userInput;
      flow.metadata.retryCount = 0; // Reset retry count on successful input

      // Determine next step
      let nextStepId: string | undefined;
      if (typeof currentStep.nextStep === 'function') {
        nextStepId = currentStep.nextStep(flow.data);
      } else {
        nextStepId = currentStep.nextStep;
      }

      // Find next step index
      let nextStepIndex = -1;
      if (nextStepId) {
        nextStepIndex = flow.steps.findIndex(step => step.id === nextStepId);
      }

      // Check if flow is complete
      if (nextStepIndex === -1 || flow.currentStep >= flow.steps.length - 1) {
        flow.status = 'completed';
        return {
          success: true,
          message: 'Flow completed successfully',
          data: flow.data,
          completed: true
        };
      }

      // Move to next step
      flow.currentStep = nextStepIndex;
      const nextStep = flow.steps[flow.currentStep];

      return {
        success: true,
        message: nextStep.prompt,
        data: flow.data,
        nextStep: nextStep
      };

    } catch (error) {
      console.error('Error processing flow input:', error);
      return {
        success: false,
        message: 'An error occurred while processing your input',
        error: 'PROCESSING_ERROR'
      };
    }
  }

  // Get current step for a flow
  getCurrentStep(flowId: string): FlowStep | null {
    try {
      const flow = this.activeFlows.get(flowId);
      if (!flow || flow.status !== 'active') return null;

      return flow.steps[flow.currentStep] || null;
    } catch (error) {
      console.error('Error getting current step:', error);
      return null;
    }
  }

  // Cancel a flow
  cancelFlow(flowId: string): boolean {
    try {
      const flow = this.activeFlows.get(flowId);
      if (!flow) return false;

      flow.status = 'cancelled';
      return true;
    } catch (error) {
      console.error('Error cancelling flow:', error);
      return false;
    }
  }

  // Get all active flows for a session
  getActiveFlows(sessionId: string): ConversationFlow[] {
    try {
      return Array.from(this.activeFlows.values()).filter(
        flow => flow.id.includes(sessionId) && flow.status === 'active'
      );
    } catch (error) {
      console.error('Error getting active flows:', error);
      return [];
    }
  }

  // Cleanup expired flows
  cleanupExpiredFlows(maxAgeMinutes: number = 30): void {
    try {
      const now = new Date();
      const expiredFlows: string[] = [];

      for (const [flowId, flow] of this.activeFlows.entries()) {
        const ageMinutes = (now.getTime() - flow.metadata.lastActivity.getTime()) / (1000 * 60);
        if (ageMinutes > maxAgeMinutes) {
          expiredFlows.push(flowId);
        }
      }

      expiredFlows.forEach(flowId => {
        const flow = this.activeFlows.get(flowId);
        if (flow) {
          flow.status = 'cancelled';
          flow.metadata.errorReason = 'Expired due to inactivity';
        }
        this.activeFlows.delete(flowId);
      });

      if (expiredFlows.length > 0) {
        console.log(`Cleaned up ${expiredFlows.length} expired flows`);
      }
    } catch (error) {
      console.error('Error cleaning up expired flows:', error);
    }
  }

  // Get flow statistics
  getFlowStats(): {
    totalFlows: number;
    activeFlows: number;
    completedFlows: number;
    cancelledFlows: number;
    errorFlows: number;
  } {
    try {
      const flows = Array.from(this.activeFlows.values());
      return {
        totalFlows: flows.length,
        activeFlows: flows.filter(f => f.status === 'active').length,
        completedFlows: flows.filter(f => f.status === 'completed').length,
        cancelledFlows: flows.filter(f => f.status === 'cancelled').length,
        errorFlows: flows.filter(f => f.status === 'error').length
      };
    } catch (error) {
      console.error('Error getting flow stats:', error);
      return {
        totalFlows: 0,
        activeFlows: 0,
        completedFlows: 0,
        cancelledFlows: 0,
        errorFlows: 0
      };
    }
  }
}

export const flowManager = ConversationFlowManager.getInstance();
