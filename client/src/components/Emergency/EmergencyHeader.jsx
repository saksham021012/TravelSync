import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmergencyHeader = ({ locationLabel }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600">🚨 Emergency Services</h1>
          <p className="text-sm text-gray-600">
            Showing results for <span className="font-medium">{locationLabel}</span>
          </p>
        </div>
        <div>{/* Placeholder to center header title */}</div>
      </div>
    </header>
  );
};

export default EmergencyHeader;
