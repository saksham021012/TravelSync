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
    res.status(500).json({ message: 'Server error while creating itinerary' }, error);
  }
};

// Get all itineraries for a trip
const getItinerariesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const itineraries = await Itinerary.find({ tripId })
      .sort('date')
      .populate('tripId', 'title startDate endDate');

    // Flatten all items into one array with their associated date
    const items = itineraries.flatMap(itinerary =>
      itinerary.items.map(item => ({
        ...item.toObject(),
        date: itinerary.date,
        itineraryId: itinerary._id,
      }))
    );

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.error('Error fetching itinerary items:', error);
    res.status(500).json({ message: 'Server error fetching itinerary items' });
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
// const deleteItinerary = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Itinerary.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ message: 'Itinerary not found' });
//     res.status(200).json({ message: 'Itinerary deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting itinerary:', error);
//     res.status(500).json({ message: 'Server error deleting itinerary' });
//   }
// };

const deleteItineraryItem = async (req, res) => {
  try {
  
    const { itineraryId, itemId } = req.body;
    if (!itineraryId || !itemId) {
      return res.status(400).json({ 
        message: 'Both itineraryId and itemId are required' 
      });
    }
   


    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      itineraryId,
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json({ message: 'Itinerary item deleted successfully', itinerary: updatedItinerary });
  } catch (error) {
    console.error('Error deleting itinerary item:', error);
    res.status(500).json({ message: 'Server error deleting itinerary item' });
  }
};


const generateSuggestions = async (req, res) => {
  try {
    const { locations, days, preferences } = req.body;

    // Input validation
    if (!Array.isArray(locations) || locations.length === 0 || !days) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one location and the number of days."
      });
    }

    const prompt = `
Suggest **one** travel activity for a user visiting ${locations.join(', ')} on Day ${days}.

Return the suggestion in **JSON format** like this:
{
  "title": "Visit the Eiffel Tower",
  "time": "02:00 PM",
  "type": "Activity",
  "location": "Champ de Mars, Paris"
}

Only include one activity. Make sure:
- "title" is the name of the activity or place.
- "time" is a realistic time for that activity (e.g., "10:00 AM", "07:00 PM").
- "type" is one of: "Activity", "Food", "Transport", "Hotel", or "Custom".
- "location" is specific (e.g., name of place, landmark, or address).

Do not include any explanation or extra text—just return the JSON object only.
Preferences to consider: ${preferences || 'cultural experiences, popular food spots, and scenic places'}
`;

    const suggestions = await generateGeminiResponse(prompt);
    res.status(200).json({
      success: true,
      message: "Suggestions generated successfully",
      suggestions
    });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ message: 'Error generating AI suggestions' });
  }
};


module.exports = {
  createItinerary,
  getItinerariesByTrip,
  updateItinerary,
  // deleteItinerary,
  deleteItineraryItem,
  generateSuggestions
};
