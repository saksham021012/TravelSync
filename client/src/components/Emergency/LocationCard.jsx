import React from "react";
import { MapPin, ExternalLink } from "lucide-react";

const LocationCard = ({ data }) => {
  const { name, address, distance, coordinates, type } = data;

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}`;

  const getTypeColor = (type) => {
    switch (type) {
      case 'hospital':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'police':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'fire':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'pharmacy':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hospitals':
        return '🏥';
      case 'policeStations':
        return '🚔';
      case 'fireStations':
        return '🚒';
      case 'pharmacies':
        return '💊';
      default:
        return '📍'
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="text-2xl">{getTypeIcon(type)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {name || "Unknown"}
            </h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getTypeColor(type)}`}>
              {type?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 leading-relaxed">{address}</p>
        </div>
      </div>

      <div className="shrink-0">
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
        >
          <span>Get Directions</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default LocationCard;
