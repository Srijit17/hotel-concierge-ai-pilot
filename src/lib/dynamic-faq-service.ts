
export interface DynamicFAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon?: string;
  lastUpdated?: string;
  priority?: number;
}

export interface FAQApiResponse {
  faqs: DynamicFAQ[];
  lastModified: string;
  version: string;
}

class DynamicFAQService {
  private cache: Map<string, { data: DynamicFAQ[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly API_BASE_URL = '/api/faqs'; // Replace with your actual API endpoint

  async fetchFAQs(): Promise<DynamicFAQ[]> {
    const cacheKey = 'hotel_faqs';
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // For demo purposes, using mock data - replace with actual API call
      const mockData = await this.getMockFAQData();
      
      // Cache the fresh data
      this.cache.set(cacheKey, {
        data: mockData,
        timestamp: Date.now()
      });
      
      return mockData;
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      
      // Return cached data if available, even if expired
      if (cached) {
        return cached.data;
      }
      
      // Fallback to static data
      return this.getFallbackFAQs();
    }
  }

  private async getMockFAQData(): Promise<DynamicFAQ[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        category: 'Check-in',
        question: 'What time is check-in?',
        answer: 'Check-in begins at 2:00 PM. Early check-in is subject to availability.',
        icon: '🕐',
        lastUpdated: new Date().toISOString(),
        priority: 1
      },
      {
        id: '2',
        category: 'Check-out',
        question: 'What time is check-out?',
        answer: 'Check-out time is 11:00 AM. You can request late check-out at extra cost.',
        icon: '🚪',
        lastUpdated: new Date().toISOString(),
        priority: 2
      },
      {
        id: '3',
        category: 'Airport',
        question: 'Do you offer airport pickup?',
        answer: 'Yes, airport pickup is available for ₹800. Please provide your flight number.',
        icon: '✈️',
        lastUpdated: new Date().toISOString(),
        priority: 3
      },
      {
        id: '4',
        category: 'Spa',
        question: 'What are the spa hours?',
        answer: 'Spa operates daily from 9 AM to 9 PM.',
        icon: '💆‍♀️',
        lastUpdated: new Date().toISOString(),
        priority: 4
      },
      {
        id: '5',
        category: 'Swimming Pool',
        question: 'When is the swimming pool open?',
        answer: 'The swimming pool is open from 6 AM to 8 PM.',
        icon: '🏊‍♂️',
        lastUpdated: new Date().toISOString(),
        priority: 5
      },
      {
        id: '6',
        category: 'Suite Price',
        question: 'How much does a suite cost?',
        answer: 'Suites start at ₹8,999 per night including breakfast.',
        icon: '💰',
        lastUpdated: new Date().toISOString(),
        priority: 6
      },
      {
        id: '7',
        category: 'Nearby Food',
        question: 'Are there restaurants nearby?',
        answer: 'Nearby options include Sky Dine (400m), Café Aroma (250m), and Spice Garden (1km).',
        icon: '🍽️',
        lastUpdated: new Date().toISOString(),
        priority: 7
      }
    ];
  }

  private getFallbackFAQs(): DynamicFAQ[] {
    return [
      {
        id: 'fallback-1',
        category: 'General',
        question: 'How can I contact the hotel?',
        answer: 'You can reach us at +1-555-0123 or email us at info@grandluxuryhotel.com',
        icon: '📞',
        lastUpdated: new Date().toISOString(),
        priority: 1
      }
    ];
  }

  // Method to force refresh cache
  async refreshFAQs(): Promise<DynamicFAQ[]> {
    this.cache.clear();
    return this.fetchFAQs();
  }

  // Search FAQs by query
  searchFAQs(faqs: DynamicFAQ[], query: string): DynamicFAQ[] {
    if (!query.trim()) return faqs;
    
    const searchTerm = query.toLowerCase().trim();
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.category.toLowerCase().includes(searchTerm)
    );
  }

  // Group FAQs by category
  groupByCategory(faqs: DynamicFAQ[]): Record<string, DynamicFAQ[]> {
    return faqs.reduce((groups, faq) => {
      const category = faq.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(faq);
      return groups;
    }, {} as Record<string, DynamicFAQ[]>);
  }
}

export const dynamicFAQService = new DynamicFAQService();
