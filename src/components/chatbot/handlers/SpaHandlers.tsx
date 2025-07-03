
import React from 'react';
import { type Message } from '../MessageRenderer';
import { addBotMessage, addDepartmentContacts } from '../ChatbotHelpers';
import { amenityServices } from '../../../lib/chatbot-data';

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
