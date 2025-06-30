const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  items: [{
    title: { type: String, required: true },
    description: String,
    location: String,
    startTime: Date,
    endTime: Date,
    time: String,
    lat: Number,
    lng: Number,
    type: {
      type: String,
      enum: ['Activity','Hotel','Transport','Food','Custom','activity', 'hotel', 'transport', 'food', 'custom'],
      default: 'custom'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
