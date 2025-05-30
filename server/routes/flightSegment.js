const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.js");

const {
  getFlightSegmentsByTrip,
  updateFlightSegment,
} = require("../controllers/FlightSegment.js");

// GET /api/segments/:tripId
router.get("/:tripId", authMiddleware, getFlightSegmentsByTrip);

// PUT /api/segments/update/:segmentId
router.put("/:segmentId", authMiddleware, updateFlightSegment);

module.exports = router;
