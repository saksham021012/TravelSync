const cron = require('node-cron');
const Trip = require('../models/Trip');
const FlightSegment = require('../models/FlightSegment');
const Alert = require('../models/Alert');
const { getFlightDetails } = require('../utils/flight');
const mailSender = require('../utils/mailSender');

cron.schedule('0 * * * *', async () => {
  console.log('Running flight segment status check...');

  const now = new Date();
  const upcomingTrips = await Trip.find({ departureTime: { $gte: now } }).populate('user');

  for (const trip of upcomingTrips) {
    const user = trip.user;
    const flightSegments = await FlightSegment.find({ trip: trip._id });

    for (const segment of flightSegments) {
      try {
        const flightData = await getFlightDetails(segment.flightNumber);

        if (flightData?.status && flightData.status !== segment.status) {
          // Send alert and update DB if status changed
          await Alert.create({
            user: user._id,
            trip: trip._id,
            type: 'flight',
            title: `Flight ${segment.flightNumber} status changed`,
            message: `New Status: ${flightData.status}`,
            sentVia: 'email',
          });

          await mailSender(
            user.email,
            `Flight Segment Status Update`,
            `Flight ${segment.flightNumber} has a new status: ${flightData.status}`
          );

          segment.status = flightData.status;
          await segment.save();
        }

      } catch (error) {
        console.error(`Error checking status for flight ${segment.flightNumber}: ${error.message}`);
      }
    }
  }

  console.log('Flight segment check completed.');
});
  