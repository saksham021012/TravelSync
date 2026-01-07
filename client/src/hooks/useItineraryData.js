import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getItinerariesByTrip } from '../services/Operations/itinerary';

const useItineraryData = (selectedTrip) => {
  const dispatch = useDispatch();
  const { schedule, loading } = useSelector(state => state.itinerary);
  
  useEffect(() => {
    if (selectedTrip?._id) {
      dispatch(getItinerariesByTrip(selectedTrip._id));
    }
  }, [selectedTrip, dispatch]);
  
  const refreshItineraries = () => {
    if (selectedTrip?._id) {
      dispatch(getItinerariesByTrip(selectedTrip._id));
    }
  };
  
  return { schedule, loading, refreshItineraries };
};

export default useItineraryData;