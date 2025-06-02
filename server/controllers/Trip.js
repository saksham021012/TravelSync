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
    console.log("req.user is: ", req.user);
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user.userId });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // 1. Optionally delete old alerts linked to this trip (if you want a fresh start)
    // await Alert.deleteMany({ trip: trip._id });

    // 2. Clear the alerts array in the trip document
    await Trip.findByIdAndUpdate(trip._id, { $set: { alerts: [] } });

    const locations = trip.locations; // Locations from the trip

    // We'll collect all created alerts here
    let allCreatedAlerts = [];

    // Generate weather and news alerts per location sequentially to aggregate alerts
    for (const location of locations) {
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

    // Flight alerts
    if (trip.flightNumber) {
      const departureDate = new Date(trip.departureTime);
      const formattedDate = departureDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

      const flightAlerts = await generateAlert({
        user: req.user.userId,
        tripId: trip._id,
        type: 'flight',
        sentVia: 'none',
        flightNumber: trip.flightNumber,
        date: formattedDate,
      });

      allCreatedAlerts = allCreatedAlerts.concat(flightAlerts);
    }

    // Add newly created alert IDs to trip's alerts array
    if (allCreatedAlerts.length) {
      const alertIds = allCreatedAlerts.map(alert => alert._id);
      await Trip.findByIdAndUpdate(trip._id, {
        $addToSet: { alerts: { $each: alertIds } },
      });
    }

    // Send one email with all alerts
    if (allCreatedAlerts.length > 0) {
      const userDoc = await User.findById(req.user.userId);
      try {
        await mailSender(
          userDoc.email,
          "Your TravelSync Trip Alerts",
          alertSummaryTemplate(allCreatedAlerts)
        );
        console.log(`Alert email sent to ${userDoc.email}`);
      } catch (emailErr) {
        console.error("Error sending consolidated email:", emailErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Alerts created successfully for the trip",
      alerts: allCreatedAlerts,
    });
  } catch (error) {
    console.error("Error creating alerts for trip:", error);
    res.status(500).json({
      success: false,
      message: "Error creating alerts",
      error: error.message,
    });
  }
};



// Get all trips for a user
exports.getUserTrips = async (req, res) => {
  try {
    console.log("Fetching trips for user:", req.user.userId);
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
exports.updateTrip = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;

    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, startDate, endDate },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, trip: updatedTrip });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not update trip" });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, message: "Trip deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not delete trip" });
  }
};
