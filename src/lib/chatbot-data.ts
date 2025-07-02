// Enhanced Intent Training Data with Spell Correction
export const intentTrainingData = {
  'GreetGuest': {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'greetings', 'good day', 'helo', 'hii', 'gud morning'],
    confidence: 0.95,
    weight: 1,
    module: 'general'
  },
  'CheckRoomAvailability': {
    patterns: ['room', 'available', 'vacancy', 'free', 'tonight', 'tomorrow', 'weekend', 'suite', 'king', 'queen', 'double', 'single', 'view', 'balcony', 'ocean', 'check availability', 'any rooms', 'book', 'reserve', 'availabel', 'rom', 'sute'],
    confidence: 0.92,
    weight: 2,
    module: 'booking'
  },
  'BookRoom': {
    patterns: ['book', 'reserve', 'reservation', 'confirm booking', 'take it', 'yes book', 'proceed', 'confirm', 'make reservation', 'i want', 'ill take', 'bok', 'resrve', 'reservaton'],
    confidence: 0.94,
    weight: 3,
    module: 'booking'
  },
  'ViewBooking': {
    patterns: ['my booking', 'booking details', 'reservation details', 'booking info', 'check booking', 'view booking', 'booking status', 'my reservation', 'boking', 'bokking'],
    confidence: 0.93,
    weight: 3,
    module: 'booking'
  },
  'ModifyBooking': {
    patterns: ['change booking', 'modify reservation', 'update booking', 'edit reservation', 'change dates', 'modify dates', 'chaneg', 'modfy'],
    confidence: 0.91,
    weight: 3,
    module: 'booking'
  },
  'RequestRoomService': {
    patterns: ['room service', 'food', 'order', 'breakfast', 'lunch', 'dinner', 'menu', 'hungry', 'eat', 'drink', 'coffee', 'tea', 'sandwich', 'meal', 'deliver', 'fodr', 'manu', 'hungri', 'brekfast'],
    confidence: 0.90,
    weight: 2,
    module: 'food'
  },
  'ModifyFoodOrder': {
    patterns: ['change order', 'modify order', 'cancel order', 'add to order', 'remove from order', 'edit order', 'update order', 'chaneg order', 'modfy order'],
    confidence: 0.88,
    weight: 3,
    module: 'food'
  },
  'AskAboutAmenities': {
    patterns: ['gym', 'pool', 'spa', 'amenities', 'facilities', 'wifi', 'fitness', 'swimming', 'restaurant', 'bar', 'parking', 'concierge', 'business center', 'laundry', 'dry cleaning', 'amnities', 'facilitis', 'swiming'],
    confidence: 0.88,
    weight: 2,
    module: 'amenity'
  },
  'AddAmenity': {
    patterns: ['add amenity', 'book spa', 'book massage', 'reserve gym', 'add service', 'book service', 'ad amenity', 'bok spa', 'masage'],
    confidence: 0.89,
    weight: 3,
    module: 'amenity'
  },
  'RequestLateCheckout': {
    patterns: ['late checkout', 'extend', 'checkout time', 'stay longer', 'more time', 'check out later', 'until', 'extra hours', 'lat checkout', 'extnd'],
    confidence: 0.87,
    weight: 3,
    module: 'booking'
  },
  'CancelReservation': {
    patterns: ['cancel', 'cancellation', 'remove booking', 'delete reservation', 'cant make it', 'need to cancel', 'cancel my', 'cansel', 'cancelation'],
    confidence: 0.95,
    weight: 4,
    module: 'booking'
  },
  'PaymentInquiry': {
    patterns: ['payment', 'pay', 'bill', 'cost', 'price', 'total', 'charge', 'invoice', 'receipt', 'paymnt', 'bil', 'pric'],
    confidence: 0.90,
    weight: 3,
    module: 'payment'
  },
  'FAQ': {
    patterns: ['policy', 'rules', 'pet', 'smoking', 'cancellation policy', 'check-in time', 'check-out time', 'parking', 'dress code', 'children', 'age limit', 'wifi password', 'breakfast time', 'polcy', 'ruls'],
    confidence: 0.86,
    weight: 2,
    module: 'faq'
  },
  'Complaints': {
    patterns: ['problem', 'issue', 'broken', 'not working', 'dirty', 'noisy', 'cold', 'hot', 'complaint', 'wrong', 'bad', 'terrible', 'awful', 'disappointed', 'problm', 'isue', 'brokn'],
    confidence: 0.91,
    weight: 4,
    module: 'support'
  },
  'SpeakToHuman': {
    patterns: ['human', 'person', 'agent', 'staff', 'concierge', 'manager', 'help', 'talk to someone', 'real person', 'transfer', 'connect', 'huamn', 'persn', 'manger'],
    confidence: 0.93,
    weight: 3,
    module: 'support'
  },
  'ThankYou': {
    patterns: ['thank', 'thanks', 'appreciate', 'grateful', 'perfect', 'great', 'awesome', 'wonderful', 'excellent', 'thnk', 'thanx', 'grat'],
    confidence: 0.85,
    weight: 1,
    module: 'general'
  }
};

