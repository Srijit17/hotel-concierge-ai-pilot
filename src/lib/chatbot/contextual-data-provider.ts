
export class ContextualDataProvider {
  getContextualData(intent: string): any {
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
}
