import React from 'react';

const ScheduleItem = ({ item }) => {
  const { icon = '📍', title, time } = item;

  return (
    <div className="flex items-center gap-4 py-4 border-b hover:bg-gray-50 px-4 rounded-lg transition-all">
      <div className="w-10 h-10 flex items-center animate-pulseCustom justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </div>
  );
};

export default ScheduleItem;
