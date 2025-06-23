import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Common/Sidebar";
import FilterBar from "../components/Alerts/FilterBar";
import AlertCard from "../components/Alerts/AlertCard";
import EmptyState from "../components/Alerts/EmptyState";
import { getAllTrips } from "../services/Operations/trip";
import { getAlertsByTrip } from "../services/Operations/alert";

const AlertsPage = () => {
  const dispatch = useDispatch();
  const { alerts, loading } = useSelector((state) => state.alert);
  console.log("Redux alerts:", alerts);
  const { trips } = useSelector((state) => state.trip);

  const [filteredTripId, setFilteredTripId] = useState("all");
  const [filteredType, setFilteredType] = useState("all");

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  useEffect(() => {
    if (filteredTripId === "all") {
      trips.forEach((trip) => {
        dispatch(getAlertsByTrip(trip._id));
      });
    } else {
      dispatch(getAlertsByTrip(filteredTripId));
    }
  }, [filteredTripId, dispatch, trips]);

  const alertsByTrip = trips.reduce((acc, trip) => {
    acc[trip._id] = alerts.filter(
      (alert) =>
        (alert.trip?._id?.toString() === trip._id?.toString()) &&
        (filteredType === "all" || alert.type === filteredType)
    );
    return acc;
  }, {});


  const hasAlerts = trips.some(
    (trip) => (alertsByTrip[trip._id] || []).length > 0
  );

  const renderTripAlerts = () => {
    return trips.map((trip) => {
      const filteredAlerts = alertsByTrip[trip._id];
      if (!filteredAlerts || filteredAlerts.length === 0) return null;

      return (
        <div key={trip._id}>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {trip.title || "Unnamed Trip"}
          </h2>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert._id} alert={alert} />
            ))}
          </div>
        </div>
      );
    });
  };

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
          {hasAlerts ? renderTripAlerts() : !loading && <EmptyState />}
        </div>
      </main>
    </div>
  );
};

export default AlertsPage;
