const mongoose = require("mongoose")

const tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },

    flightNumber: {
        type: String,
        required: true,
    },

    airline: {
        type: String,
        required: true,
    },

    departureAirport: {
        code: { type: String, required: true }, // e.g., "JFK"
        name: String,
        city: String,
        country: String,
    },

    arrivalAirport: {
        code: { type: String, required: true },
        name: String,
        city: String,
        country: String,
    },
    locations: [    
        {
            city: String,
            country: String,
            arrivalTime: Date,
            departureTime: Date,
        },
    ],

    departureTime: {
        type: Date,
        required: true,
    },

    arrivalTime: {
        type: Date,
        required: true,
    },

    status: {
        type: String,
        enum: ['scheduled', 'delayed', 'cancelled', 'landed'],
        default: 'scheduled',
    },

    alerts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alert',
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Trip', tripSchema);
