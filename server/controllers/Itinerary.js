const Itinerary = require('../models/Itinerary');
const geocodeLocation = require('../utils/geocode'); 
const { generateGeminiResponse } = require('../utils/gemini');

// Create a new itinerary
const createItinerary = async (req, res) => {
  try {
    const { tripId, date, items } = req.body;
    if (!tripId || !date || !Array.isArray(items)) {
      return res.status(400).json({ message: 'tripId, date, and items are required' });
    }

    // Geocode each item's location if lat/lng missing
    const geocodedItems = await Promise.all(items.map(async (item) => {
      if (item.location && (item.lat === undefined || item.lng === undefined)) {
        const coords = await geocodeLocation(item.location);
        return { ...item, lat: coords?.lat, lng: coords?.lng };
      }
      return item;
    }));

    const itinerary = new Itinerary({ tripId, date, items: geocodedItems });
    const saved = await itinerary.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({ message: 'Server error while creating itinerary' });
  }
};

// Get all itineraries for a trip
const getItinerariesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const itineraries = await Itinerary.find({ tripId }).sort('date');
    res.status(200).json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    res.status(500).json({ message: 'Server error fetching itineraries' });
  }
};

// Update an itinerary
const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.items) {
      if (!Array.isArray(updateData.items)) {
        return res.status(400).json({ message: 'Items must be an array' });
      }
      // Geocode missing lat/lng in items
      updateData.items = await Promise.all(updateData.items.map(async (item) => {
        if (item.location && (item.lat === undefined || item.lng === undefined)) {
          const coords = await geocodeLocation(item.location);
          return { ...item, lat: coords?.lat, lng: coords?.lng };
        }
        return item;
      }));
    }

    const updated = await Itinerary.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Itinerary not found' });
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ message: 'Server error updating itinerary' });
  }
};

// Delete an itinerary
const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Itinerary.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Itinerary not found' });
    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ message: 'Server error deleting itinerary' });
  }
};

const generateSuggestions = async (req, res) => {
  try {
    const { locations, days, preferences } = req.body;
    const prompt = `Generate a concise ${days}-day travel itinerary for these locations: ${locations.join(', ')}. Provide key points only in bullet format for each day. Include ${preferences || 'cultural experiences, food spots, and must-see landmarks'}, keeping it short and easy to read.`;


    const suggestions = await generateGeminiResponse(prompt);
    res.status(200).json({
      success: true,
      message: "Suggestions generated successfully",
      suggestions });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ message: 'Error generating AI suggestions' });
  }
};

module.exports = {
  createItinerary,
  getItinerariesByTrip,
  updateItinerary,
  deleteItinerary,
  generateSuggestions
};
