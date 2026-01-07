import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from '../components/Common/Sidebar';
import TripSelector from '../components/Itineraries/TripSelector';
import DateTabs from '../components/Itineraries/DateTabs';
import ItineraryList from '../components/Itineraries/ItineraryList';
import SuggestionsSection from '../components/Itineraries/SuggestionsSection';
import AddItemModal from '../components/Itineraries/AddItemModal';

import { getAllTrips } from '../services/Operations/trip';
import { createItinerary, deleteItineraryItem, updateItineraryItem } from '../services/Operations/itinerary';
import useItineraryData  from '../hooks/useItineraryData';
import useDateTabs  from '../hooks/useDateTabs';
import useSuggestions  from '../hooks/useSuggestions';
import { formatDateString, isSameDay } from '../utils/dateUtils';

const TravelSyncItineraries = () => {
  const dispatch = useDispatch();
  const { trips, loading: tripsLoading } = useSelector(state => state.trip);
  
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  // Custom hooks for data management
  const { schedule, loading: itineraryLoading, refreshItineraries } = useItineraryData(selectedTrip);
  const { dateTabs, selectedDate, activeTab, handleTabClick } = useDateTabs(selectedTrip);
  const {
    currentSuggestion,
    suggestions,
    loading: suggestionsLoading,
    fetchSuggestions,
    nextSuggestion
  } = useSuggestions(selectedTrip);
  
  // Fetch all trips on mount
  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);
  
  // Set first trip as selected by default
  useEffect(() => {
    if (trips?.length > 0 && !selectedTrip) {
      setSelectedTrip(trips[0]);
    }
  }, [trips, selectedTrip]);
  
  // Filter schedule for selected date
  const filteredSchedule = useMemo(() => {
    if (!selectedDate || !schedule) return [];
    return schedule.filter(item => isSameDay(item.date, selectedDate));
  }, [schedule, selectedDate]);
  
  // Handlers
  const handleTripChange = (tripId) => {
    const trip = trips.find(t => t._id === tripId);
    setSelectedTrip(trip);
  };
  
  const handleDeleteItem = async (item) => {
    try {
      await dispatch(deleteItineraryItem(item.itineraryId, item._id));
      refreshItineraries();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };
  
  const handleAddSuggestion = async (suggestion) => {
    if (!selectedTrip || !selectedDate) return;
    
    try {
      const newItem = {
        title: suggestion.name || suggestion.title,
        time: suggestion.time || '10:00 AM',
        location: suggestion.location || suggestion.address,
        type: suggestion.type || 'Activity',
        description: suggestion.description
      };
      
      await dispatch(createItinerary(
        selectedTrip._id,
        formatDateString(selectedDate),
        [newItem]
      ));
      
      refreshItineraries();
    } catch (error) {
      console.error('Failed to add suggestion:', error);
    }
  };
  
  const handleSaveModal = async (formData) => {
    if (!selectedTrip || !selectedDate) return;
    
    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      type: formData.type,
      time: formData.startTime
    };
    
    try {
      if (editItem) {
        await dispatch(updateItineraryItem(editItem.itineraryId, editItem._id, payload));
      } else {
        await dispatch(createItinerary(
          selectedTrip._id,
          formatDateString(selectedDate),
          [payload]
        ));
      }
      
      refreshItineraries();
      setIsModalOpen(false);
      setEditItem(null);
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <nav className="w-full md:w-60 bg-white shadow-sm">
        <Sidebar />
      </nav>
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-slate-50 animate-fade-in-up">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 mb-4 sm:mb-6 md:mb-8">
            Itineraries
          </h1>
          
          <TripSelector
            trips={trips}
            selectedTrip={selectedTrip}
            onTripChange={handleTripChange}
            loading={tripsLoading}
          />
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-4 md:mb-6">
          <DateTabs
            dates={dateTabs}
            activeTab={activeTab}
            onTabClick={handleTabClick}
          />
          
          <ItineraryList
            items={filteredSchedule}
            onEdit={(item) => {
              setEditItem(item);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteItem}
            onAddNew={() => {
              setEditItem(null);
              setIsModalOpen(true);
            }}
          />
        </div>
        
        <SuggestionsSection
          currentSuggestion={currentSuggestion}
          hasMultipleSuggestions={suggestions.length > 1}
          loading={suggestionsLoading || itineraryLoading}
          onGetSuggestions={fetchSuggestions}
          onNextSuggestion={nextSuggestion}
          onAddToItinerary={handleAddSuggestion}
        />
      </main>
      
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditItem(null);
        }}
        onSave={handleSaveModal}
        initialData={editItem}
      />
    </div>
  );
};

export default TravelSyncItineraries;