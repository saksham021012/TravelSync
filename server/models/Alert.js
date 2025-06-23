const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
    },
    type: {
        type: String,
        enum: ['flight', 'weather', 'news', 'emergency'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    sentVia: {
        type: String,
        enum: ['email', 'push', 'none'],
        default: 'email',
    },
    emailSent: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{ timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
