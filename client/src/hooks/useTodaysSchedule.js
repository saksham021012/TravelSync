import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getItinerariesByTrip } from '../services/Operations/itinerary';
import { formatDate, getTodayString, normalizeApiResponse } from '../utils/dashboardUtils';

const useTodaysSchedule = (upcomingTrips, dispatch) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!upcomingTrips?.length) {
      setSchedule([]);
      return;
    }

    const fetchSchedule = async () => {
      setLoading(true);
      const todayString = getTodayString();

      try {
        // Fetch all itineraries in parallel
        const itineraryPromises = upcomingTrips.map(async (trip) => {
          try {
            const response = await dispatch(getItinerariesByTrip(trip._id));
            const itineraries = normalizeApiResponse(response);

            // Filter for today and add trip context
            return itineraries
              .filter(item => formatDate(item.date) === todayString)
              .map(item => ({
                ...item,
                tripId: trip._id,
                tripName: trip.title || trip.name || `Trip ${trip._id}`,
                tripDestination: trip.destination || ''
              }));
          } catch (error) {
            console.error(`Failed to fetch itinerary for trip ${trip._id}:`, error);
            return [];
          }
        });

        const results = await Promise.all(itineraryPromises);
        const allSchedules = results.flat();
        setSchedule(allSchedules);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        toast.error("Failed to load today's schedule");
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [upcomingTrips, dispatch]);

  return { schedule, loading };
};

export default useTodaysSchedule;