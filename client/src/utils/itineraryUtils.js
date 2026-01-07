import { Utensils, BusFront, Building, MapPin } from 'lucide-react';

export const getItemIcon = (type) => {
  const icons = {
    food: Utensils,
    transport: BusFront,
    hotel: Building,
    default: MapPin
  };
  
  const IconComponent = icons[type?.toLowerCase()] || icons.default;
  return IconComponent;
};

export const getItemIconBg = (type) => {
  const colors = {
    food: 'bg-red-400',
    hotel: 'bg-green-500',
    transport: 'bg-purple-500',
    default: 'bg-yellow-500'
  };
  
  return colors[type?.toLowerCase()] || colors.default;
};

export const formatLocationString = (location) => {
  const city = location.city || 'Unknown City';
  const country = location.country;
  
  if (!country || country.toLowerCase().includes('unknown')) {
    return city;
  }
  
  return `${city}, ${country}`;
};

export const parseSuggestionsResponse = (response) => {
  try {
    const cleaned = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse suggestions:', error);
    return [];
  }
};