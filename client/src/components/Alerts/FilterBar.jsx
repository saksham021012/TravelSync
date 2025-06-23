import React from "react";

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
  return (
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
            <option
              key={trip._id}
              value={trip._id}
              className="text-gray-700 bg-white"
            >
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
            <option
              key={type.value}
              value={type.value}
              className="text-gray-700 bg-white"
            >
              {type.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default FilterBar;
