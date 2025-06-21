import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const { trips, loading: tripLoading } = useSelector((state) => state.trip);
  const [schedule, setSchedule] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // First: fetch trips once
useEffect(() => {
  dispatch(getAllTrips());
}, [dispatch]);

// Second: when trips are ready, fetch itineraries and alerts
useEffect(() => {
  const fetchScheduleAndAlerts = async () => {
    const tripId = trips?.[0]?._id;
    if (!tripId) return;

    const itineraryRes = await dispatch(getItinerariesByTrip(tripId));
    // toast.success("Itineraries loaded", { id: "itineraries-toast" });

    const today = new Date().toISOString().split("T")[0];
    const todaysItems =
      Array.isArray(itineraryRes?.payload) &&
      itineraryRes.payload
        .filter((entry) => entry.date === today)
        .flatMap((entry) => entry.items);

    setSchedule(todaysItems || []);

    const alertRes = await dispatch(getAlertsByTrip(tripId));
    // toast.success("Alerts loaded", { id: "alerts-toast" });

    const recent = alertRes?.payload?.slice(-3).reverse() || [];
    setAlerts(recent);
  };

  if (trips.length > 0) {
    fetchScheduleAndAlerts();
  }
}, [dispatch, trips]);


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, John Doe</h1>
        </header>

        {/* Upcoming Trips */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Upcoming Trips</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tripLoading ? (
              <p className="text-gray-500">Loading trips...</p>
            ) : trips.length > 0 ? (
              trips.map((trip) => <TripCard key={trip._id} trip={trip} />)
            ) : (
              <p className="text-gray-500">No trips found.</p>
            )}
          </div>
        </section>

        {/* Schedule & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <section>
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              {schedule.length > 0 ? (
                schedule.map((item, i) => <ScheduleItem key={i} item={item} />)
              ) : (
                <p className="text-gray-500">No schedule items for today.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Alerts & Disruptions</h2>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              {alerts.length > 0 ? (
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
              icon="➕"
              label="Plan New Trip"
              primary
              onClick={() => alert("Opening trip planner...")}
            />
            <QuickActionButton
              icon="📝"
              label="Edit Itinerary"
              onClick={() => alert("Opening itinerary editor...")}
            />
            <QuickActionButton
              icon="🗺️"
              label="View on Map"
              onClick={() => alert("Opening map view...")}
            />
            <QuickActionButton
              icon="🤖"
              label="Get AI Suggestions"
              onClick={() => alert("Generating AI suggestions...")}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
