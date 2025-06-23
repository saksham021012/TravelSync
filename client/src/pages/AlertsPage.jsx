import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Common/Sidebar";
import FilterBar from "../components/Alerts/FilterBar";
import AlertCard from "../components/Alerts/AlertCard";
import EmptyState from "../components/Alerts/EmptyState";
import { getAllTrips } from "../services/Operations/trip";
import { getAlertsByTrip } from "../services/Operations/alert";
import {createTripAlerts} from "../services/Operations/trip"
import AlertSpinner from "../components/Alerts/AlertSpinner";

const AlertsPage = () => {
  const dispatch = useDispatch();
  const { alerts, loading } = useSelector((state) => state.alert);
  const { trips } = useSelector((state) => state.trip);

  const [filteredTripId, setFilteredTripId] = useState("");
  const [filteredType, setFilteredType] = useState("all");
  const [alertsLoading, setAlertsLoading] = useState(false);

  // Load all trips on mount
  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  // Auto-select first trip once trips load
  useEffect(() => {
    if (trips.length > 0 && !filteredTripId) {
      setFilteredTripId(trips[0]._id);
    }
  }, [trips, filteredTripId]);

  // Fetch alerts whenever filteredTripId changes
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!filteredTripId) return;
      setAlertsLoading(true);
      await dispatch(createTripAlerts(filteredTripId));
      await dispatch(getAlertsByTrip(filteredTripId));
      setAlertsLoading(false);
    };

    fetchAlerts();
  }, [filteredTripId, dispatch]);

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.trip?._id === filteredTripId &&
      (filteredType === "all" || alert.type === filteredType)
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <Sidebar />
      <main className="flex-1 ml-[280px] p-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Alerts</h1>

        <FilterBar
          trips={trips}
          filteredTripId={filteredTripId}
          setFilteredTripId={setFilteredTripId}
          filteredType={filteredType}
          setFilteredType={setFilteredType}
        />

        <div className="space-y-12 mt-8">
          {alertsLoading ? (
            <AlertSpinner />
          ) : filteredAlerts.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {
                  trips.find((t) => t._id === filteredTripId)?.title ||
                  "Unnamed Trip"
                }
              </h2>
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <AlertCard key={alert._id} alert={alert} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    </div>
  );
};

export default AlertsPage;
