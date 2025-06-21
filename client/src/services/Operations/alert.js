import { apiConnector } from "../apiConnector";
import { alertEndpoints } from "../apis";
import { setAlerts, setLoading } from "../../slices/alertSlice";

const {
  GET_ALERTS_BY_TRIP,
  DELETE_ALERT_BY_ID,
  DELETE_ALERTS_BY_TRIP,
} = alertEndpoints;

// ========== GET ALERTS BY TRIP ==========
export const getAlertsByTrip = (tripId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ALERTS_BY_TRIP(tripId));
      console.log("GET_ALERTS_BY_TRIP RESPONSE:", response);

      if (!response.data.success || !Array.isArray(response.data.alerts)) {
        throw new Error("Failed to load alerts");
      }

      dispatch(setAlerts(response.data.alerts));
      return response.data.alerts;
    } catch (error) {
      console.error("GET_ALERTS_BY_TRIP ERROR:", error);
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ========== DELETE SINGLE ALERT BY ID ==========
export const deleteAlertById = (alertId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("DELETE", DELETE_ALERT_BY_ID(alertId));
      console.log("DELETE_ALERT_BY_ID RESPONSE:", response);

      if (!response.data.success) {
        throw new Error("Alert deletion failed");
      }

      return response.data.message;
    } catch (error) {
      console.error("DELETE_ALERT_BY_ID ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ========== DELETE ALL ALERTS FOR A TRIP ==========
export const deleteAllAlertsByTrip = (tripId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("DELETE", DELETE_ALERTS_BY_TRIP(tripId));
      console.log("DELETE_ALL_ALERTS_BY_TRIP RESPONSE:", response);

      if (!response.data.success) {
        throw new Error("Failed to delete trip alerts");
      }

      return response.data.message;
    } catch (error) {
      console.error("DELETE_ALL_ALERTS_BY_TRIP ERROR:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};
