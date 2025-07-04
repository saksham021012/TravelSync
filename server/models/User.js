const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  token: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
  },
  preferredAlertMethod: {
    type: String,
    enum: ['email', 'push', 'both'],
    default: 'email',
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  trips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema)