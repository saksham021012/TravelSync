// models/FlightSegment.js

const mongoose = require('mongoose');

const FlightSegmentSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    segmentType: {
        type: String,
        enum: ['departure', 'stopover', 'arrival'],
        required: true
    },
    flightNumber: {
        type: String,
        required: true
    },
    airline: {
        type: String,
        required: true
    },
    airportCode: {
        type: String,
        required: true
    },
    airportName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    scheduledDeparture: {
        type: Date,
        required: true
    },
    scheduledArrival: {
        type: Date,
        required: true
    },
    actualDeparture: {
        type: Date
    },
    actualArrival: {
        type: Date
    },
    status: {
        type: String,
        enum: ['scheduled', 'on-time', 'delayed', 'cancelled', 'expected'],
        default: 'scheduled'
    },
    gateInfo: {
        terminal: String,
        gate: String
    },
    departureTimezone: {
        type: String,
    },
    arrivalTimezone: {
        type: String,
    },
    localScheduledDeparture: {
        type: Date,
    },
    localScheduledArrival: {
        type: Date,
    },
    localActualDeparture: {
        type: Date,
    },
    localActualArrival: {
        type: Date,
    }

});

module.exports = mongoose.model('FlightSegment', FlightSegmentSchema);
