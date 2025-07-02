
export interface UserSessionData {
  messageCount: number;
  sessionDuration: number;
  intentsDetected: string[];
  userSatisfaction: number;
  interactions: InteractionData[];
  preferences: UserPreferences;
}

export interface InteractionData {
  timestamp: Date;
  type: 'click' | 'selection' | 'input' | 'rating' | 'feedback';
  elementId: string;
  value: any;
  context: string;
}

export interface UserPreferences {
  roomType?: string;
  priceRange?: [number, number];
  amenities?: string[];
  dietaryRestrictions?: string[];
  communicationStyle?: 'formal' | 'casual' | 'friendly';
  language?: string;
}

export interface HotelMetrics {
  occupancyRate: number;
  avgResponseTime: number;
  popularServices: string[];
  peakHours: string[];
  customerSatisfactionScore: number;
  conversionRate: number;
}

export class InteractiveDataManager {
  private static instance: InteractiveDataManager;
  private sessionData: UserSessionData;
  private hotelMetrics: HotelMetrics;
  private analyticsBuffer: InteractionData[] = [];

  constructor() {
    this.sessionData = {
      messageCount: 0,
      sessionDuration: 0,
      intentsDetected: [],
      userSatisfaction: 0.8,
      interactions: [],
      preferences: {}
    };

    this.hotelMetrics = {
      occupancyRate: 78,
      avgResponseTime: 450,
      popularServices: ['Room Service', 'Spa Treatment', 'Pool Access', 'Gym Access'],
      peakHours: ['10:00-12:00', '14:00-16:00', '19:00-21:00'],
      customerSatisfactionScore: 4.2,
      conversionRate: 0.65
    };
  }

  static getInstance(): InteractiveDataManager {
    if (!InteractiveDataManager.instance) {
      InteractiveDataManager.instance = new InteractiveDataManager();
    }
    return InteractiveDataManager.instance;
  }

  // Track user interactions
  trackInteraction(interaction: Omit<InteractionData, 'timestamp'>) {
    const fullInteraction: InteractionData = {
      ...interaction,
      timestamp: new Date()
    };

    this.sessionData.interactions.push(fullInteraction);
    this.analyticsBuffer.push(fullInteraction);

    // Update session metrics
    this.updateSessionMetrics(fullInteraction);

    // Batch process analytics every 10 interactions
    if (this.analyticsBuffer.length >= 10) {
      this.processAnalytics();
    }
  }

  // Update user preferences based on interactions
  updatePreferences(newPreferences: Partial<UserPreferences>) {
    this.sessionData.preferences = {
      ...this.sessionData.preferences,
      ...newPreferences
    };
  }

  // Get personalized suggestions based on user data
  getPersonalizedSuggestions(): any[] {
    const suggestions = [];
    const { preferences, interactions } = this.sessionData;

    // Price-based suggestions
    if (preferences.priceRange) {
      const [min, max] = preferences.priceRange;
      if (max < 200) {
        suggestions.push({
          id: 'budget_friendly',
          title: 'Budget-friendly rooms available!',
          description: `Found rooms starting at $${min} per night`,
          action: 'show_budget_rooms',
          priority: 'high'
        });
      }
    }

    // Interaction-based suggestions
    const recentInteractions = interactions.slice(-5);
    const commonActions = recentInteractions
      .map(i => i.context)
      .reduce((acc: Record<string, number>, context) => {
        acc[context] = (acc[context] || 0) + 1;
        return acc;
      }, {});

    // Suggest related services
    if (commonActions['room_service'] > 1) {
      suggestions.push({
        id: 'dining_upgrade',
        title: 'Upgrade your dining experience',
        description: 'Add breakfast or dinner package',
        action: 'show_dining_packages',
        priority: 'medium'
      });
    }

    return suggestions.sort((a, b) => 
      a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0
    );
  }

  // Generate interactive elements based on context
  generateInteractiveElements(context: string): any[] {
    const elements = [];

    switch (context) {
      case 'room_booking':
        elements.push({
          id: 'room_rating',
          type: 'rating',
          title: 'Rate your room preference',
          data: {}
        });
        elements.push({
          id: 'check_in_date',
          type: 'calendar',
          title: 'Select check-in date',
          data: {}
        });
        break;

      case 'food_service':
        elements.push({
          id: 'dietary_preference',
          type: 'quick-reply',
          title: 'Any dietary preferences?',
          data: {
            options: ['Vegetarian', 'Vegan', 'Gluten-Free', 'No Restrictions']
          }
        });
        break;

      case 'amenities':
        elements.push({
          id: 'amenity_preference',
          type: 'preference',
          title: 'What interests you most?',
          data: {
            preferences: ['Spa & Wellness', 'Fitness', 'Dining', 'Entertainment']
          }
        });
        break;
    }

    return elements;
  }

  // Get real-time insights
  getRealTimeInsights(): any {
    return {
      sessionData: this.sessionData,
      hotelMetrics: this.hotelMetrics,
      trends: this.calculateTrends(),
      recommendations: this.getPersonalizedSuggestions()
    };
  }

  private updateSessionMetrics(interaction: InteractionData) {
    // Update satisfaction based on interaction type
    if (interaction.type === 'rating' && typeof interaction.value === 'number') {
      this.sessionData.userSatisfaction = 
        (this.sessionData.userSatisfaction + interaction.value / 5) / 2;
    }

    // Track intent patterns
    if (interaction.context && !this.sessionData.intentsDetected.includes(interaction.context)) {
      this.sessionData.intentsDetected.push(interaction.context);
    }
  }

  private processAnalytics() {
    // Process buffered analytics
    console.log('Processing analytics batch:', this.analyticsBuffer.length, 'interactions');
    
    // Update hotel metrics based on user behavior
    this.updateHotelMetrics();
    
    // Clear buffer
    this.analyticsBuffer = [];
  }

  private updateHotelMetrics() {
    // Simulate dynamic metric updates
    this.hotelMetrics.avgResponseTime = Math.max(300, this.hotelMetrics.avgResponseTime - 10);
    this.hotelMetrics.customerSatisfactionScore = 
      Math.min(5, this.sessionData.userSatisfaction * 5);
  }

  private calculateTrends(): any {
    const recentInteractions = this.sessionData.interactions.slice(-10);
    
    return {
      mostUsedFeatures: recentInteractions
        .map(i => i.context)
        .reduce((acc: Record<string, number>, context) => {
          acc[context] = (acc[context] || 0) + 1;
          return acc;
        }, {}),
      engagementLevel: recentInteractions.length > 5 ? 'high' : 'medium',
      sessionQuality: this.sessionData.userSatisfaction > 0.7 ? 'excellent' : 'good'
    };
  }

  // Public getters
  getSessionData(): UserSessionData {
    return { ...this.sessionData };
  }

  getHotelMetrics(): HotelMetrics {
    return { ...this.hotelMetrics };
  }

  // Update session duration
  updateSessionDuration(duration: number) {
    this.sessionData.sessionDuration = duration;
  }

  // Increment message count
  incrementMessageCount() {
    this.sessionData.messageCount++;
  }
}

export const dataManager = InteractiveDataManager.getInstance();
