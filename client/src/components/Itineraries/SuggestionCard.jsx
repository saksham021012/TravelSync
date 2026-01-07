import React from 'react';
import { Clock, MapPin, Plus } from 'lucide-react';
import { getItemIcon, getItemIconBg } from '../../utils/itineraryUtils';

const SuggestionCard = ({ suggestion, onAdd }) => {
  const IconComponent = getItemIcon(suggestion.type);
  
  return (
    <div className="bg-transparent border border-slate-200 rounded-lg p-4 sm:p-5 mb-3 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md gap-4">
      <div className="flex-1">
        <div className="text-base font-semibold text-slate-900 mb-1">
          {suggestion.name || suggestion.title}
        </div>
        <div className="text-sm text-slate-600 mb-1 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {suggestion.time || '02:00 PM'} - {suggestion.type || 'Activity'}
        </div>
        <div className="text-sm text-slate-500 flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {suggestion.location || suggestion.address}
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${getItemIconBg(suggestion.type)}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <button
          onClick={() => onAdd(suggestion)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-blue-600 transition-all cursor-pointer duration-200 hover:scale-105 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add to Itinerary
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;