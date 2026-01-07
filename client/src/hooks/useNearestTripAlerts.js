import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getItinerariesByTrip } from '../services/Operations/itinerary';
import { getAlertsByTrip } from '../services/Operations/alert';
import { normalizeApiResponse, calculateTripDistance } from '../utils/dashboardUtils';

const useNearestTripAlerts = (upcomingTrips, dispatch) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!upcomingTrips?.length) {
      setAlerts([]);
      return;
    }

    const fetchAlerts = async () => {
      setLoading(true);
      const today = new Date();

      try {
        // Find nearest trip by fetching all itineraries
        const tripDistances = await Promise.all(
          upcomingTrips.map(async (trip) => {
            try {
              const response = await dispatch(getItinerariesByTrip(trip._id));
              const itineraries = normalizeApiResponse(response);
              const dates = itineraries.map(item => item.date);
              const distance = calculateTripDistance(dates, today);
              return { trip, distance };
            } catch (error) {
              return { trip, distance: Infinity, error };
            }
          })
        );

        // Get trip with minimum distance
        const nearestTrip = tripDistances.reduce((nearest, current) => 
          current.distance < nearest.distance ? current : nearest
        ).trip;

        // Fetch alerts for nearest trip
        const alertResponse = await dispatch(getAlertsByTrip(nearestTrip._id));
        const alertData = normalizeApiResponse(alertResponse);
        
        // Get 3 most recent alerts
        const recentAlerts = alertData.slice(-3).reverse();
        setAlerts(recentAlerts);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        toast.error("Failed to load alerts");
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [upcomingTrips, dispatch]);

  return { alerts, loading };
};

export default useNearestTripAlerts;