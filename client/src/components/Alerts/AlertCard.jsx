import React from "react";

const typeColor = {
  flight: "border-red-500",
  weather: "border-yellow-500",
  news: "border-blue-500",
  emergency: "border-green-500",
};

const iconMap = {
  flight: "✈️",
  weather: "⛅",
  news: "📰",
  emergency: "⚠️",
};

// NEW: background color for icon circle
const iconBgColor = {
  flight: "bg-red-500",
  weather: "bg-blue-500",
  news: "bg-yellow-500",
  emergency: "bg-green-500",
};

const AlertCard = ({ alert }) => {
  return (
    <div
      className={`group relative bg-white border-l-4 ${
        typeColor[alert.type] || "border-gray-300"
      } rounded-2xl p-4 shadow transition-all hover:scale-[1.01]`}
    >
      {/* 🔼 Top animated line */}
      <span className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 w-0 group-hover:w-full transition-all duration-400 rounded-t-xl" />

      <div className="flex gap-4 items-start">
        <div
          className={`w-12 h-12 rounded-full animate-custom-pulse flex items-center justify-center text-lg text-white ${
            iconBgColor[alert.type] || "bg-gray-400"
          }`}
        >
          {iconMap[alert.type] || "🔔"}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {alert.title}
          </h3>
          
          <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
