import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Grid3X3,
  Mountain,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Building,
  Ship
} from 'lucide-react';

// Import your existing API functions
import { getAllTrips } from '../services/Operations/trip';
import {
  getItinerariesByTrip,
  createItinerary,
  updateItinerary,
  // deleteItinerary,
  deleteItineraryItem, // Make sure this is imported
  generateSuggestions
} from '../services/Operations/itinerary';
import Sidebar from '../components/Common/Sidebar';


const TravelSyncItineraries = () => {
  const dispatch = useDispatch();

  // Redux state
  const { trips, loading: tripsLoading } = useSelector(state => state.trip);
  const { schedule, loading: itineraryLoading } = useSelector(state => state.itinerary);

  // Local state
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [dateTabs, setDateTabs] = useState([]);

  // Load trips on component mount
  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  // Set selected trip and generate date tabs when trips are loaded
  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTrip) {
      const firstTrip = trips[0];
      setSelectedTrip(firstTrip);
      generateDateTabs(firstTrip);
    }
  }, [trips, selectedTrip]);

  // Load itinerary when trip or date changes
  useEffect(() => {
    if (selectedTrip && selectedDate) {
      dispatch(getItinerariesByTrip(selectedTrip._id));
    }
  }, [selectedTrip, selectedDate, dispatch]);

  const generateDateTabs = (trip) => {
    if (!trip.startDate || !trip.endDate) return;

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const tabs = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
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
      console.log('Current item to delete:', item);

      // With the updated backend, each item should now have an itineraryId
      const targetItineraryId = item.itineraryId;
      const targetItemId = item._id;

      if (!targetItineraryId || !targetItemId) {
        console.error('Missing itineraryId or itemId');
        console.error('Item data:', item);
        return;
      }

      // Call the delete function with proper parameters
      await dispatch(deleteItineraryItem(targetItineraryId, targetItemId));

      // Refresh itinerary after deletion
      dispatch(getItinerariesByTrip(selectedTrip._id));

      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Failed to delete itinerary item:', error);
      // You might want to show a user-friendly error message here
    }
  };

  const handleGetSuggestions = async () => {
    if (!selectedTrip) return;

    try {
      const locationStrings = selectedTrip.locations.map(loc => {
        const city = loc.city || 'Unknown City';
        const country = loc.country;
        // Ignore or omit invalid country data
        if (!country || country.toLowerCase().includes('unknown')) {
          return city;
        }
        return `${city}, ${country}`;
      });


      const result = await dispatch(generateSuggestions(
        locationStrings,
        1,
        selectedTrip.preferences || "Anything works"
      ));

      // 1. Remove Markdown code block formatting
      const cleaned = result.replace(/```json|```/g, '').trim();

      // Parse to JS 
      const parsed = JSON.parse(cleaned);

      setSuggestions([parsed]);

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

      // Refresh itinerary
      dispatch(getItinerariesByTrip(selectedTrip._id));
    } catch (error) {
      console.error('Failed to add suggestion to itinerary:', error);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getItemIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'museum':
      case 'cultural':
        return <Building className="w-4 h-4" />;
      case 'dining':
      case 'restaurant':
        return '🍽️';
      case 'activity':
      case 'cruise':
        return <Ship className="w-4 h-4" />;
      case 'sightseeing':
        return '🏗️';
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getItemIconBg = (type) => {
    switch (type?.toLowerCase()) {
      case 'museum':
      case 'cultural':
        return 'bg-blue-500';
      case 'dining':
      case 'restaurant':
        return 'bg-amber-500';
      case 'activity':
      case 'cruise':
        return 'bg-emerald-500';
      case 'sightseeing':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
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
      <nav className="w-full md:w-60 bg-white shadow-sm transition-transform duration-300 hover:translate-x-0.5">
        <Sidebar />
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-slate-50">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6 md:mb-8">Itineraries</h1>

          {/* Trip Selector */}
          <div className="bg-white rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-slate-200 shadow-sm">
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

        {/* Date Tabs and Itinerary Content */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-4 md:mb-6">
          {/* Date Tabs */}
          <div className="flex flex-wrap border-b border-slate-200 px-4 md:px-6">
            {dateTabs.map((date, index) => (
              <button
                key={index}
                className={`py-3 px-0 mr-4 md:mr-8 text-sm font-medium border-b-2 transition-all duration-200 relative ${activeTab === index
                  ? 'text-purple-600 border-purple-600'
                  : 'text-slate-600 border-transparent hover:text-purple-600'
                  }`}
                onClick={() => handleDateTabClick(index)}
              >
                {formatDate(date)}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 ${activeTab === index ? 'w-full' : 'group-hover:w-full'
                    }`}
                ></span>
              </button>
            ))}
          </div>

          {/* Itinerary Items */}
          <div className="p-4 md:p-6">
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-transparent border border-slate-200 rounded-lg p-4 md:p-5 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-md relative group gap-4"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-lg"></div>

                  <div className="flex-1">
                    <div className="text-base font-semibold text-slate-900 mb-1">{item.title}</div>
                    <div className="text-sm text-slate-600 mb-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.time} - {item.type}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white transition-transform duration-200 hover:scale-105 ${getItemIconBg(item.type)}`}>
                      {getItemIcon(item.type)}
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all duration-200 hover:scale-110">
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
            <button className="w-full p-4 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200 flex items-center justify-center gap-2 relative overflow-hidden group mt-4">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="bg-white rounded-lg p-4 md:p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 md:mb-6">
            Need Ideas for this Day?
          </h2>

          {suggestions.length > 0 ? (
            <div
              className="bg-transparent border border-slate-200 rounded-lg p-4 md:p-5 mb-3 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-md opacity-0 animate-fadeInUp gap-4"
              style={{ animationDelay: `0ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex-1">
                <div className="text-base font-semibold text-slate-900 mb-1">
                  {suggestions[0].name || suggestions[0].title}
                </div>
                <div className="text-sm text-slate-600 mb-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {suggestions[0].time || '02:00 PM'} - {suggestions[0].type || 'Activity'}
                </div>
                <div className="text-sm text-slate-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {suggestions[0].location || suggestions[0].address}
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${getItemIconBg(suggestions[0].type)}`}>
                  {getItemIcon(suggestions[0].type)}
                </div>
                <button
                  onClick={() => handleAddSuggestionToItinerary(suggestions[0])}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-blue-600 transition-all duration-200 hover:scale-105 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add to Itinerary
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500">
              Click "Get More AI Suggestions" to see recommendations for this day.
            </div>
          )}

          {/* Get More Suggestions Button */}
          <button
            onClick={handleGetSuggestions}
            disabled={itineraryLoading}
            className="w-full p-4 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-200 flex items-center justify-center gap-2 mt-4 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            <Sparkles className="w-4 h-4" />
            {itineraryLoading ? 'Getting Suggestions...' : 'Get More AI Suggestions'}
          </button>
        </div>
      </main>

      <style jsx>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.4s ease forwards;
      }
    `}</style>
    </div>
  );

};

export default TravelSyncItineraries;