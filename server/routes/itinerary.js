const express = require('express');
const router = express.Router();
const {
  createItinerary,
  getItinerariesByTrip,
  updateItinerary,
  // deleteItinerary,
  deleteItineraryItem,
  generateSuggestions
} = require('../controllers/Itinerary');

// POST /api/itineraries
router.post('/', createItinerary);

// GET /api/itineraries/trip/:tripId
router.get('/trip/:tripId', getItinerariesByTrip);

// PUT /api/itineraries/:id
router.put('/:id', updateItinerary);

// DELETE /api/itineraries/:id
// router.delete('/:id', deleteItinerary);

// POST /api/itineraries/ai/suggestions
router.post('/ai/suggestions', generateSuggestions); 

//DELETE /api/itineraries/items/:id

router.delete('/item', deleteItineraryItem);

module.exports = router;