// FAQ Database
export const faqDatabase = {
  'check-in': {
    question: 'What time is check-in?',
    answer: 'Check-in is from 3:00 PM onwards. Early check-in is available subject to room availability.',
    keywords: ['check-in', 'checkin', 'arrival', 'early check-in']
  },
  'check-out': {
    question: 'What time is check-out?',
    answer: 'Check-out is until 11:00 AM. Late check-out can be arranged for an additional fee.',
    keywords: ['check-out', 'checkout', 'departure', 'late checkout']
  },
  'cancellation': {
    question: 'What is the cancellation policy?',
    answer: 'Free cancellation up to 24 hours before check-in. Cancellations within 24 hours incur a one-night charge.',
    keywords: ['cancel', 'cancellation', 'refund', 'policy']
  },
  'wifi': {
    question: 'Is WiFi available?',
    answer: 'Complimentary high-speed WiFi is available throughout the hotel. Password: GrandLuxury2024',
    keywords: ['wifi', 'internet', 'password', 'connection']
  },
  'breakfast': {
    question: 'What are breakfast hours?',
    answer: 'Breakfast is served from 6:30 AM to 10:30 AM daily. Continental and à la carte options available.',
    keywords: ['breakfast', 'dining', 'hours', 'morning']
  },
  'parking': {
    question: 'Is parking available?',
    answer: 'Complimentary valet parking is available for all guests. Self-parking is also available.',
    keywords: ['parking', 'valet', 'car', 'vehicle']
  },
  'pets': {
    question: 'Are pets allowed?',
    answer: 'We welcome pets with advance notice. Pet fee is $50 per night. Service animals are always welcome.',
    keywords: ['pets', 'dogs', 'cats', 'animals', 'pet policy']
  },
  'smoking': {
    question: 'Is smoking allowed?',
    answer: 'Our hotel is completely non-smoking. Designated smoking areas are available on the terrace.',
    keywords: ['smoking', 'smoke', 'cigarettes', 'non-smoking']
  }
};

// Department Contact Information
export const departmentContacts = {
  'booking': {
    name: 'Reservations & Booking',
    phone: '+1 (555) 123-4567',
    email: 'reservations@grandluxury.com',
    hours: '24/7',
    description: 'Room bookings, modifications, cancellations'
  },
  'food': {
    name: 'Room Service & Dining',
    phone: '+1 (555) 123-4568',
    email: 'roomservice@grandluxury.com',
    hours: '24/7',
    description: 'Food orders, dietary requirements, dining reservations'
  },
  'amenity': {
    name: 'Spa & Amenities',
    phone: '+1 (555) 123-4569',
    email: 'spa@grandluxury.com',
    hours: '6 AM - 10 PM',
    description: 'Spa bookings, fitness center, pool services'
  },
  'payment': {
    name: 'Billing & Payments',
    phone: '+1 (555) 123-4570',
    email: 'billing@grandluxury.com',
    hours: '9 AM - 6 PM',
    description: 'Payment issues, billing inquiries, refunds'
  },
  'support': {
    name: 'Guest Relations',
    phone: '+1 (555) 123-4571',
    email: 'support@grandluxury.com',
    hours: '24/7',
    description: 'General assistance, complaints, special requests'
  },
  'concierge': {
    name: 'Concierge Services',
    phone: '+1 (555) 123-4572',
    email: 'concierge@grandluxury.com',
    hours: '6 AM - 11 PM',
    description: 'Local recommendations, transportation, event planning'
  }
};

// Sample menu items
export const menuItems = [
  { id: '1', name: 'Continental Breakfast', price: 25, category: 'Breakfast', description: 'Fresh pastries, fruits, coffee' },
  { id: '2', name: 'Grilled Salmon', price: 35, category: 'Main Course', description: 'Atlantic salmon with vegetables' },
  { id: '3', name: 'Caesar Salad', price: 18, category: 'Salads', description: 'Classic caesar with parmesan' },
  { id: '4', name: 'Chocolate Cake', price: 12, category: 'Desserts', description: 'Rich chocolate layer cake' }
];

// Sample amenity services
export const amenityServices = [
  { id: '1', name: 'Spa Massage', category: 'Spa', price: 120, duration: '60 min', description: 'Relaxing full body massage', availability: '9 AM - 8 PM' },
  { id: '2', name: 'Pool Access', category: 'Recreation', price: 0, duration: 'All day', description: 'Rooftop infinity pool', availability: '6 AM - 10 PM' },
  { id: '3', name: 'Fitness Center', category: 'Fitness', price: 0, duration: 'All day', description: 'State-of-the-art gym', availability: '24/7' },
  { id: '4', name: 'Business Center', category: 'Business', price: 15, duration: '1 hour', description: 'Printing and meeting rooms', availability: '6 AM - 10 PM' }
];