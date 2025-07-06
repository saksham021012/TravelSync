import React from "react";

const filters = [
  { label: "All", value: "all" },
  { label: "Hospitals", value: "hospitals" },
  { label: "Police", value: "policeStations" },
  { label: "Fire", value: "fireStations" },
  { label: "Pharmacies", value: "pharmacies" },
];

const FilterBar = ({ filter, setFilter }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-start">
      {filters.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={`px-4 py-2 text-sm rounded-full cursor-pointer ${
            filter === value
              ? "bg-violet-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
