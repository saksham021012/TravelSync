import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { generateSuggestions } from '../services/Operations/itinerary';
import { formatLocationString, parseSuggestionsResponse } from '../utils/itineraryUtils';

const useSuggestions = (selectedTrip) => {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const fetchSuggestions = async () => {
    if (!selectedTrip?.locations?.length) return;
    
    setLoading(true);
    try {
      const locations = selectedTrip.locations.map(formatLocationString);
      const preferences = selectedTrip.preferences || "Anything works";
      
      const result = await dispatch(generateSuggestions(locations, 1, preferences));
      const parsed = parseSuggestionsResponse(result);
      
      setSuggestions(parsed);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  
  const nextSuggestion = () => {
    if (suggestions.length <= 1) return;
    
    let next = currentIndex;
    while (next === currentIndex && suggestions.length > 1) {
      next = Math.floor(Math.random() * suggestions.length);
    }
    setCurrentIndex(next);
  };
  
  const currentSuggestion = suggestions[currentIndex] || null;
  
  return {
    suggestions,
    currentSuggestion,
    loading,
    fetchSuggestions,
    nextSuggestion
  };
};

export default useSuggestions;