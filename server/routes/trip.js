const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  createAlertsForTrip
} = require('../controllers/Trip');

// Create a new trip
router.post('/', authMiddleware, createTrip);

// Get all trips for the logged-in user
router.get('/', authMiddleware, getUserTrips);

//get all trip alerts
router.post("/alerts/create/:id",authMiddleware, createAlertsForTrip);

// Get a specific trip by ID
router.get('/:id', authMiddleware, getTripById);

// Update a specific trip by ID
router.put('/:id', authMiddleware, updateTrip);

// Delete a specific trip by ID
router.delete('/:id', authMiddleware, deleteTrip);

module.exports = router;
