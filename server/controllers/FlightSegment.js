const FlightSegment = require("../models/FlightSegment");

// Get all flight segments for a trip
exports.getFlightSegmentsByTrip = async (req, res) => {
  const { tripId } = req.params;

  if (!tripId) {
    return res.status(400).json({ message: "Trip ID is required" });
  }

  try {
    const segments = await FlightSegment.find({ tripId });
    res.status(200).json({ success: true, segments });
  } catch (error) {
    console.error("Error fetching flight segments:", error);
    res.status(500).json({ message: "Failed to fetch flight segments" });
  }
};

// Update a flight segment (e.g., status, gate info)
exports.updateFlightSegment = async (req, res) => {
  const { segmentId } = req.params;
  const updates = req.body;

  try {
    const segment = await FlightSegment.findByIdAndUpdate(segmentId, updates, {
      new: true,
    });

    if (!segment) {
      return res.status(404).json({ message: "Segment not found" });
    }

    res.status(200).json({ success: true, updated: segment });
  } catch (error) {
    console.error("Error updating flight segment:", error);
    res.status(500).json({ message: "Failed to update flight segment" });
  }
};

//unused for now