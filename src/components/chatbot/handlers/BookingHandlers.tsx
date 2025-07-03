
import React from 'react';
import { type Message } from '../MessageRenderer';
import { type BookingState } from '../ChatbotTypes';
import { addBotMessage, addDepartmentContacts } from '../ChatbotHelpers';
import { flowManager } from '../../../lib/conversation-flow-manager';

export const useBookingHandlers = (
  bookingState: BookingState,
  setBookingState: React.Dispatch<React.SetStateAction<BookingState>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const handleBookingFlow = React.useCallback((step: string, data?: any) => {
    try {
      switch (step) {
        case 'start_booking':
          // Start the conversation flow
          const sessionId = `session_${Date.now()}`;
          const flow = flowManager.startFlow('room_booking', sessionId);
          
          if (flow) {
            const currentStep = flowManager.getCurrentStep(flow.id);
            if (currentStep) {
              addBotMessage(currentStep.prompt, setMessages, 'text');
            }
          } else {
            // Fallback to old booking flow
            setBookingState({ step: 'room_selection' });
            const availableRooms = flowManager.getAvailableRooms();
            
            addBotMessage("Perfect! Let me show you our available luxury accommodations:", setMessages, 'room-cards', {
              rooms: availableRooms
            });
          }
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
          
        case 'show_room_upgrades':
          if (!data || !data.roomId) {
            addBotMessage("Please select a room first to see upgrade options.", setMessages, 'error');
            return;
          }
          
          const upgrades = flowManager.getRoomUpgrades(data.roomId);
          if (upgrades.length === 0) {
            addBotMessage("Your selected room is already our premium option! No upgrades available.", setMessages, 'text');
          } else {
            addBotMessage("Here are the available upgrades for your room:", setMessages, 'room-cards', {
              rooms: upgrades,
              isUpgrade: true,
              originalRoomId: data.roomId
            });
          }
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
