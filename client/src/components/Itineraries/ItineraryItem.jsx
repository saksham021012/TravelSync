import React from 'react';
import { Clock, MapPin, Edit3, Trash2 } from 'lucide-react';
import { getItemIcon, getItemIconBg } from '../../utils/itineraryUtils';

const ItineraryItem = ({ item, onEdit, onDelete }) => {
  const IconComponent = getItemIcon(item.type);
  
  return (
    <div className="bg-transparent border border-slate-200 rounded-lg p-4 sm:p-5 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative group gap-4">
      <div className="absolute left-0 top-0 h-full w-1 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-lg" />
      
      <div className="flex-1">
        <div className="text-base font-semibold text-slate-900 mb-1">
          {item.title}
        </div>
        <div className="text-sm text-slate-600 mb-1 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {item.time} - {item.type}
        </div>
        <div className="mb-1 text-slate-600 font-semibold flex items-center">
          {item.description}
        </div>
        <div className="text-sm text-slate-500 flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {item.location}
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${getItemIconBg(item.type)}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <button
          onClick={() => onEdit(item)}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all duration-200 hover:scale-110"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200 hover:scale-110"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ItineraryItem;