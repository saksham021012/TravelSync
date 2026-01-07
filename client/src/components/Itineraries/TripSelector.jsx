import React from 'react';
import { ChevronDown } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const TripSelector = ({ trips, selectedTrip, onTripChange, loading }) => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 mb-4 md:mb-6 border border-slate-200 shadow-sm">
      <label className="block mb-2 text-slate-700 text-sm font-medium">
        Select Trip:
      </label>
      <div className="relative">
        <select
          className="w-full p-3 border border-slate-200 rounded-md bg-slate-50 text-sm text-slate-900 appearance-none hover:border-purple-500 hover:shadow-sm hover:shadow-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
          value={selectedTrip?._id || ''}
          onChange={(e) => onTripChange(e.target.value)}
          disabled={loading}
        >
          {loading ? (
            <option>Loading trips...</option>
          ) : (
            trips?.map((trip) => (
              <option key={trip._id} value={trip._id}>
                {trip.title} ({formatDate(trip.startDate)} - {formatDate(trip.endDate)})
              </option>
            ))
          )}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default TripSelector;