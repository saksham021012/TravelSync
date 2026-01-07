import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Common/Sidebar";
import TripCard from "../components/Dashboard/TripCard";
import ScheduleItem from "../components/Dashboard/ScheduleItem";
import AlertItem from "../components/Dashboard/AlertItem";
import QuickActionButton from "../components/Dashboard/QuickActionButton";

import { getAllTrips } from "../services/Operations/trip";
import { getUserProfile } from "../services/Operations/profile";

import useTodaysSchedule from "../hooks/useTodaysSchedule";
import useNearestTripAlerts from "../hooks/useNearestTripAlerts";
import { isUpcomingOrOngoing } from "../utils/dashboardUtils";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trips, loading: tripLoading } = useSelector((state) => state.trip);
  const { user } = useSelector((state) => state.auth);

  // Fetch user profile if not loaded
  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile()).catch(error => {
        console.error("Failed to fetch user profile:", error);
      });
    }
  }, [dispatch, user]);

  // Fetch all trips
  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  // Derive upcoming trips from trips state
  const upcomingTrips = useMemo(() => {
    return trips?.filter(isUpcomingOrOngoing) || [];
  }, [trips]);

  // Fetch schedule and alerts using custom hooks
  const { schedule, loading: scheduleLoading } = useTodaysSchedule(upcomingTrips, dispatch);
  const { alerts, loading: alertsLoading } = useNearestTripAlerts(upcomingTrips, dispatch);

  // Quick actions configuration
  const quickActions = [
    {
      icon: "✈️",
      label: "Plan New Trip",
      primary: true,
      onClick: () => navigate('/my-trips')
    },
    {
      icon: "🆘",
      label: "Need Help?",
      onClick: () => navigate("/my-alerts")
    },
    {
      icon: "📅",
      label: "Manage Itinerary",
      onClick: () => navigate('/my-itineraries')
    },
    {
      icon: "🔔",
      label: "View All Alerts",
      onClick: () => navigate('/my-alerts')
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800">
      {/* Sidebar */}
      <nav className="bg-white">
        <Sidebar />
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 animate-fade-in-up">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Traveler"}!
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
          {/* Today's Schedule */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              {scheduleLoading ? (
                <p className="text-gray-500">Loading schedule...</p>
              ) : schedule.length > 0 ? (
                schedule.map((item, i) => <ScheduleItem key={i} item={item} />)
              ) : (
                <p className="text-gray-500">No schedule items for today.</p>
              )}
            </div>
          </section>

          {/* Recent Alerts */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Alerts & Disruptions</h2>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              {alertsLoading ? (
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
            {quickActions.map((action, i) => (
              <QuickActionButton key={i} {...action} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;