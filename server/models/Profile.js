const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "male", "female", "other"], // Accept both cases
    set: function(value) {
      // Normalize to capitalize first letter
      return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;
    }
  },
  dateOfBirth: {
    type: String, // You can also use Date type if consistent
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // store Cloudinary URL
    default: "",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true // Add timestamps for better debugging
});

module.exports = mongoose.model("Profile", profileSchema);