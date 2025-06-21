import { apiConnector } from "../apiConnector";
import { itineraryEndpoints } from "../apis";
import { setSchedule, setLoading } from "../../slices/itinerarySlice";

const {
  CREATE_ITINERARY_API,
  GET_ITINERARIES_BY_TRIP,
  UPDATE_ITINERARY_API,
  DELETE_ITINERARY_API,
  GENERATE_SUGGESTIONS_API,
} = itineraryEndpoints;

// ========== CREATE ITINERARY ==========
export const createItinerary = (tripId, date, items) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", CREATE_ITINERARY_API, {
        tripId,
        date,
        items,
      });
      console.log("CREATE_ITINERARY RESPONSE:", response);

      if (!response.data || !response.data._id) {
        throw new Error("Itinerary creation failed");
      }

      return response.data;
    } catch (error) {
      console.error("CREATE_ITINERARY ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ========== GET ITINERARIES FOR A TRIP ==========
export const getItinerariesByTrip = (tripId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ITINERARIES_BY_TRIP(tripId));
      console.log("GET_ITINERARIES RESPONSE:", response);

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid itinerary data received");
      }

      dispatch(setSchedule(response.data));
      return response.data;
    } catch (error) {
      console.error("GET_ITINERARIES ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ========== UPDATE ITINERARY ==========
export const updateItinerary = (id, tripId, date, items) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("PUT", UPDATE_ITINERARY_API(id), {
        tripId,
        date,
        items,
      });
      console.log("UPDATE_ITINERARY RESPONSE:", response);

      if (!response.data || !response.data._id) {
        throw new Error("Itinerary update failed");
      }

      return response.data;
    } catch (error) {
      console.error("UPDATE_ITINERARY ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ========== DELETE ITINERARY ==========
export const deleteItinerary = (id) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("DELETE", DELETE_ITINERARY_API(id));
      console.log("DELETE_ITINERARY RESPONSE:", response);

      if (!response.data.message?.includes("deleted")) {
        throw new Error("Itinerary deletion failed");
      }

      return response.data;
    } catch (error) {
      console.error("DELETE_ITINERARY ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ========== GENERATE AI SUGGESTIONS ==========
export const generateSuggestions = (locations, days, preferences) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", GENERATE_SUGGESTIONS_API, {
        locations,
        days,
        preferences,
      });
      console.log("GENERATE_SUGGESTIONS RESPONSE:", response);

      if (!response.data.success || !response.data.suggestions) {
        throw new Error("AI suggestion generation failed");
      }

      return response.data.suggestions;
    } catch (error) {
      console.error("GENERATE_SUGGESTIONS ERROR:", error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};
