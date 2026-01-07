import React from 'react';
import { Plus } from 'lucide-react';
import ItineraryItem from './ItineraryItem';

const ItineraryList = ({ items, onEdit, onDelete, onAddNew }) => {
  return (
    <div className="p-4 sm:p-5 md:p-6">
      {items.length > 0 ? (
        items.map((item, index) => (
          <ItineraryItem
            key={item._id || index}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="text-center py-12 text-slate-500">
          No itinerary items for this date. Add some activities below!
        </div>
      )}
      
      <button
        onClick={onAddNew}
        className="w-full p-4 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200 flex items-center justify-center gap-2 relative overflow-hidden group mt-4"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
        <Plus className="w-4 h-4" />
        Add Item
      </button>
    </div>
  );
};

export default ItineraryList;