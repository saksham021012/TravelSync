const axios = require('axios');

const API_KEY = process.env.AERODATABOX_API_KEY;
if (!API_KEY) {
  throw new Error("AERODATABOX_API_KEY is not defined");
}

// Utility function to get flight details with timezone-aware info
const getFlightDetails = async (flightNumber, departureDate) => {
  const url = `https://aerodatabox.p.rapidapi.com/flights/number/${flightNumber}/${departureDate}`;

  const options = {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.get(url, options);
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.log("No flight data found for the given flight number and date.");
      return null;
    }

    const flight = response.data[0];  // pick first departure
    console.log("Response of flight api: ", flight)

    if (!flight) return null;

    return {
      segmentType: 'departure',
      flightNumber: flight.number,
      airline: flight.airline?.name,

      departureAirport: flight.departure?.airport?.name,
      departureIATA: flight.departure?.airport?.iata,
      scheduledDeparture: flight.departure?.scheduledTime.local,
      // actualDeparture: flight.departure?.predictedTime.local,
      scheduledDepartureUTC: flight.departure?.scheduledTime.utc,
      // actualDepartureUTC: flight.departure?.predictedTime.utc,
      departureTimezone: flight.departure?.timezone,

      arrivalAirport: flight.arrival?.airport?.name,
      arrivalIATA: flight.arrival?.airport?.iata,
      scheduledArrival: flight.arrival?.scheduledTime.local,
      actualArrival: flight.arrival?.predictedTime.local,
      scheduledArrivalUTC: flight.arrival?.scheduledTime.utc,
      actualArrivalUTC: flight.arrival?.predictedTime.utc,
      arrivalTimezone: flight.arrival?.timezone,

      status: flight.status,
    };
  } catch (error) {
    console.error('Error fetching flight data:', error);
    throw new Error(`Could not fetch flight details: ${error.message}`);
  }
};

module.exports = { getFlightDetails };
