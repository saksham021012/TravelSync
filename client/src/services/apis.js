const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authEndpoints = {
    SIGNUP_API: BASE_URL + "/auth/register",
    LOGIN_API: BASE_URL + "/auth/login",
    SENDOTP_API: BASE_URL + "/auth/sendOtp",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    LOGOUT_API: BASE_URL + "/auth/logout",
};

// ========== TRIP ROUTES ==========
// export const tripEndpoints = {
//     CREATE_TRIP_API: BASE_URL + "/trips",
//     GET_ALL_TRIPS_API: BASE_URL + "/trips",
//     GET_TRIP_BY_ID_API: BASE_URL + "/trips",
//     UPDATE_TRIP_API: BASE_URL + "/trips",
//     DELETE_TRIP_API: BASE_URL + "/trips",
//     CREATE_ALERTS_FOR_TRIP_API: BASE_URL + "/trips/alerts/create",
// };
// services/apis.js

export const tripEndpoints = {
  CREATE_TRIP_API: BASE_URL + "/trips",              // POST
  GET_ALL_TRIPS_API: BASE_URL + "/trips",            // GET
  GET_TRIP_BY_ID_API: (id) => `${BASE_URL}/trips/${id}`,  // GET
  UPDATE_TRIP_API: (id) => `${BASE_URL}/trips/${id}`,     // PUT
  DELETE_TRIP_API: (id) => `${BASE_URL}/trips/${id}`,     // DELETE
  CREATE_ALERTS_FOR_TRIP_API: (id) => `${BASE_URL}/trips/alerts/create/${id}` // POST
};

// ========== FLIGHT SEGMENTS ==========
export const flightSegmentEndpoints = {
    GET_SEGMENTS_BY_TRIP: BASE_URL + "/segments",
    UPDATE_SEGMENT_API: BASE_URL + "/segments",
};

// // ========== ALERTS ==========
// export const alertEndpoints = {
//     GET_ALERTS_BY_TRIP: BASE_URL + "/alerts/trip",
//     DELETE_ALERT_BY_ID: BASE_URL + "/alerts",
//     DELETE_ALERTS_BY_TRIP: BASE_URL + "/alerts/trip",
// };

// // ========== ITINERARY ==========
// export const itineraryEndpoints = {
//     CREATE_ITINERARY_API: BASE_URL + "/itineraries",
//     GET_ITINERARIES_BY_TRIP: BASE_URL + "/itineraries/trip",
//     UPDATE_ITINERARY_API: BASE_URL + "/itineraries",
//     DELETE_ITINERARY_API: BASE_URL + "/itineraries",
//     GENERATE_SUGGESTIONS_API: BASE_URL + "/itineraries/ai/suggestions",
// };

// ========== ALERTS ==========
export const alertEndpoints = {
  GET_ALERTS_BY_TRIP: (tripId) => `${BASE_URL}/alerts/trip/${tripId}`,
  DELETE_ALERT_BY_ID: (alertId) => `${BASE_URL}/alerts/${alertId}`,
  DELETE_ALERTS_BY_TRIP: (tripId) => `${BASE_URL}/alerts/trip/${tripId}`,
};

// ========== ITINERARY ==========
export const itineraryEndpoints = {
  CREATE_ITINERARY_API: `${BASE_URL}/itineraries`,
  GET_ITINERARIES_BY_TRIP: (tripId) => `${BASE_URL}/itineraries/trip/${tripId}`,
  UPDATE_ITINERARY_API: (id) => `${BASE_URL}/itineraries/${id}`,
  DELETE_ITINERARY_API: (id) => `${BASE_URL}/itineraries/${id}`,
  GENERATE_SUGGESTIONS_API: `${BASE_URL}/itineraries/ai/suggestions`,
};


// ========== EMERGENCY SERVICES ==========
export const emergencyEndpoints = {
    GET_NEARBY_EMERGENCIES_API: BASE_URL + "/emergency/nearby",
};