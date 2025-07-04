const cron = require("node-cron");
const Trip = require("../../models/Trip");
const Alert = require("../../models/Alert");
const User = require("../../models/User");
const { generateAlert } = require("../../config/generateAlert");
const mailSender = require("../../utils/mailSender");
const alertSummaryTemplate = require("../../mail/templates/alertSummaryTemplate");

// ⏰ Every 12 hours
cron.schedule("0 */12 * * *", async () => {
  console.log("🔔 Running scheduled alert generation + email job...");
  console.log(`[${new Date().toISOString()}] ⏰ Cron job triggered`);

  const now = new Date();

  try {
    const activeTrips = await Trip.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate("user");

    for (const trip of activeTrips) {
      const userId = trip.user._id;
      const userEmail = trip.user.email;
      const tripId = trip._id;

      // 🔁 Generate alerts for locations (always refresh weather & news)
      for (const location of trip.locations) {
        const city = location?.city;
        if (!city) continue;

        await generateAlert({
          user: userId,
          tripId,
          type: "weather",
          sentVia: "none",
          location: city,
        });

        await generateAlert({
          user: userId,
          tripId,
          type: "news",
          sentVia: "none",
          location: city,
        });
      }

      // ✈️ Flight alerts - Apply same smart interval logic
      if (trip.flightNumber) {
        const departureDate = new Date(trip.departureTime || trip.startDate);
        const formattedDate = departureDate.toISOString().split("T")[0];
        const hoursUntilDeparture = (departureDate - Date.now()) / (1000 * 60 * 60);

        // Check if we have existing flight alert
        const existingFlightAlert = await Alert.findOne({ 
          trip: tripId, 
          type: 'flight' 
        });

        // Apply same interval logic as manual checks
        let checkInterval;
        if (hoursUntilDeparture <= 24) {
          checkInterval = 6 * 60 * 60 * 1000; // 6 hours when close
        } else {
          checkInterval = 24 * 60 * 60 * 1000; // 24 hours when far out
        }

        const shouldCheckFlight = 
          !existingFlightAlert || 
          (Date.now() - new Date(existingFlightAlert.lastCheckedAt || 0).getTime() > checkInterval);

        if (shouldCheckFlight) {
          console.log(`✈️ Checking flight ${trip.flightNumber} for trip ${trip.title}`);
          await generateAlert({
            user: userId,
            tripId,
            type: "flight",
            sentVia: "none",
            flightNumber: trip.flightNumber,
            date: formattedDate,
          });
        } else {
          console.log(`⏭️ Skipping flight check for ${trip.flightNumber} (too recent)`);
        }
      }

      // ⏱️ Small delay to allow DB write
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 🔍 Fetch alerts from DB
      const allAlerts = await Alert.find({ trip: tripId });
      const alreadySent = allAlerts.filter((a) => a.emailSent);
      const newlyGenerated = allAlerts.filter((a) => !a.emailSent);

      // ✂️ Remove duplicates
      const unsentAlerts = newlyGenerated.filter((newAlert) => {
        return !alreadySent.some((old) =>
          old.type === newAlert.type &&
          old.title === newAlert.title &&
          (
            (old.location && newAlert.location && old.location === newAlert.location) ||
            (old.flightNumber && newAlert.flightNumber && old.flightNumber === newAlert.flightNumber)
          )
        );
      });

      // 📧 Send mail if needed
      if (unsentAlerts.length > 0) {
        try {
          await mailSender(
            userEmail,
            `TravelSync: New Alerts for Your Trip "${trip.title || "Trip"}"`,
            alertSummaryTemplate(unsentAlerts)
          );
          console.log(`📧 Sent alert email to ${userEmail} with ${unsentAlerts.length} alerts`);

          // ✅ Mark as emailed
          await Alert.updateMany(
            { _id: { $in: unsentAlerts.map((a) => a._id) } },
            { $set: { emailSent: true } }
          );
        } catch (emailErr) {
          console.error(`❌ Failed to send email to ${userEmail}:`, emailErr.message);
        }
      } else {
        console.log(`📭 No new alerts to send for ${userEmail}`);
      }
    }

    console.log("✅ Alert generation + email job completed");
  } catch (err) {
    console.error("🚨 Error in alert scheduler:", err.message);
  }
});