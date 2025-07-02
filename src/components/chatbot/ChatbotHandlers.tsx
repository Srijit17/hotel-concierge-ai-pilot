
import React from 'react';
import { type Message } from './MessageRenderer';
import { type UserContext, type BookingState } from './ChatbotTypes';
import { addBotMessage, addDepartmentContacts } from './ChatbotHelpers';
import { enhancedAI } from '../../lib/enhanced-chatbot-ai';
import { type SessionContext } from '../../lib/chatbot-ai';
import { menuItems, amenityServices } from '../../lib/chatbot-data';
import { generateCityResponse, generateHeritageResponse, generateServiceResponse, detectQueryType } from '../../lib/enhanced-ai-responses';
import { dataManager } from '../../lib/interactive-data-manager';
import { generateCorrectionSuggestions } from './IntentCorrectionEngine';

export const useBookingHandlers = (
  bookingState: BookingState,
  setBookingState: React.Dispatch<React.SetStateAction<BookingState>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const handleBookingFlow = React.useCallback((step: string, data?: any) => {
    try {
      switch (step) {
        case 'start_booking':
          setBookingState({ step: 'room_selection' });
          const availableRooms = [
            { 
              id: '1', 
              name: 'Deluxe Mountain View', 
              type: 'deluxe', 
              price_per_night: 250, 
              features: ['Mountain View', 'Free WiFi', 'Mini Bar', 'Balcony'], 
              max_guests: 2, 
              image_url: '/placeholder.svg', 
              available: true 
            },
            { 
              id: '2', 
              name: 'Heritage Suite', 
              type: 'suite', 
              price_per_night: 400, 
              features: ['Heritage Decor', 'Separate Living Area', 'Jacuzzi', 'Butler Service'], 
              max_guests: 4, 
              image_url: '/placeholder.svg', 
              available: true 
            },
            { 
              id: '3', 
              name: 'Royal Presidential Suite', 
              type: 'presidential', 
              price_per_night: 750, 
              features: ['Panoramic City View', 'Private Terrace', 'Butler Service', 'Dining Room'], 
              max_guests: 6, 
              image_url: '/placeholder.svg', 
              available: true 
            }
          ];
          
          addBotMessage("Perfect! Let me show you our available luxury accommodations:", setMessages, 'room-cards', {
            rooms: availableRooms
          });
          break;
          
        case 'room_selected':
          if (!data) {
            addBotMessage("I'm sorry, there was an issue with your room selection. Please try again.", setMessages, 'error');
            return;
          }
          setBookingState({ step: 'guest_details', selectedRoom: data });
          addBotMessage(
            `Excellent choice! The ${data.name} is perfect for your stay. Now please provide your booking details:`,
            setMessages,
            'booking-form',
            { room: data }
          );
          break;
          
        case 'booking_confirmed':
          if (!data || !bookingState.selectedRoom) {
            addBotMessage("I'm sorry, there was an issue processing your booking. Please try again.", setMessages, 'error');
            return;
          }
          setBookingState({ step: 'completed', ...bookingState, guestDetails: data });
          const nights = 2;
          const total = bookingState.selectedRoom?.price_per_night * nights;
          
          addBotMessage(
            `🎉 Congratulations! Your booking is confirmed. Here's your confirmation:`,
            setMessages,
            'booking-confirmation',
            {
              booking: {
                bookingNumber: `GRD${Date.now().toString().slice(-6)}`,
                room: bookingState.selectedRoom,
                guest: data,
                total: total
              }
            }
          );
          
          setTimeout(() => {
            addBotMessage(
              "Now that your room is booked, would you like to explore our dining options and spa services?",
              setMessages,
              'post-booking-services'
            );
          }, 2000);
          break;

        default:
          addBotMessage("I'm not sure how to help with that booking request. Let me connect you with our reservations team.", setMessages, 'error');
          setTimeout(() => addDepartmentContacts(setMessages), 1000);
      }
    } catch (error) {
      console.error('Booking flow error:', error);
      addBotMessage("I encountered an error while processing your booking. Let me connect you with our reservations team.", setMessages, 'error');
      setTimeout(() => addDepartmentContacts(setMessages), 1000);
    }
  }, [bookingState, setBookingState, setMessages]);

  return { handleBookingFlow };
};

export const useSpaHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const handleSpaBookingFlow = React.useCallback((step: string, data?: any) => {
    try {
      switch (step) {
        case 'show_spa_amenities':
          const spaServices = amenityServices.filter(service => service.category === 'Spa');
          if (spaServices.length === 0) {
            addBotMessage("I'm sorry, our spa services are currently being updated. Please contact our spa directly.", setMessages, 'error');
            return;
          }
          addBotMessage("Here are our luxurious spa treatments:", setMessages, 'spa-amenities', {
            amenities: spaServices
          });
          break;
          
        case 'book_spa_treatment':
          const availableTreatments = amenityServices.filter(service => service.category === 'Spa');
          if (availableTreatments.length === 0) {
            addBotMessage("I'm sorry, spa bookings are currently unavailable. Please contact our spa directly.", setMessages, 'error');
            return;
          }
          addBotMessage("I'd be delighted to help you book a spa treatment! Please select your preferred service:", setMessages, 'spa-booking', {
            amenities: availableTreatments
          });
          break;
          
        case 'spa_treatment_selected':
          if (!data) {
            addBotMessage("I'm sorry, there was an issue selecting your spa treatment. Please try again.", setMessages, 'error');
            return;
          }
          addBotMessage(`Perfect choice! ${data.name} is one of our most popular treatments. Please select your preferred time slot:`, setMessages, 'spa-time-slots', {
            service: data,
            timeSlots: [
              { time: '10:00 AM', available: true },
              { time: '12:00 PM', available: true },
              { time: '2:00 PM', available: false },
              { time: '4:00 PM', available: true },
              { time: '6:00 PM', available: true }
            ]
          });
          break;
          
        case 'spa_time_selected':
          if (!data) {
            addBotMessage("I'm sorry, there was an issue with your time selection. Please try again.", setMessages, 'error');
            return;
          }
          addBotMessage(`Excellent! Your ${data.service.name} is booked for ${data.timeSlot}. Would you like to proceed with payment?`, setMessages, 'spa-payment', {
            booking: data
          });
          break;

        default:
          addBotMessage("I'm not sure how to help with that spa request. Let me connect you with our spa team.", setMessages, 'error');
          setTimeout(() => addDepartmentContacts(setMessages), 1000);
      }
    } catch (error) {
      console.error('Spa booking flow error:', error);
      addBotMessage("I encountered an error while processing your spa booking. Let me connect you with our spa team.", setMessages, 'error');
      setTimeout(() => addDepartmentContacts(setMessages), 1000);
    }
  }, [setMessages]);

  return { handleSpaBookingFlow };
};

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
          addBotMessage(response.text, setMessages, 'room-cards', {
            rooms: response.data.rooms
          }, response.confidence);
        } else if (response.data?.action === 'show_amenities') {
          addBotMessage(response.text, setMessages, 'amenity-info', {
            amenities: amenityServices
          }, response.confidence);
        } else if (response.data?.action === 'show_menu') {
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
