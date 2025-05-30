// controllers/emergencyController.js

const { getNearbyServices } = require('../utils/emergency');

exports.getEmergencyServices = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  try {
    const services = await getNearbyServices(latitude, longitude);
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching emergency services.', error: error.message });
  }
};
