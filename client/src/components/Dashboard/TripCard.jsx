import React from 'react';

const TripCard = ({ trip }) => {
  const { title, startDate, endDate, locations = [] } = trip;

  const formatTripDates = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    const sameYear = startDateObj.getFullYear() === endDateObj.getFullYear();
    const sameMonth = startDateObj.getMonth() === endDateObj.getMonth();

    const optionsStart = { month: 'short', day: '2-digit' };
    const optionsEnd = { month: 'short', day: '2-digit' };
    const optionsYear = { year: 'numeric' };

    const startStr = startDateObj.toLocaleDateString('en-US', optionsStart);
    const endStr = endDateObj.toLocaleDateString('en-US', optionsEnd);
    const yearStr = endDateObj.toLocaleDateString('en-US', optionsYear);

    return `${startStr} – ${endStr}, ${yearStr}`;
  };

  const location = locations?.[locations.length - 1]?.city
    ? `${locations[locations.length - 1].city}, ${locations[locations.length - 1].country || ""}`
    : "";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transform -translate-x-full hover:translate-x-0 transition-transform duration-300"></div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">
        {formatTripDates(startDate, endDate)}
      </p>
      <p className="text-sm text-gray-400 mb-4">{location}</p>
      <button
        className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg relative overflow-hidden"
        onClick={() => alert(`Viewing details for: ${title}`)}
      >
        View Details
      </button>
    </div>
  );
};

export default TripCard;
