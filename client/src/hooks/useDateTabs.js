import { useState, useEffect } from 'react';
import { generateDateRange } from '../utils/dateUtils';

const useDateTabs = (trip) => {
  const [dateTabs, setDateTabs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  useEffect(() => {
    if (trip?.startDate && trip?.endDate) {
      const dates = generateDateRange(trip.startDate, trip.endDate);
      setDateTabs(dates);
      setSelectedDate(dates[0]);
      setActiveTab(0);
    }
  }, [trip]);
  
  const handleTabClick = (index) => {
    setActiveTab(index);
    setSelectedDate(dateTabs[index]);
  };
  
  return { dateTabs, selectedDate, activeTab, handleTabClick };
};

export default useDateTabs;