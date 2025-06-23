const axios = require('axios');

const API_KEY = process.env.AERODATABOX_API_KEY;
if (!API_KEY) {
  throw new Error("AERODATABOX_API_KEY is not defined");
}

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

    const flight = response.data[0];
    if (!flight) return null;

    return {
      segmentType: 'departure',
      flightNumber: flight.number,
      airline: flight.airline?.name,

      departureAirport: flight.departure?.airport?.name,
      departureIATA: flight.departure?.airport?.iata,
      departureTimezone: flight.departure?.airport?.timeZone,
      scheduledDeparture: flight.departure?.scheduledTime?.local,
      scheduledDepartureUTC: flight.departure?.scheduledTime?.utc,
      revisedDeparture: flight.departure?.revisedTime?.local,
      revisedDepartureUTC: flight.departure?.revisedTime?.utc,
      runwayDeparture: flight.departure?.runwayTime?.local,
      runwayDepartureUTC: flight.departure?.runwayTime?.utc,

      arrivalAirport: flight.arrival?.airport?.name,
      arrivalIATA: flight.arrival?.airport?.iata,
      arrivalTimezone: flight.arrival?.airport?.timeZone,
      scheduledArrival: flight.arrival?.scheduledTime?.local,
      scheduledArrivalUTC: flight.arrival?.scheduledTime?.utc,
      revisedArrival: flight.arrival?.revisedTime?.local,
      revisedArrivalUTC: flight.arrival?.revisedTime?.utc,
      runwayArrival: flight.arrival?.runwayTime?.local,
      runwayArrivalUTC: flight.arrival?.runwayTime?.utc,

      status: flight.status,
      aircraftModel: flight.aircraft?.model,
      aircraftReg: flight.aircraft?.reg,
    };
  } catch (error) {
    console.error('Error fetching flight data:', error.message);
    throw new Error(`Could not fetch flight details: ${error.message}`);
  }
};

module.exports = { getFlightDetails };
