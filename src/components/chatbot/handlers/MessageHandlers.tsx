
import React from 'react';
import { type Message } from '../MessageRenderer';
import { type SessionContext } from '../../../lib/chatbot-ai';
import { addBotMessage, addDepartmentContacts } from '../ChatbotHelpers';
import { enhancedAI } from '../../../lib/enhanced-chatbot-ai';
import { flowManager } from '../../../lib/conversation-flow-manager';
import { detectQueryType, generateCityResponse, generateHeritageResponse, generateServiceResponse } from '../../../lib/enhanced-ai-responses';

export const useMessageHandlers = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  sessionContext: SessionContext,
  setSessionContext: React.Dispatch<React.SetStateAction<SessionContext>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
  isSessionActive: boolean
) => {
  const processUserMessage = React.useCallback(async (userInput: string) => {
    if (!userInput || !isSessionActive) return;

    setIsTyping(true);

    try {
      // Check if this should trigger a conversation flow
      const detectedFlow = flowManager.detectFlowFromInput(userInput);
      
      if (detectedFlow) {
        const sessionId = `session_${Date.now()}`;
        const flow = flowManager.startFlow(detectedFlow, sessionId, { userInput });
        
        if (flow) {
          const currentStep = flowManager.getCurrentStep(flow.id);
          if (currentStep) {
            setTimeout(() => {
              setIsTyping(false);
              
              // Handle special display steps for room booking
              if (detectedFlow === 'room_booking' && currentStep.id === 'room_type_inquiry') {
                addBotMessage(currentStep.prompt, setMessages, 'text');
              } else if (detectedFlow === 'fallback_escalation') {
                addBotMessage(currentStep.prompt, setMessages, 'text');
              } else {
                addBotMessage(currentStep.prompt, setMessages, 'text');
              }
            }, 800);
            return;
          }
        }
      }

      // First check for city, heritage, or service queries
      let queryType;
      try {
        queryType = detectQueryType(userInput);
      } catch (error) {
        console.error('Query type detection error:', error);
        queryType = null;
      }
      
      if (queryType === 'city_info') {
        const cityResponse = generateCityResponse(userInput);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage(cityResponse, setMessages, 'text');
          setTimeout(() => {
            addDepartmentContacts(setMessages);
          }, 1000);
        }, 1000);
        return;
      }
      
      if (queryType === 'heritage') {
        const heritageResponse = generateHeritageResponse(userInput);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage(heritageResponse, setMessages, 'text');
          setTimeout(() => {
            addDepartmentContacts(setMessages);
          }, 1000);
        }, 1000);
        return;
      }
      
      if (queryType === 'service_request') {
        const serviceResponse = generateServiceResponse(userInput);
        if (serviceResponse) {
          setTimeout(() => {
            setIsTyping(false);
            addBotMessage(serviceResponse, setMessages, 'text');
            setTimeout(() => {
              addDepartmentContacts(setMessages);
            }, 1000);
          }, 800);
          return;
        }
      }

      const previousMessages = messages
        .filter(m => m.sender === 'user')
        .slice(-3)
        .map(m => m.content);

      const response = await enhancedAI.generateResponse(
        userInput, 
        sessionContext, 
        previousMessages
      );

      // Update session context
      setSessionContext(prev => ({
        ...prev,
        previousIntents: [...prev.previousIntents.slice(-2), response.type || 'general'],
        fallbackCount: response.confidence < 0.6 ? prev.fallbackCount + 1 : 0
      }));

      // Enhanced response handling with typing delay
      const typingDelay = Math.random() * 800 + 200;
      setTimeout(() => {
        setIsTyping(false);
        
        if (response.confidence < 0.5) {
          addDepartmentContacts(setMessages);
        } else if (response.data?.action === 'show_rooms') {
          // Show actual room data from flow manager
          const availableRooms = flowManager.getAvailableRooms();
          addBotMessage(response.text, setMessages, 'room-cards', {
            rooms: availableRooms
          }, response.confidence);
        } else if (response.data?.action === 'show_amenities') {
          const { amenityServices } = await import('../../../lib/chatbot-data');
          addBotMessage(response.text, setMessages, 'amenity-info', {
            amenities: amenityServices
          }, response.confidence);
        } else if (response.data?.action === 'show_menu') {
          const { menuItems } = await import('../../../lib/chatbot-data');
          addBotMessage(response.text, setMessages, 'menu-items', {
            items: menuItems,
            categorized: true
          }, response.confidence);
        } else if (response.data?.action === 'show_contact_support') {
          addBotMessage(response.text, setMessages, 'text', response.data, response.confidence);
          setTimeout(() => addDepartmentContacts(setMessages), 500);
        } else {
          addBotMessage(response.text, setMessages, response.type, response.data, response.confidence);
        }
        
        // Always add department contacts after any response (with delay)
        setTimeout(() => {
          addDepartmentContacts(setMessages);
        }, 1000);
        
      }, typingDelay);

    } catch (error) {
      console.error('Error processing user message:', error);
      setIsTyping(false);
      addBotMessage(
        "I apologize, but I encountered an error while processing your message. Let me connect you with our support team for immediate assistance.",
        setMessages,
        'error'
      );
      setTimeout(() => addDepartmentContacts(setMessages), 500);
    }
  }, [messages, sessionContext, setSessionContext, setIsTyping, isSessionActive, setMessages]);

  return { processUserMessage };
};
