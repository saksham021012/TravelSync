import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import EmergencyModal from "./EmergencyModal"; // Adjust the path as necessary

const alertTypes = [
  { value: "all", label: "All Types" },
  { value: "flight", label: "Flight Updates" },
  { value: "weather", label: "Weather" },
  { value: "news", label: "News" },
];

const FilterBar = ({
  trips,
  filteredTripId,
  setFilteredTripId,
  filteredType,
  setFilteredType,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleContinue = (selectedLocationType) => {
    console.log("Selected location option:", selectedLocationType);
    setShowModal(false);
    // You can trigger emergency-related logic here based on `selectedLocationType`
  };

  return (
    <>
      <section className="bg-white p-6 rounded-2xl shadow-md flex flex-wrap gap-4 items-end">
        <div className="flex flex-col min-w-[200px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Filter by Trip
          </label>
          <select
            className="text-gray-700 bg-white border-2 border-gray-300 rounded-xl p-2"
            value={filteredTripId}
            onChange={(e) => setFilteredTripId(e.target.value)}
          >
            {trips.map((trip) => (
              <option key={trip._id} value={trip._id}>
                {trip.title || "Unnamed Trip"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-w-[200px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Filter by Alert Type
          </label>
          <select
            className="text-gray-700 bg-white border-2 border-gray-300 rounded-xl p-2"
            value={filteredType}
            onChange={(e) => setFilteredType(e.target.value)}
          >
            {alertTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center space-x-2 px-5 py-3 text-sm font-medium text-white bg-red-500 rounded-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md cursor-pointer"
          >
            <AlertTriangle size={18} />
            <span>🚨 Get Help</span>
          </button>
        </div>
      </section>

      <EmergencyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onContinue={handleContinue}
      />
    </>
  );
};

export default FilterBar;