import React from 'react';

const AlertItem = ({ alert }) => {
  const { icon = '⚠️', type = 'warning', title, subtitle } = alert;
  const typeColors = {
    warning: 'from-yellow-400 to-orange-500',
    info: 'from-blue-400 to-blue-600',
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b hover:bg-gray-50 px-4 rounded-lg transition-all">
      <div className={`w-10 h-10 animate-pulseCustom flex items-center justify-center rounded-full text-white text-lg  bg-gradient-to-r ${typeColors[type]}`}>
        {icon}
      </div>
      <div>
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
};

export default AlertItem;
