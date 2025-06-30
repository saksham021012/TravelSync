import React from 'react';

const QuickActionButton = ({ icon, label, onClick, primary = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer gap-2 px-6 py-3 rounded-xl font-medium border transition-all relative overflow-hidden ${
        primary
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
          : 'bg-white border-gray-200 text-gray-700 hover:text-indigo-500 hover:border-indigo-500 hover:shadow-md'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default QuickActionButton;
