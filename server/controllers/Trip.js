const Trip = require('../models/Trip');
const { getFlightDetails } = require('../utils/flightApi');
const { generateAlert } = require("../config/generateAlert")
const User = require('../models/User');
const Alert = require('../models/Alert');
const Itinerary = require("../models/Itinerary");
const mailSender = require('../utils/mailSender');
const alertSummaryTemplate = require('../mail/templates/alertSummaryTemplate');



// Create a new trip


exports.createTrip = async (req, res) => {
  try {
    const { title, startDate, endDate, flightNumber, userLocations = [] } = req.body;
    const user = req.user;

    if (!title || !startDate || !endDate || !flightNumber) {
      return res.status(400).json({
        success: false,
        message: "Title, startDate, endDate, and flightNumber are required",
      });
    }

    // Fetch flight details from utility
    const flight = await getFlightDetails(flightNumber, startDate);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight details not found for the given flight number and date",
      });
    }

    // Combine user locations and arrival city (layovers not included currently)
    const userLocationsData = userLocations.map(loc => ({
      city: loc.city,
      country: loc.country,
      arrivalTime: loc.arrivalTime,
      departureTime: loc.departureTime,
    }));

    const locations = [...userLocationsData];

    // Add final arrival destination as location
    locations.push({
      city: flight.arrivalAirport || "Unknown City",
      country: "Unknown Country", // Country not included in utility result
      arrivalTime: flight.scheduledArrivalUTC || null,
      departureTime: null,
    });

    // Normalize flight status
    const validStatuses = ['scheduled', 'delayed', 'cancelled', 'landed'];
    let status = (flight.status || 'scheduled').toLowerCase();
    if (status === 'expected') status = 'scheduled';
    if (!validStatuses.includes(status)) status = 'scheduled';

    // Create trip
    const trip = await Trip.create({
      user: user.userId,
      title,
      startDate,
      endDate,
      flightNumber,
      airline: flight.airline || "Unknown Airline",

      departureAirport: {
        code: flight.departureIATA || "N/A",
        name: flight.departureAirport || "N/A",
        city: null,       // Not included in utility yet
        country: null,
      },
      arrivalAirport: {
        code: flight.arrivalIATA || "N/A",
        name: flight.arrivalAirport || "N/A",
        city: null,
        country: null,
      },

      departureTime: new Date(flight.scheduledDepartureUTC),
      arrivalTime: new Date(flight.scheduledArrivalUTC),
      status,
      locations,
    });

    // if (flight.segments && flight.segments.length > 0) {
    //   const segmentDocs = flight.segments.map(seg => ({
    //     tripId: trip._id,
    //     segmentType: seg.segmentType, // 'departure' | 'stopover' | 'arrival'
    //     flightNumber: seg.flightNumber || flightNumber,
    //     airline: seg.airline || flight.airline,
    //     airportCode: seg.airportCode,
    //     airportName: seg.airportName,
    //     city: seg.city,
    //     country: seg.country,
    //     scheduledDeparture: seg.scheduledDeparture,
    //     scheduledArrival: seg.scheduledArrival,
    //     actualDeparture: seg.actualDeparture,
    //     actualArrival: seg.actualArrival,
    //     status: seg.status || 'scheduled',
    //     gateInfo: seg.gateInfo || {},
    //     departureTimezone: seg.departureTimezone,
    //     arrivalTimezone: seg.arrivalTimezone,
    //     localScheduledDeparture: seg.localScheduledDeparture,
    //     localScheduledArrival: seg.localScheduledArrival,
    //     localActualDeparture: seg.localActualDeparture,
    //     localActualArrival: seg.localActualArrival,
    //   }));

    //   await FlightSegment.insertMany(segmentDocs);
    // }

    await User.findByIdAndUpdate(user.userId, {
      $addToSet: { trips: trip._id }
    });

    return res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip,
    });

  } catch (error) {
    console.error("Error creating trip:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//alerts
// Constants
const HOURS_IN_MS = 60 * 60 * 1000;
const FLIGHT_COMPLETED_THRESHOLD_HOURS = -4;
const FREQUENT_CHECK_INTERVAL_HOURS = 6;
const STANDARD_CHECK_INTERVAL_HOURS = 24;
const URGENT_FLIGHT_THRESHOLD_HOURS = 24;

// Helper: Delete existing weather and news alerts
async function deleteWeatherAndNewsAlerts(tripId) {
  const existingAlerts = await Alert.find({ trip: tripId });
  const weatherNewsAlerts = existingAlerts.filter(a =>
    ['weather', 'news'].includes(a.type)
  );

  if (weatherNewsAlerts.length > 0) {
    const idsToDelete = weatherNewsAlerts.map(a => a._id);
    await Alert.deleteMany({ _id: { $in: idsToDelete } });
    await Trip.findByIdAndUpdate(tripId, {
      $pull: { alerts: { $in: idsToDelete } }
    });
  }

  return existingAlerts.find(a => a.type === 'flight');
}

// Helper: Generate weather and news alerts for locations
async function generateLocationAlerts(locations, userId, tripId) {
  const allAlerts = [];

  for (const location of locations) {
    if (!location.city) {
      console.warn("Skipping location without city:", location);
      continue;
    }

    const alertParams = {
      user: userId,
      tripId,
      sentVia: 'none',
      location: location.city
    };

    const [weatherAlerts, newsAlerts] = await Promise.all([
      generateAlert({ ...alertParams, type: 'weather' }),
      generateAlert({ ...alertParams, type: 'news' })
    ]);

    allAlerts.push(...weatherAlerts, ...newsAlerts);
  }

  return allAlerts;
}

// Helper: Create completed flight alert
async function createCompletedFlightAlert(userId, tripId, flightNumber, formattedDate) {
  const completedAlert = new Alert({
    user: userId,
    trip: tripId,
    type: "flight",
    title: `Flight ${flightNumber} Status: Completed`,
    message: "Flight has completed",
    priority: "low",
    sentVia: "none",
    lastCheckedAt: new Date(),
    flightNumber,
    date: formattedDate
  });

  const savedAlert = await completedAlert.save();

  await Trip.findByIdAndUpdate(tripId, {
    $addToSet: { alerts: savedAlert._id }
  });

  return savedAlert;
}

// Helper: Create placeholder flight alert
async function createPlaceholderFlightAlert(userId, tripId, flightNumber, formattedDate) {
  const placeholderAlert = new Alert({
    user: userId,
    trip: tripId,
    type: "flight",
    title: "Flight Status",
    message: "Checking flight status...",
    priority: "medium",
    sentVia: "none",
    lastCheckedAt: new Date(),
    flightNumber,
    date: formattedDate
  });

  const savedAlert = await placeholderAlert.save();

  await Trip.findByIdAndUpdate(tripId, {
    $addToSet: { alerts: savedAlert._id }
  });

  return savedAlert;
}

// Helper: Check if flight status should be refreshed
function shouldRefreshFlightStatus(existingAlert, hoursUntilDeparture) {
  if (!existingAlert) return true;

  const checkInterval = hoursUntilDeparture <= URGENT_FLIGHT_THRESHOLD_HOURS
    ? FREQUENT_CHECK_INTERVAL_HOURS * HOURS_IN_MS
    : STANDARD_CHECK_INTERVAL_HOURS * HOURS_IN_MS;

  const lastChecked = new Date(existingAlert.lastCheckedAt || 0).getTime();
  return Date.now() - lastChecked > checkInterval;
}

// Helper: Fetch and update flight alerts
async function fetchFlightAlerts(userId, tripId, flightNumber, formattedDate, placeholderAlert) {
  try {
    const flightAlerts = await generateAlert({
      user: userId,
      tripId,
      type: "flight",
      sentVia: "none",
      flightNumber,
      date: formattedDate
    });

    console.log("Flight alerts generated:", flightAlerts.length);

    if (flightAlerts.length > 0) {
      // Replace placeholder with actual flight alerts
      await Alert.deleteOne({ _id: placeholderAlert._id });
      // 1. Remove placeholder
      await Trip.findByIdAndUpdate(tripId, {
        $pull: { alerts: placeholderAlert._id }
      });

      // 2. Add real flight alerts
      await Trip.findByIdAndUpdate(tripId, {
        $addToSet: { alerts: { $each: flightAlerts.map(a => a._id) } }
      });

      return flightAlerts;
    }

    // No alerts returned, keep placeholder
    return [placeholderAlert];
  } catch (error) {
    console.error("Flight API call failed:", error);
    return [placeholderAlert];
  }
}

// Helper: Handle active flight alerts
async function handleActiveFlightAlert(trip, userId, existingFlightAlert) {
  const departureDate = new Date(trip.departureTime);
  const formattedDate = departureDate.toISOString().split("T")[0];
  const hoursUntilDeparture = (departureDate.getTime() - Date.now()) / HOURS_IN_MS;

  console.log("Flight:", trip.flightNumber, "Hours until departure:", hoursUntilDeparture);

  const shouldCheck = shouldRefreshFlightStatus(existingFlightAlert, hoursUntilDeparture);
  console.log("Should check flight:", shouldCheck);

  if (!shouldCheck) {
    console.log("Using existing flight alert");
    return existingFlightAlert ? [existingFlightAlert] : [];
  }

  console.log("Calling flight API...");

  // Update existing or create new placeholder
  let placeholderAlert;
  if (existingFlightAlert) {
    await Alert.updateOne(
      { _id: existingFlightAlert._id },
      { lastCheckedAt: new Date() }
    );
    placeholderAlert = existingFlightAlert;
  } else {
    placeholderAlert = await createPlaceholderFlightAlert(
      userId,
      trip._id,
      trip.flightNumber,
      formattedDate
    );
  }

  return await fetchFlightAlerts(
    userId,
    trip._id,
    trip.flightNumber,
    formattedDate,
    placeholderAlert
  );
}

// Helper: Handle flight alerts (completed or active)
async function handleFlightAlerts(trip, userId, existingFlightAlert) {
  if (!trip.flightNumber) {
    console.log("No flight number found for trip");
    return [];
  }

  const departureDate = new Date(trip.departureTime);
  const formattedDate = departureDate.toISOString().split("T")[0];
  const hoursUntilDeparture = (departureDate.getTime() - Date.now()) / HOURS_IN_MS;

  // Flight completed - return simple alert
  if (hoursUntilDeparture < FLIGHT_COMPLETED_THRESHOLD_HOURS) {
    console.log("Flight completed, skipping API call");

    if (existingFlightAlert) {
      return [existingFlightAlert];
    }

    const completedAlert = await createCompletedFlightAlert(
      userId,
      trip._id,
      trip.flightNumber,
      formattedDate
    );
    return [completedAlert];
  }

  // Flight is active
  return await handleActiveFlightAlert(trip, userId, existingFlightAlert);
}

// Main controller
exports.createAlertsForTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    // Delete old weather/news alerts and get existing flight alert
    const existingFlightAlert = await deleteWeatherAndNewsAlerts(trip._id);

    // Generate location-based alerts (weather & news)
    const locationAlerts = await generateLocationAlerts(
      trip.locations || [],
      req.user.userId,
      trip._id
    );

    // Handle flight alerts
    const flightAlerts = await handleFlightAlerts(
      trip,
      req.user.userId,
      existingFlightAlert
    );

    // Combine all alerts
    const allCreatedAlerts = [...locationAlerts, ...flightAlerts];

    // Update trip with new alert IDs
    if (allCreatedAlerts.length > 0) {
      const alertIds = allCreatedAlerts.map(alert => alert._id);
      await Trip.findByIdAndUpdate(trip._id, {
        $addToSet: { alerts: { $each: alertIds } }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alerts created successfully for the trip",
      alerts: allCreatedAlerts
    });
  } catch (error) {
    console.error("Error creating alerts for trip:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating alerts",
      error: error.message
    });
  }
};

