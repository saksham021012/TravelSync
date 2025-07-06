import React from "react";
import LocationCard from "./LocationCard";

const LocationSection = () => {
  return (
    <div className="space-y-4">
      {/* Grouped locations */}
      <h2 className="text-lg font-semibold text-gray-800">Nearby Locations</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Map over service data later */}
        <LocationCard />
        
      </div>
    </div>
  );
};

export default LocationSection;
