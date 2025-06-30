import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../components/Common/Sidebar";
import TripCard from "../components/Dashboard/TripCard";
import ScheduleItem from "../components/Dashboard/ScheduleItem";
import AlertItem from "../components/Dashboard/AlertItem";
import QuickActionButton from "../components/Dashboard/QuickActionButton";

import { getAllTrips } from "../services/Operations/trip";
import { getItinerariesByTrip } from "../services/Operations/itinerary";
import { getAlertsByTrip } from "../services/Operations/alert";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trips, loading: tripLoading } = useSelector((state) => state.trip);
  const [schedule, setSchedule] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upcomingTrips, setUpcomingTrips] = useState([]);

  // Helper function to format date consistently
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  // Helper function to check if trip is upcoming or ongoing
  const isUpcomingOrOngoing = (trip) => {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    
    // Trip is upcoming if start date is today or in the future
    // Trip is ongoing if today is between start and end date
    return endDate >= today;
  };

  // First: fetch trips once
  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  // Filter upcoming/ongoing trips when trips data changes
  useEffect(() => {
    if (trips && trips.length > 0) {
      const filteredTrips = trips.filter(isUpcomingOrOngoing);
      setUpcomingTrips(filteredTrips);
    } else {
      setUpcomingTrips([]);
    }
  }, [trips]);

  // Second: when trips are ready, fetch itineraries and alerts
  useEffect(() => {
    const fetchScheduleAndAlerts = async () => {
      if (!upcomingTrips || upcomingTrips.length === 0) return;
      
      const tripId = upcomingTrips[0]._id;
      if (!tripId) return;

      setLoading(true);
      
      try {
        // Fetch itineraries
        const itineraryRes = await dispatch(getItinerariesByTrip(tripId));
        console.log("Itinerary Response:", itineraryRes); // Debug log
        
        // Get today's date in consistent format
        const today = formatDate(new Date());
        console.log("Today's date:", today); // Debug log
        
        // Extract itinerary data - handle different possible structures
        let itineraryData = [];
        
        if (Array.isArray(itineraryRes)) {
          // If itineraryRes is directly an array
          itineraryData = itineraryRes;
        } else if (itineraryRes?.payload && Array.isArray(itineraryRes.payload)) {
          // If it's in payload
          itineraryData = itineraryRes.payload;
        } else if (itineraryRes?.data && Array.isArray(itineraryRes.data)) {
          // If it's in data
          itineraryData = itineraryRes.data;
        }
        
        console.log("Itinerary data:", itineraryData); // Debug log
        console.log("Itinerary data length:", itineraryData.length); // Debug log
        
        if (Array.isArray(itineraryData) && itineraryData.length > 0) {
          // Filter items for today - each item is an individual itinerary entry
          const todaysItems = itineraryData.filter((item) => {
            const itemDate = formatDate(item.date);
            console.log("Comparing item date:", itemDate, "with today:", today, "Match:", itemDate === today);
            return itemDate === today;
          });
          
          console.log("Today's items:", todaysItems);
          console.log("Today's items length:", todaysItems.length);
          setSchedule(todaysItems);
        } else {
          console.log("Itinerary data is empty or not an array:", itineraryData);
          setSchedule([]);
        }

        // Fetch alerts
        const alertRes = await dispatch(getAlertsByTrip(tripId));
        console.log("Alert Response:", alertRes); // Debug log
        
        // Extract alert data - based on your console log, it seems to be directly in the response
        let alertData = [];
        
        if (Array.isArray(alertRes)) {
          // If alertRes is directly an array
          alertData = alertRes;
        } else if (alertRes?.payload && Array.isArray(alertRes.payload)) {
          // If it's in payload
          alertData = alertRes.payload;
        } else if (alertRes?.data && Array.isArray(alertRes.data)) {
          // If it's in data
          alertData = alertRes.data;
        }
        
        console.log("Processed alert data:", alertData); // Debug log
        
        if (alertData.length > 0) {
          const recentAlerts = alertData.slice(-3).reverse();
          setAlerts(recentAlerts);
        } else {
          console.log("No alert data found");
          setAlerts([]);
        }
        
      } catch (error) {
        console.error("Error fetching schedule and alerts:", error);
        toast.error("Failed to load schedule and alerts");
        setSchedule([]);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleAndAlerts();
  }, [dispatch, upcomingTrips]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, John Doe</h1>
        </header>

        {/* Upcoming Trips */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Ongoing/Upcoming Trips</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tripLoading ? (
              <p className="text-gray-500">Loading trips...</p>
            ) : upcomingTrips.length > 0 ? (
              upcomingTrips.map((trip) => (
                <TripCard 
                  key={trip._id} 
                  trip={trip} 
                  onClick={() => navigate('/my-trips')}
                />
              ))
            ) : (
              <p className="text-gray-500">No upcoming trips found.</p>
            )}
          </div>
        </section>

        {/* Schedule & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <section>
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              {loading ? (
                <p className="text-gray-500">Loading schedule...</p>
              ) : schedule.length > 0 ? (
                schedule.map((item, i) => <ScheduleItem key={i} item={item} />)
              ) : (
                <p className="text-gray-500">No schedule items for today.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Alerts & Disruptions</h2>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              {loading ? (
                <p className="text-gray-500">Loading alerts...</p>
              ) : alerts.length > 0 ? (
                alerts.map((alert, i) => <AlertItem key={i} alert={alert} />)
              ) : (
                <p className="text-gray-500">No recent alerts.</p>
              )}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionButton
              icon="✈️"
              label="Plan New Trip"
              primary
              onClick={() => navigate('/my-trips')}
            />
            <QuickActionButton
              icon="📋"
              label="View All Trips"
              onClick={() => navigate('/my-trips')}
            />
            <QuickActionButton
              icon="📅"
              label="Manage Itinerary"
              onClick={() => navigate('/my-itineraries')}
            />
            <QuickActionButton
              icon="🔔"
              label="View All Alerts"
              onClick={() => navigate('/my-alerts')}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;