// Get all trips for a user
exports.getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.userId }).sort({ startDate: 1 });
    res.status(200).json({ message: "User trips fetched", success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch trips" });
  }
};

// Get a specific trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user.userId })
      .populate('alerts');
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    res.status(200).json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch trip" });
  }
};

// Update a trip
// Update a trip - FIXED VERSION (no flight number updates)
exports.updateTrip = async (req, res) => {
  try {
    const { title, startDate, endDate, userLocations = [] } = req.body;

    // Process userLocations the same way as in createTrip
    const userLocationsData = userLocations.map(loc => ({
      city: loc.city,
      country: loc.country,
      arrivalTime: loc.arrivalTime,
      departureTime: loc.departureTime,
    }));

    // Get the existing trip to preserve the flight destination location
    const existingTrip = await Trip.findOne({ _id: req.params.id, user: req.user.userId });
    if (!existingTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Keep the flight destination location (last location) and update user locations
    const flightDestination = existingTrip.locations[existingTrip.locations.length - 1];
    const locations = [...userLocationsData, flightDestination];

    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      {
        title,
        startDate,
        endDate,
        locations
      },
      { new: true }
    );

    res.status(200).json({ success: true, trip: updatedTrip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ success: false, message: "Could not update trip", error: error.message });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    console.log("Received DELETE request for tripId:", req.params.id);
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Trip ID is required" });
    }

    const deletedTrip = await Trip.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!deletedTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Delete related alerts and itinerary
    await Alert.deleteMany({ tripId: id });
    await Itinerary.deleteMany({ tripId: id }),

      res.status(200).json({ success: true, message: "Trip and related alerts deleted" });
  } catch (error) {
    console.error("Error deleting trip and alerts:", error);
    res.status(500).json({ success: false, message: "Could not delete trip" });
  }
};
