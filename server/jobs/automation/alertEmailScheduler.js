const cron = require("node-cron");
const Trip = require("../../models/Trip");
const Alert = require("../../models/Alert");
const User = require("../../models/User");
const { generateAlert } = require("../../config/generateAlert");
const mailSender = require("../../utils/mailSender");
const alertSummaryTemplate = require("../../mail/templates/alertSummaryTemplate");

// ⏰ Every 8 hours
cron.schedule("0 */6 * * *", async () => {
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

      // 🔁 Generate alerts for locations
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

      // ✈️ Flight alerts
      if (trip.flightNumber) {
        const departureDate = new Date(trip.departureTime || trip.startDate);
        const formattedDate = departureDate.toISOString().split("T")[0];

        await generateAlert({
          user: userId,
          tripId,
          type: "flight",
          sentVia: "none",
          flightNumber: trip.flightNumber,
          date: formattedDate,
        });
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
          console.log(`📧 Sent alert email to ${userEmail}`);

          // ✅ Mark as emailed
          await Alert.updateMany(
            { _id: { $in: unsentAlerts.map((a) => a._id) } },
            { $set: { emailSent: true } }
          );
        } catch (emailErr) {
          console.error(`❌ Failed to send email to ${userEmail}:`, emailErr.message);
        }
      }
    }

    console.log("✅ Alert generation + email job completed");
  } catch (err) {
    console.error("🚨 Error in alert scheduler:", err.message);
  }
});
