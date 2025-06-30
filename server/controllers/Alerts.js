const Alert = require("../models/Alert");



//past trip alerts

exports.getAlertsByTrip = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.userId;

  if (!tripId) {
    return res.status(400).json({ success: false, message: "Trip ID is required." });
  }

  try {
    const alerts = await Alert.find({ trip: tripId, user: userId }).sort({ createdAt: -1 }).populate("trip", "title");
    res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error("Error fetching alerts by trip:", error);
    res.status(500).json({ success: false, message: "Failed to fetch alerts.", error: error.message });
  }
};

exports.deleteAlertById = async (req, res) => {
  const { alertId } = req.params;
  const userId = req.user.userId;

  try {
    const deletedAlert = await Alert.findOneAndDelete({ _id: alertId, user: userId });

    if (!deletedAlert) {
      return res.status(404).json({ success: false, message: "Alert not found or not authorized" });
    }

    res.status(200).json({ success: true, message: "Alert deleted successfully", alert: deletedAlert });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ success: false, message: "Failed to delete alert", error: error.message });
  }
};

exports.deleteAlertsByTrip = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.userId;

  try {
    const result = await Alert.deleteMany({ trip: tripId, user: userId });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} alert(s) deleted for the trip.`,
    });
  } catch (error) {
    console.error("Error deleting alerts by trip:", error);
    res.status(500).json({ success: false, message: "Failed to delete alerts", error: error.message });
  }
};



// exports.createAlert = async (req, res) => {
//     const { trip, title, message, type, sentVia = 'email', location, flightNumber } = req.body;
//     const user = req.user;

//     if (!user || !trip || !type) {
//         return res
//             .status(400)
//             .json({
//                 success: false,
//                 message: "Missing required fields"
//             });
//     }

//     try {

//         // weather alerts
//         if (type === "weather") {
//             if (!location) {
//                 return res.status(400)
//                     .json({
//                         message: 'Location is required for weather alerts'
//                     })
//             };
//         }

//         const alerts = await getWeatherDetails(location);

//         if (alerts.length === 0) {
//             return res.status(200).
//                 json({
//                     success: false,
//                     message: "No weather alerts for this location."
//                 });
//         }

//         const createdAlerts = await Promise.all(alerts.map(async (a) => {
//             return await Alert.create({
//                 user: user._id,
//                 trip,
//                 type: "weather",
//                 title: a.headline || a.event || "Weather Alert",
//                 message: a.desc || "Severe weather expected",
//                 sentVia,
//             })
//         }));

//         res.status(200)
//             .json({
//                 success: true,
//                 message: "Alert created Successfully",
//                 count: createdAlerts.length,
//                 alerts: createdAlerts
//             });


//         //News alerts

//         if (type === 'news') {
//             if (!location) {
//                 return res
//                     .status(400)
//                     .json({
//                         message: "Location is required for news alerts"
//                     })
//             }

//             const news = getNewsAlerts(location);
//             if (news.length === 0) {
//                 return res
//                     .status(200)
//                     .json({
//                         success: false,
//                         message: "No news alerts found",
//                     })
//             }

//             const createdNewsAlerts = await Promise.all(news.map(async (n) => {
//                 return await Alert.create({
//                     user: user._id,
//                     trip,
//                     type: "news",
//                     title: n.title,
//                     message: n.description,
//                     sentVia,
//                 });
//             }));

//             return res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "News alert created",
//                     count: createdNewsAlerts.length,
//                     alerts: createdNewsAlerts,
//                 })
//         }

//         // Flight alerts
//         if (type === 'flight') {
//             if (!flightNumber) {
//                 return res.status(400)
//                     .json({
//                         message: "Flight number is required for flight alerts"
//                     });
//             }

//             const flightData = await getFlightDetails(flightNumber);

//             if (!flightData || flightData.length === 0) {
//                 return res.status(200)
//                     .json({
//                         success: false,
//                         message: "No flight alerts found for this flight number."
//                     });
//             }

        
//             const flightAlert = await Alert.create({
//                 user: user._id,
//                 trip,
//                 type: "flight",
//                 title: `Flight Status: ${flightData[0].status}`,
//                 message: `Flight ${flightNumber} is currently ${flightData[0].status}`,
//                 sentVia,
//             });

//             createdAlerts.push(flightAlert);
//         }


//         // fallback (manual alert creation)
//         const { title, message } = req.body;
//         if (!title || !message) {
//             return res.status(400).json({ message: 'Title and message required for manual alert' });
//         }

//         const alert = await Alert.create({
//             user: user._id,
//             trip,
//             type,
//             title,
//             message,
//             sentVia,
//         });

//         if (sentVia == 'email') {
//             await mailSender(user.email, title, message);
//         }
//         // else if (sentVia == 'push') {
//         //     await sendPushNotification()
//         // }

//         res.status(201).json({ message: 'Alert created', alert });

//     } catch (error) {
//         console.error("Error creating alert", error);
//         res
//             .status(500)
//             .json({
//                 success: false,
//                 message: "An error occured while creating the alert",
//                 error: error.message,
//             });
//     }
// }