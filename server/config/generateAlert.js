const Alert = require("../models/Alert");
const mailSender = require("../utils/mailSender");
const { getWeatherDetails } = require("../utils/weather");
const { getNewsAlerts } = require('../utils/news');
const { getFlightDetails } = require("../utils/flightApi");
const User = require("../models/User");
const alertSummaryTemplate = require("../mail/templates/alertSummaryTemplate.js");

// Constants
const MAX_ALERTS_PER_TYPE = 2;

// Helper: Normalize user ID
function getUserId(user) {
  return user._id || user;
}

// Helper: Create default message
function getDefaultMessage(type, location, flightNumber) {
  const messages = {
    weather: `Severe weather expected in ${location || 'the area'}`,
    news: `Latest news update for ${location || 'your destination'}`,
    flight: `Flight ${flightNumber} status update`,
    default: `Alert for your trip to ${location || 'destination'}`
  };
  return messages[type] || messages.default;
}

// Helper: Build alert objects from weather data
function buildWeatherAlerts(weatherData, location, userId, tripId, sentVia) {
  if (!weatherData.length) {
    return [{
      user: userId,
      trip: tripId,
      type: "weather",
      title: "No severe weather alerts",
      message: `There are no active weather alerts for ${location}.`,
      sentVia
    }];
  }

  return weatherData.slice(0, MAX_ALERTS_PER_TYPE).map(alert => ({
    user: userId,
    trip: tripId,
    type: "weather",
    title: alert.headline || alert.event || "Weather Alert",
    message: alert.desc || `Severe weather expected in ${location}`,
    sentVia
  }));
}

// Helper: Build alert objects from news data
function buildNewsAlerts(newsData, userId, tripId, sentVia, defaultMessage) {
  if (!newsData.length) {
    console.log("No news alerts available");
    return [];
  }

  return newsData.slice(0, MAX_ALERTS_PER_TYPE).map(article => ({
    user: userId,
    trip: tripId,
    type: "news",
    title: article.title,
    message: article.description || defaultMessage,
    sentVia
  }));
}

// Helper: Build alert object from flight data
function buildFlightAlert(flightData, flightNumber, date, userId, tripId, sentVia) {
  if (!flightData?.status) {
    return null;
  }

  const status = flightData?.status || 'scheduled';

  return {
    user: userId,
    trip: tripId,
    type: "flight",
    title: `Flight Status: ${status}`,
    message: `Flight ${flightNumber} is currently ${flightData.status} on ${date || 'the scheduled date'}`,
    sentVia,
    lastCheckedAt: new Date()
  };
}

// Helper: Build manual alert object
function buildManualAlert(title, message, userId, tripId, sentVia) {
  return {
    user: userId,
    trip: tripId,
    type: "manual",
    title,
    message,
    sentVia
  };
}

// Helper: Send email notification
async function sendEmailNotification(userId, alerts) {
  if (!alerts.length) return;

  try {
    const userDoc = await User.findById(userId);
    if (!userDoc?.email) {
      console.warn(`No email found for user ${userId}`);
      return;
    }

    await mailSender(
      userDoc.email,
      "Your TravelSync Trip Alerts",
      alertSummaryTemplate(alerts)
    );
    console.log(`Email sent successfully to ${userDoc.email}`);
  } catch (error) {
    console.error(`Failed to send email notification:`, error.message);
    // Don't throw - email failure shouldn't break alert creation
  }
}

// Main function
const generateAlert = async ({
  user,
  tripId,
  type,
  sentVia = 'email',
  location,
  flightNumber,
  title,
  message,
  date
}) => {
  // Validate required fields
  if (!user || !tripId || !type) {
    throw new Error("Missing required fields: user, tripId, or type");
  }

  const userId = getUserId(user);
  const defaultMessage = message || getDefaultMessage(type, location, flightNumber);

  try {
    let alertsToCreate = [];

    // Generate alerts based on type
    switch (type) {
      case 'weather': {
        if (!location) throw new Error("Location is required for weather alerts");
        const weatherData = await getWeatherDetails(location);
        alertsToCreate = buildWeatherAlerts(weatherData, location, userId, tripId, sentVia);
        break;
      }

      case 'news': {
        if (!location) throw new Error("Location is required for news alerts");
        const newsData = await getNewsAlerts(location);
        alertsToCreate = buildNewsAlerts(newsData, userId, tripId, sentVia, defaultMessage);
        break;
      }

      case 'flight': {
        if (!flightNumber) throw new Error("Flight number is required for flight alerts");
        const flightData = await getFlightDetails(flightNumber, date);
        const flightAlert = buildFlightAlert(flightData, flightNumber, date, userId, tripId, sentVia);
        if (flightAlert) alertsToCreate = [flightAlert];
        break;
      }

      case 'manual': {
        if (!title || !message) throw new Error("Manual alerts require title and message");
        alertsToCreate = [buildManualAlert(title, message, userId, tripId, sentVia)];
        break;
      }

      default:
        throw new Error(`Unknown alert type: ${type}`);
    }

    // Bulk create alerts if any exist
    if (!alertsToCreate.length) {
      return [];
    }

    const createdAlerts = await Alert.insertMany(alertsToCreate);

    // Send email notification if requested
    if (sentVia === 'email') {
      await sendEmailNotification(userId, createdAlerts);
    }

    return createdAlerts;

  } catch (error) {
    console.error("Error in generateAlert:", error.message);
    throw error;
  }
};

module.exports = { generateAlert };