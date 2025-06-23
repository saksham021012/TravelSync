// components/Alerts/AlertSpinner.jsx
import React from "react";

const AlertSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-10 text-center">
      {/* Revolving Spinner */}
      <div className="relative mb-6">
        {/* Outer ring */}
        <div className="w-12 h-12 border-4 border-blue-100 rounded-full animate-spin border-t-blue-500 border-r-blue-500"></div>
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>
      
      {/* Loading text with subtle animation */}
      <div className="space-y-2">
        <p className="text-gray-700 font-medium">Checking for travel alerts...</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default AlertSpinner;