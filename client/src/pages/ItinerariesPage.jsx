import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import {
  MapPin,
  Clock,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  Sparkles,
  BusFront,
  Utensils,
  Building

} from 'lucide-react';

import { getAllTrips } from '../services/Operations/trip';
import {
  getItinerariesByTrip,
  createItinerary,
  deleteItineraryItem,
  generateSuggestions,
  updateItineraryItem
} from '../services/Operations/itinerary';
import Sidebar from '../components/Common/Sidebar';
import AddItemModal from '../components/Itineraries/AddItemModal';

const TravelSyncItineraries = () => {
  const dispatch = useDispatch();
  const { trips, loading: tripsLoading } = useSelector(state => state.trip);
  const { schedule, loading: itineraryLoading } = useSelector(state => state.itinerary);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [dateTabs, setDateTabs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [editItem, setEditItem] = useState(null);


  const [searchParams] = useSearchParams();
  const tripIdFromURL = searchParams.get('trip');



  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTrip) {
      const firstTrip = trips[0];
      setSelectedTrip(firstTrip);
      generateDateTabs(firstTrip);
    }
  }, [trips, selectedTrip]);

  useEffect(() => {
    if (selectedTrip && selectedDate) {
      dispatch(getItinerariesByTrip(selectedTrip._id));
    }
  }, [selectedTrip, selectedDate, dispatch]);

  const generateDateTabs = (trip) => {
    if (!trip.startDate || !trip.endDate) return;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const tabs = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      tabs.push(new Date(d));
    }
    setDateTabs(tabs);
    setSelectedDate(tabs[0]);
    setActiveTab(0);
  };

  const handleTripChange = (tripId) => {
    const trip = trips.find(t => t._id === tripId);
    setSelectedTrip(trip);
    generateDateTabs(trip);
  };

  const handleDateTabClick = (index) => {
    setActiveTab(index);
    setSelectedDate(dateTabs[index]);
  };

  const handleDeleteItineraryItem = async (item) => {
    try {
      const itineraryId = item.itineraryId;
      const itemId = item._id;
      if (!itineraryId || !itemId) return;
      await dispatch(deleteItineraryItem(itineraryId, itemId));
      dispatch(getItinerariesByTrip(selectedTrip._id));
    } catch (error) {
      console.error('Failed to delete itinerary item:', error);
    }
  };

  const handleGetSuggestions = async () => {
    if (!selectedTrip) return;
    try {
      const locationStrings = selectedTrip.locations.map(loc => {
        const city = loc.city || 'Unknown City';
        const country = loc.country;
        return !country || country.toLowerCase().includes('unknown') ? city : `${city}, ${country}`;
      });

      const result = await dispatch(generateSuggestions(
        locationStrings,
        1,
        selectedTrip.preferences || "Anything works"
      ));

      const cleaned = result.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned); // parsed is an array
      setSuggestions(parsed); // save all
      setCurrentSuggestionIndex(0); // reset to first


    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  const handleAddSuggestionToItinerary = async (suggestion) => {
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
        selectedDate.toISOString().split('T')[0],
        [newItem]
      ));
      dispatch(getItinerariesByTrip(selectedTrip._id));
    } catch (error) {
      console.error('Failed to add suggestion to itinerary:', error);
    }
  };

  const handleSaveModalItem = async (formData) => {
    if (!selectedTrip || !selectedDate) return;

    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      type: formData.type,
      time: formData.startTime,
    };

    try {
      if (editItem) {
        // Update existing item
        await dispatch(updateItineraryItem(editItem.itineraryId, editItem._id, payload));
      } else {
        // Create new item
        await dispatch(createItinerary(
          selectedTrip._id,
          selectedDate.toISOString().split('T')[0],
          [payload]
        ));
      }

      dispatch(getItinerariesByTrip(selectedTrip._id));
      setIsModalOpen(false);
      setEditItem(null);
    } catch (error) {
      console.error('Failed to save itinerary item:', error);
    }
  };


  const formatDate = (date) => date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getItemIcon = (type) => {
    switch (type?.toLowerCase()) {

      case 'food': return <Utensils />;
      case 'transport': return <BusFront />
      case 'hotel': return <Building />

      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getItemIconBg = (type) => {
    switch (type?.toLowerCase()) {

      case 'food': return 'bg-red-400';
      case 'hotel': return 'bg-green-500'

      case 'transport': return 'bg-purple-500';
      default: return 'bg-yellow-500';
    }
  };

  const filteredSchedule = schedule?.filter(item => {
    if (!selectedDate) return false;
    const itemDate = new Date(item.date);
    return itemDate.toDateString() === selectedDate.toDateString();
  }) || [];

  return (
  <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
    {/* Sidebar */}
    <nav className="w-full md:w-60 bg-white shadow-sm">
      <Sidebar />
    </nav>

    {/* Main Content */}
    <main className="flex-1 p-4 sm:p-6 md:p-8 bg-slate-50 animate-fade-in-up">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 mb-4 sm:mb-6 md:mb-8">
          Itineraries
        </h1>

        {/* Trip Selector */}
        <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 mb-4 md:mb-6 border border-slate-200 shadow-sm">
          <label className="block mb-2 text-slate-700 text-sm font-medium">Select Trip:</label>
          <div className="relative">
            <select
              className="w-full p-3 border border-slate-200 rounded-md bg-slate-50 text-sm text-slate-900 appearance-none hover:border-purple-500 hover:shadow-sm hover:shadow-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              value={selectedTrip?._id || ''}
              onChange={(e) => handleTripChange(e.target.value)}
              disabled={tripsLoading}
            >
              {tripsLoading ? (
                <option>Loading trips...</option>
              ) : (
                trips?.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.title} ({formatDate(new Date(trip.startDate))} - {formatDate(new Date(trip.endDate))})
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tabs and Items */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-4 md:mb-6">
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 px-4 sm:px-5 md:px-6 overflow-x-auto">
          {dateTabs.map((date, index) => (
            <button
              key={index}
              className={`py-3 px-0 mr-4 md:mr-8 text-sm font-medium border-b-2 transition-all duration-200 relative whitespace-nowrap ${
                activeTab === index
                  ? 'text-purple-600 border-purple-600'
                  : 'text-slate-600 border-transparent hover:text-purple-600'
              }`}
              onClick={() => handleDateTabClick(index)}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="p-4 sm:p-5 md:p-6">
          {filteredSchedule.length > 0 ? (
            filteredSchedule.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-transparent border border-slate-200 rounded-lg p-4 sm:p-5 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative group gap-4"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-lg"></div>

                <div className="flex-1">
                  <div className="text-base font-semibold text-slate-900 mb-1">{item.title}</div>
                  <div className="text-sm text-slate-600 mb-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.time} - {item.type}
                  </div>
                  <div className="mb-1 text-slate-600 font-semibold flex items-center">{item.description}</div>
                  <div className="text-sm text-slate-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location}
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${getItemIconBg(item.type)}`}>
                    {getItemIcon(item.type)}
                  </div>
                  <button
                    onClick={() => {
                      setEditItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all duration-200 hover:scale-110"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItineraryItem(item)}
                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              No itinerary items for this date. Add some activities below!
            </div>
          )}

          {/* Add Item Button */}
          <button
            onClick={() => {
              setEditItem(null);
              setIsModalOpen(true);
            }}
            className="w-full p-4 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200 flex items-center justify-center gap-2 relative overflow-hidden group mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* AI Suggestions Section */}
      <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 mb-4 md:mb-6">
          Need Ideas for this Day?
        </h2>

        {suggestions.length > 0 ? (
          <div
            className="bg-transparent border border-slate-200 rounded-lg p-4 sm:p-5 mb-3 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md gap-4"
            style={{ animationDelay: `0ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex-1">
              <div className="text-base font-semibold text-slate-900 mb-1">
                {suggestions[currentSuggestionIndex].name || suggestions[currentSuggestionIndex].title}
              </div>
              <div className="text-sm text-slate-600 mb-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {suggestions[currentSuggestionIndex].time || '02:00 PM'} - {suggestions[currentSuggestionIndex].type || 'Activity'}
              </div>
              <div className="text-sm text-slate-500 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {suggestions[currentSuggestionIndex].location || suggestions[currentSuggestionIndex].address}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${getItemIconBg(suggestions[currentSuggestionIndex].type)}`}>
                {getItemIcon(suggestions[currentSuggestionIndex].type)}
              </div>
              <button
                onClick={() => handleAddSuggestionToItinerary(suggestions[currentSuggestionIndex])}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-blue-600 transition-all cursor-pointer duration-200 hover:scale-105 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add to Itinerary
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            Click "Get AI Suggestions" to see recommendations for this day.
          </div>
        )}

        {/* Switch Suggestion */}
        {suggestions.length > 1 && (
          <button
            onClick={() => {
              let next = currentSuggestionIndex;
              while (next === currentSuggestionIndex && suggestions.length > 1) {
                next = Math.floor(Math.random() * suggestions.length);
              }
              setCurrentSuggestionIndex(next);
            }}
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 cursor-pointer rounded-md transition-colors duration-200 border border-transparent hover:border-purple-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Another Suggestion
          </button>
        )}

        {/* Get AI Suggestions Button */}
        <button
          onClick={handleGetSuggestions}
          disabled={itineraryLoading}
          className="w-full p-4 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-200 flex items-center justify-center gap-2 mt-4 relative overflow-hidden cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          <Sparkles className="w-4 h-4" />
          {itineraryLoading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
        </button>
      </div>
    </main>

    <AddItemModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setEditItem(null);
      }}
      onSave={handleSaveModalItem}
      initialData={editItem}
    />
  </div>
);

};

export default TravelSyncItineraries;
