
import { cityData, hotelHeritage, commonGuestQueries } from './city-heritage-data';

export const generateCityResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('kashmir')) {
    const kashmir = cityData.kashmir;
    return `🏔️ **${kashmir.name}**\n\n${kashmir.overview}\n\n**Must-Visit Attractions:**\n${kashmir.attractions.map(attraction => `• ${attraction}`).join('\n')}\n\n**Best Time to Visit:** ${kashmir.bestTime}\n\n**Cultural Heritage:** ${kashmir.culture}\n\nWould you like specific recommendations for activities or dining options in Kashmir?`;
  }
  
  if (lowerQuery.includes('kolkata') || lowerQuery.includes('city of joy')) {
    const kolkata = cityData.kolkata;
    return `🎭 **${kolkata.name}**\n\n${kolkata.overview}\n\n**Must-Visit Attractions:**\n${kolkata.attractions.map(attraction => `• ${attraction}`).join('\n')}\n\n**Best Time to Visit:** ${kolkata.bestTime}\n\n**Cultural Heritage:** ${kolkata.culture}\n\nWould you like recommendations for cultural experiences or local cuisine in Kolkata?`;
  }
  
  return "I'd be happy to share information about our beautiful destinations! Are you interested in Kashmir's mountain paradise or Kolkata's rich cultural heritage?";
};

export const generateHeritageResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('heritage') || lowerQuery.includes('history') || lowerQuery.includes('hotel story')) {
    return `🏛️ **${hotelHeritage.name} - A Century of Excellence**\n\n**Heritage:** ${hotelHeritage.heritage}\n\n**Architecture:** ${hotelHeritage.architecture}\n\n**Awards & Recognition:**\n${hotelHeritage.awards.map(award => `🏆 ${award}`).join('\n')}\n\n**Unique Features:**\n${hotelHeritage.uniqueFeatures.map(feature => `✨ ${feature}`).join('\n')}\n\nWould you like to visit our heritage museum or book a guided tour of our historical areas?`;
  }
  
  return `Our hotel has a rich heritage dating back to ${hotelHeritage.established}. Would you like to know more about our history, architecture, or famous guests?`;
};

export const generateServiceResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Check for maintenance issues
  for (const [key, issue] of Object.entries(commonGuestQueries.maintenanceIssues.queries)) {
    if (lowerQuery.includes(issue)) {
      if (issue.includes('geyser') || issue.includes('hot water')) {
        return commonGuestQueries.maintenanceIssues.responses.geyser;
      } else if (issue.includes('air conditioning') || issue.includes('ac')) {
        return commonGuestQueries.maintenanceIssues.responses.ac;
      } else if (issue.includes('wifi')) {
        return commonGuestQueries.maintenanceIssues.responses.wifi;
      } else {
        return commonGuestQueries.maintenanceIssues.responses.general;
      }
    }
  }
  
  // Check for amenity requests
  for (const [key, request] of Object.entries(commonGuestQueries.amenityRequests.queries)) {
    if (lowerQuery.includes(request)) {
      if (request.includes('towels')) {
        return commonGuestQueries.amenityRequests.responses.towels;
      } else if (request.includes('soap')) {
        return commonGuestQueries.amenityRequests.responses.soap;
      } else if (request.includes('pillows')) {
        return commonGuestQueries.amenityRequests.responses.pillows;
      } else {
        return commonGuestQueries.amenityRequests.responses.general;
      }
    }
  }
  
  // Check for room service
  for (const [key, service] of Object.entries(commonGuestQueries.roomService.queries)) {
    if (lowerQuery.includes(service)) {
      if (service.includes('menu')) {
        return commonGuestQueries.roomService.responses.menu;
      } else if (service.includes('hours')) {
        return commonGuestQueries.roomService.responses.hours;
      } else if (service.includes('dietary')) {
        return commonGuestQueries.roomService.responses.dietary;
      }
    }
  }
  
  return null;
};

export const detectQueryType = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('kashmir') || lowerQuery.includes('kolkata') || lowerQuery.includes('city')) {
    return 'city_info';
  }
  
  if (lowerQuery.includes('heritage') || lowerQuery.includes('history') || lowerQuery.includes('hotel story')) {
    return 'heritage';
  }
  
  // Check for service queries
  const allServiceQueries = [
    ...commonGuestQueries.maintenanceIssues.queries,
    ...commonGuestQueries.amenityRequests.queries,
    ...commonGuestQueries.roomService.queries,
    ...commonGuestQueries.conciergeServices.queries
  ];
  
  for (const serviceQuery of allServiceQueries) {
    if (lowerQuery.includes(serviceQuery)) {
      return 'service_request';
    }
  }
  
  return 'general';
};
