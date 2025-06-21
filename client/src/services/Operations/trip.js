import { apiConnector } from "../apiConnector";
import { tripEndpoints } from "../apis";
import { setTrips, setLoading } from "../../slices/tripSlice";

const {
  CREATE_TRIP_API,
  GET_ALL_TRIPS_API,
  GET_TRIP_BY_ID_API,
  UPDATE_TRIP_API,
  DELETE_TRIP_API,
  CREATE_ALERTS_FOR_TRIP_API,
} = tripEndpoints;

// ===== GET ALL USER TRIPS =====
export const getAllTrips = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ALL_TRIPS_API);
      console.log("GET_ALL_TRIPS RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setTrips(response.data.trips));
    } catch (error) {
      console.error("GET_ALL_TRIPS ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ===== GET TRIP BY ID =====
export const getTripById = (tripId) => {
  return async () => {
    try {
      const response = await apiConnector("GET", GET_TRIP_BY_ID_API(tripId));
      console.log("GET_TRIP_BY_ID RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.trip;
    } catch (error) {
      console.error("GET_TRIP_BY_ID ERROR:", error);
    }
  };
};

// ===== CREATE A TRIP =====
export const createTrip = (tripData, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", CREATE_TRIP_API, tripData);
      console.log("CREATE_TRIP RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      navigate("/dashboard");
      return response.data.trip;
    } catch (error) {
      console.error("CREATE_TRIP ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ===== UPDATE A TRIP =====
export const updateTrip = (tripId, updatedData) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("PUT", UPDATE_TRIP_API(tripId), updatedData);
      console.log("UPDATE_TRIP RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.trip;
    } catch (error) {
      console.error("UPDATE_TRIP ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ===== DELETE A TRIP =====
export const deleteTrip = (tripId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("DELETE", DELETE_TRIP_API(tripId));
      console.log("DELETE_TRIP RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.message;
    } catch (error) {
      console.error("DELETE_TRIP ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ===== CREATE ALERTS FOR TRIP =====
export const createTripAlerts = (tripId) => {
  return async () => {
    try {
      const response = await apiConnector("POST", CREATE_ALERTS_FOR_TRIP_API(tripId));
      console.log("CREATE_ALERTS_FOR_TRIP RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.alerts;
    } catch (error) {
      console.error("CREATE_ALERTS_FOR_TRIP ERROR:", error);
    }
  };
};
