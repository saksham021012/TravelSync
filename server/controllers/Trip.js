const Trip = require('../models/Trip');
const { getFlightDetails } = require('../utils/flightApi');
const { generateAlert } = require("../config/generateAlert")
const User = require('../models/User');
const Alert = require('../models/Alert');
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
    let status = (flight.status || '').toLowerCase();
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


exports.createAlertsForTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user.userId });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const locations = trip.locations || [];

    // 1. Fetch existing alerts for the trip
    const existingAlerts = await Alert.find({ trip: trip._id });

    const existingFlightAlert = existingAlerts.find(a => a.type === 'flight');
    const weatherNewsAlerts = existingAlerts.filter(a =>
      ['weather', 'news'].includes(a.type)
    );

    // 2. Delete only weather and news alerts (to refresh them)
    if (weatherNewsAlerts.length > 0) {
      const idsToDelete = weatherNewsAlerts.map(a => a._id);
      await Alert.deleteMany({ _id: { $in: idsToDelete } });

      // Also remove from trip.alerts array
      await Trip.findByIdAndUpdate(trip._id, {
        $pull: { alerts: { $in: idsToDelete } },
      });
    }

    // 3. Start fresh collection for new alerts
    let allCreatedAlerts = [];

    // 4. Generate weather and news alerts per location
    for (const location of locations) {
      if (!location.city) {
        console.warn("Skipping location without city:", location);
        continue;
      }

      const weatherAlerts = await generateAlert({
        user: req.user.userId,
        tripId: trip._id,
        type: 'weather',
        sentVia: 'none',
        location: location.city,
      });


      const newsAlerts = await generateAlert({
        user: req.user.userId,
        tripId: trip._id,
        type: 'news',
        sentVia: 'none',
        location: location.city,
      });

      allCreatedAlerts = allCreatedAlerts.concat(weatherAlerts, newsAlerts);
    }

    // 5. Only generate flight alert if not already present
    if (trip.flightNumber) {
      const departureDate = new Date(trip.departureTime);
      const formattedDate = departureDate.toISOString().split("T")[0];
      const hoursUntilDeparture = (departureDate - Date.now()) / (1000 * 60 * 60);

      let checkInterval;
      if (hoursUntilDeparture <= 24) {
        checkInterval = 6 * 60 * 60 * 1000; // 4 hours when close
      } else {
        checkInterval = 24 * 60 * 60 * 1000; // 24 hours when far out
      }

      const shouldCheckFlight =
        !existingFlightAlert ||
        (Date.now() - new Date(existingFlightAlert.lastCheckedAt || 0).getTime() > checkInterval);

      if (shouldCheckFlight) {
        const flightAlerts = await generateAlert({
          user: req.user.userId,
          tripId: trip._id,
          type: "flight",
          sentVia: "none",
          flightNumber: trip.flightNumber,
          date: formattedDate,
        });

        // Update lastCheckedAt for the flight alert
        if (flightAlerts.length > 0) {
          await Alert.updateOne(
            { _id: flightAlerts[0]._id },
            { lastCheckedAt: new Date() }
          );
        }

        allCreatedAlerts = allCreatedAlerts.concat(flightAlerts);
      }
    }

    // 6. Add new alerts to the trip document
    if (allCreatedAlerts.length > 0) {
      const alertIds = allCreatedAlerts.map(alert => alert._id);
      await Trip.findByIdAndUpdate(trip._id, {
        $addToSet: { alerts: { $each: alertIds } },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alerts created successfully for the trip",
      alerts: allCreatedAlerts,
    });
  } catch (error) {
    console.error("Error creating alerts for trip:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating alerts",
      error: error.message,
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

    res.status(200).json({ success: true, message: "Trip deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not delete trip" });
  }
};
