import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import tripReducer from "../slices/tripSlice";
import itineraryReducer from "../slices/itinerarySlice";
import alertReducer from "../slices/alertSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  trip: tripReducer,
  itinerary: itineraryReducer,
  alert: alertReducer,
});

export default rootReducer;
