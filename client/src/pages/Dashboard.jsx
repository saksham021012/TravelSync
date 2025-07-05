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
import { getUserProfile } from "../services/Operations/profile";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trips, loading: tripLoading } = useSelector((state) => state.trip);
  const { user } = useSelector((state) => state.auth);
  const [schedule, setSchedule] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upcomingTrips, setUpcomingTrips] = useState([]);

  // to get today's date in YYYY-MM-DD format (local timezone)
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // to format date to YYYY-MM-DD format (local timezone)
  const formatDateToString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // to check if trip is upcoming or ongoing
  const isUpcomingOrOngoing = (trip) => {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    // upcoming if start date today or in the future
    // ongoing if today is between start and end date
    return endDate >= today;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await dispatch(getUserProfile());
        // Ensure it dispatches setUser internally
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [dispatch, user]);

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

  // fetch itineraries and alerts
  useEffect(() => {
    const fetchScheduleAndAlerts = async () => {
      if (!upcomingTrips || upcomingTrips.length === 0) return;

      setLoading(true);

      try {
        const todayString = getTodayString();

        console.log('Today string:', todayString);

        let allTodaysSchedules = [];
        let nearestTrip = null;
        let nearestTripDistance = Infinity;

        // Process each upcoming trip
        for (const trip of upcomingTrips) {
          const tripId = trip._id;
          if (!tripId) continue;

          try {
            // Fetch itineraries for this trip
            const itineraryRes = await dispatch(getItinerariesByTrip(tripId));

            // Extract itinerary data
            let itineraryData = [];
            if (Array.isArray(itineraryRes)) {
              itineraryData = itineraryRes;
            } else if (itineraryRes?.payload && Array.isArray(itineraryRes.payload)) {
              itineraryData = itineraryRes.payload;
            } else if (itineraryRes?.data && Array.isArray(itineraryRes.data)) {
              itineraryData = itineraryRes.data;
            }

            if (itineraryData.length > 0) {
              // Filter items for today only - using strict string comparison
              const todaysItems = itineraryData.filter((item) => {
                const itemDateString = formatDateToString(item.date);
                console.log('Comparing:', itemDateString, 'with', todayString);
                return itemDateString === todayString;
              });

              console.log('Today\'s items for trip', tripId, ':', todaysItems);

              // Add trip context to each schedule item
              const todaysItemsWithTrip = todaysItems.map(item => ({
                ...item,
                tripId: tripId,
                tripName: trip.title || trip.name || `Trip ${tripId}`,
                tripDestination: trip.destination || ''
              }));

              allTodaysSchedules.push(...todaysItemsWithTrip);

              // Calculate distance to today for this trip
              const tripDates = itineraryData.map(item => new Date(item.date));
              const minDate = new Date(Math.min(...tripDates));
              const maxDate = new Date(Math.max(...tripDates));
              const todayDate = new Date();

              let distanceToToday;
              if (todayDate < minDate) {
                distanceToToday = Math.abs(minDate - todayDate);
              } else if (todayDate > maxDate) {
                distanceToToday = Math.abs(todayDate - maxDate);
              } else {
                distanceToToday = 0;
              }

              if (distanceToToday < nearestTripDistance) {
                nearestTripDistance = distanceToToday;
                nearestTrip = trip;
              }
            } else {
              console.log(`No itinerary data for trip ${tripId}`);
            }

          } catch (tripError) {
            console.error(`Error fetching itinerary for trip ${tripId}:`, tripError);
          }
        }

        console.log('All today\'s schedules:', allTodaysSchedules);

        // Set all today's schedules
        setSchedule(allTodaysSchedules);

        // Fetch alerts for the nearest trip
        if (nearestTrip?._id) {
          try {
            const alertRes = await dispatch(getAlertsByTrip(nearestTrip._id));

            let alertData = [];
            if (Array.isArray(alertRes)) {
              alertData = alertRes;
            } else if (alertRes?.payload && Array.isArray(alertRes.payload)) {
              alertData = alertRes.payload;
            } else if (alertRes?.data && Array.isArray(alertRes.data)) {
              alertData = alertRes.data;
            }

            if (alertData.length > 0) {
              const recentAlerts = alertData.slice(-3).reverse();
              setAlerts(recentAlerts);
            } else {
              setAlerts([]);
            }

          } catch (alertError) {
            console.error("Error fetching alerts for nearest trip:", alertError);
            setAlerts([]);
          }
        } else {
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
      <nav className=" bg-white">
        <Sidebar />
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 animate-fade-in-up">
        {/* Header */}
        <header className="mb-10 ">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Traveler"}{"!"}
          </h1>
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