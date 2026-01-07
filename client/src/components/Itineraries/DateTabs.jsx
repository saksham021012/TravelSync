import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const DateTabs = ({ dates, activeTab, onTabClick }) => {
  return (
    <div className="flex flex-wrap border-b border-slate-200 px-4 sm:px-5 md:px-6 overflow-x-auto">
      {dates.map((date, index) => (
        <button
          key={index}
          className={`py-3 px-0 mr-4 md:mr-8 text-sm font-medium border-b-2 transition-all duration-200 relative whitespace-nowrap ${
            activeTab === index
              ? 'text-purple-600 border-purple-600'
              : 'text-slate-600 border-transparent hover:text-purple-600'
          }`}
          onClick={() => onTabClick(index)}
        >
          {formatDate(date)}
        </button>
      ))}
    </div>
  );
};

export default DateTabs;