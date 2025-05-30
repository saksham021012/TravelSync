const Alert = require("../models/Alert");
const mailSender = require("../utils/mailSender");
const { getWeatherDetails } = require("../utils/weather");
const { getNewsAlerts } = require('../utils/news');
const { getFlightDetails } = require("../utils/flightApi");
const User = require("../models/User");
const alertSummaryTemplate = require("../mail/templates/alertSummaryTemplate.js");

const generateAlert = async ({ user, tripId, type, sentVia = 'email', location, flightNumber, title, message, date }) => {
  if (!user || !tripId || !type) {
    throw new Error("Missing required fields: user, tripId, or type");
  }

  const createdAlerts = [];
  const emailAlerts = [];

  try {
    if (!message) {
      switch (type) {
        case 'weather':
          message = `Severe weather expected in ${location || 'the area'}`;
          break;
        case 'news':
          message = `Latest news update for ${location || 'your destination'}`;
          break;
        case 'flight':
          message = `Flight ${flightNumber} status update`;
          break;
        default:
          message = `Alert for your trip to ${location || 'destination'}`;
      }
    }

    // Weather alerts
    if (type === "weather") {
      if (!location) throw new Error("Location is required for weather alerts");

      const alerts = await getWeatherDetails(location);
      if (!alerts.length) {
        const noAlert = await Alert.create({
          user: user._id || user,
          trip: tripId,
          type: "weather",
          title: "No severe weather alerts",
          message: `There are no active weather alerts for ${location}.`,
          sentVia,
        });
        createdAlerts.push(noAlert);
        if (sentVia === 'email') emailAlerts.push(noAlert);
      }

      // Limit to 2 alerts max
      for (let i = 0; i < Math.min(2, alerts.length); i++) {
        const a = alerts[i];
        const newAlert = await Alert.create({
          user: user._id || user,
          trip: tripId,
          type: "weather",
          title: a.headline || a.event || "Weather Alert",
          message: a.desc || message,
          sentVia,
        });
        createdAlerts.push(newAlert);
        if (sentVia === 'email') emailAlerts.push(newAlert);
      }
    }

    // News alerts
    else if (type === 'news') {
      if (!location) throw new Error("Location is required for news alerts");

      const news = await getNewsAlerts(location);
      if (!news.length) {
        // no alerts, do nothing or add no alert message if you want
      } else {
        for (let i = 0; i < Math.min(2, news.length); i++) {
          const n = news[i];
          const newAlert = await Alert.create({
            user: user._id || user,
            trip: tripId,
            type: "news",
            title: n.title,
            message: n.description || message,
            sentVia,
          });
          createdAlerts.push(newAlert);
          if (sentVia === 'email') emailAlerts.push(newAlert);
        }
      }
    }

    // Flight alerts
    else if (type === 'flight') {
      if (!flightNumber) throw new Error("Flight number is required for flight alerts");

      const flightData = await getFlightDetails(flightNumber, date);
      if (flightData && flightData.status) {
        const flightAlert = await Alert.create({
          user: user._id || user,
          trip: tripId,
          type: "flight",
          title: `Flight Status: ${flightData.status}`,
          message: `Flight ${flightNumber} is currently ${flightData.status} on ${date || 'the scheduled date'}`,
          sentVia,
        });
        createdAlerts.push(flightAlert);
        if (sentVia === 'email') emailAlerts.push(flightAlert);
      }
    }

    // Manual alerts
    else if (type === 'manual') {
      if (!title || !message) throw new Error("Manual alerts require title and message");

      const manualAlert = await Alert.create({
        user: user._id || user,
        trip: tripId,
        type,
        title,
        message,
        sentVia,
      });
      createdAlerts.push(manualAlert);
      if (sentVia === 'email') emailAlerts.push(manualAlert);
    }

    // Send consolidated email if needed
    if (sentVia === 'email' && emailAlerts.length) {
      const userDoc = await User.findById(user);
      try {
        await mailSender(userDoc.email, "Your TravelSync Trip Alerts", alertSummaryTemplate(emailAlerts));
        console.log(`Email sent successfully to ${userDoc.email}`);
      } catch (mailError) {
        console.error(`Failed to send email to ${userDoc.email}:`, mailError.message);
      }
    }

    return createdAlerts;

  } catch (error) {
    console.error("Error in generateAlert:", error.message);
    throw error;
  }
};

module.exports = {generateAlert}
