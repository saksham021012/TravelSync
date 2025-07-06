import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";
import { emergencyEndpoints } from "../apis";
import { setLoading } from "../../slices/authSlice";

const { GET_NEARBY_EMERGENCIES_API } = emergencyEndpoints;

export const fetchEmergencyServices = (latitude, longitude) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    let result = [];

    try {
      const response = await apiConnector("GET", GET_NEARBY_EMERGENCIES_API(latitude, longitude));
      console.log("GET_EMERGENCY_SERVICES RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message || "Fetching emergency services failed");
      }

      result = response.data.services;
    } catch (error) {
      console.error("GET_EMERGENCY_SERVICES ERROR:", error);
      toast.error("Could not fetch emergency services.");
    } finally {
      dispatch(setLoading(false));
    }

    return result;
  };
};
