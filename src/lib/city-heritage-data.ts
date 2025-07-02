
// City and Hotel Heritage Data
export const cityData = {
  kashmir: {
    name: "Kashmir - Paradise on Earth",
    overview: "Kashmir, often called 'Paradise on Earth', is renowned for its breathtaking landscapes, snow-capped mountains, pristine lakes, and vibrant culture. The region offers stunning views of the Himalayas, beautiful Dal Lake with its floating gardens, and the famous Mughal gardens.",
    attractions: [
      "Dal Lake with houseboats and shikaras",
      "Gulmarg - Asia's highest golf course and skiing destination", 
      "Pahalgam - Valley of Shepherds with pristine meadows",
      "Sonamarg - Meadow of Gold with glaciers",
      "Mughal Gardens - Shalimar Bagh, Nishat Bagh",
      "Shankaracharya Temple with panoramic valley views"
    ],
    bestTime: "April to October for pleasant weather, December to February for snow activities",
    culture: "Rich blend of Hindu, Buddhist, and Islamic traditions with famous Kashmiri handicrafts, carpets, and cuisine"
  },
  kolkata: {
    name: "Kolkata - The City of Joy",
    overview: "Kolkata, the cultural capital of India, is known for its rich literary heritage, art, music, and intellectual discourse. The city beautifully blends colonial architecture with vibrant street culture, making it a unique destination for culture enthusiasts.",
    attractions: [
      "Victoria Memorial - Iconic marble monument",
      "Howrah Bridge - Engineering marvel over Hooghly River",
      "Dakshineswar Kali Temple - Sacred Hindu temple",
      "Indian Museum - Oldest and largest museum in India",
      "Park Street - Hub of restaurants and nightlife",
      "Kalighat Temple - Ancient Kali temple",
      "Science City - Interactive science museum"
    ],
    bestTime: "October to March for pleasant weather",
    culture: "Home to Nobel laureates, renowned for literature, cinema, music, and the famous Durga Puja festival"
  }
};

export const hotelHeritage = {
  name: "The Grand Luxury Hotel",
  established: "1925",
  heritage: "Nearly a century of hospitality excellence, The Grand Luxury Hotel has been a landmark of refined elegance and world-class service. Originally built during the British colonial era, our hotel has hosted royalty, diplomats, and distinguished guests from around the world.",
  architecture: "Our hotel features a magnificent blend of colonial and contemporary architecture, with marble lobbies, crystal chandeliers, and heritage suites that tell stories of a bygone era.",
  awards: [
    "World's Leading Luxury Hotel - 2023",
    "Heritage Hotel of the Year - 2022",
    "Best Customer Service Award - 2021, 2022, 2023",
    "Sustainable Tourism Award - 2023"
  ],
  uniqueFeatures: [
    "Original 1925 grand staircase with Italian marble",
    "Heritage library with rare books and manuscripts",
    "Vintage wine cellar with collections dating back to 1930s",
    "Presidential suite where 3 Nobel laureates have stayed",
    "Rooftop garden with 100-year-old banyan tree",
    "Museum showcasing hotel's history and antique collections"
  ],
  famousGuests: [
    "Members of royal families from Europe and Asia",
    "Hollywood celebrities and Bollywood stars",
    "Nobel Prize winners in Literature and Peace",
    "Former Prime Ministers and Presidents",
    "Renowned artists and musicians"
  ]
};

export const commonGuestQueries = {
  roomService: {
    queries: [
      "room service menu",
      "order food to room",
      "breakfast delivery time",
      "room service hours",
      "dietary restrictions menu",
      "kids meal options"
    ],
    responses: {
      menu: "Our 24/7 room service offers Continental, Indian, Chinese, and Italian cuisines. Would you like me to show you our menu?",
      hours: "Room service is available 24/7. Delivery typically takes 20-30 minutes.",
      dietary: "We offer vegetarian, vegan, gluten-free, and diabetic-friendly options. Please let me know your requirements."
    }
  },
  maintenanceIssues: {
    queries: [
      "geyser not working",
      "hot water not coming",
      "air conditioning problem",
      "tv not working",
      "wifi not working",
      "bathroom issues",
      "room heater problem",
      "lights not working"
    ],
    responses: {
      geyser: "I'm sorry about the hot water issue. I'll immediately connect you with our maintenance team. They'll be at your room within 10-15 minutes to fix this.",
      ac: "I apologize for the air conditioning problem. Our technical team will visit your room right away to resolve this issue.",
      wifi: "For WiFi issues, please try reconnecting with password: GrandLuxury2024. If the problem persists, I'll send our IT team to assist you.",
      general: "I understand this is inconvenient. I'm prioritizing your request and our maintenance team will be with you shortly."
    }
  },
  amenityRequests: {
    queries: [
      "need extra towels",
      "no soap in bathroom",
      "need extra pillows",
      "blanket request",
      "need hangers",
      "iron and ironing board",
      "hair dryer not working",
      "need extra bed sheets",
      "toilet paper finished",
      "need room slippers"
    ],
    responses: {
      towels: "I'll send housekeeping with fresh towels to your room within 10 minutes.",
      soap: "I apologize for this oversight. Housekeeping will bring fresh amenities including soap, shampoo, and conditioner right away.",
      pillows: "I'll arrange for extra pillows to be delivered to your room immediately.",
      general: "I'll coordinate with housekeeping to bring the requested items to your room within 10-15 minutes."
    }
  },
  conciergeServices: {
    queries: [
      "local attractions",
      "transportation booking",
      "restaurant recommendations",
      "shopping areas",
      "tourist guide",
      "car rental",
      "airport pickup",
      "laundry service"
    ],
    responses: {
      attractions: "I'd be happy to recommend local attractions! Are you interested in historical sites, nature spots, shopping, or cultural experiences?",
      transport: "We offer airport transfers, car rentals, and can arrange local transportation. What would you prefer?",
      restaurants: "We have excellent restaurant recommendations both within the hotel and nearby. What cuisine are you in the mood for?"
    }
  }
};
