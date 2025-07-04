const Profile = require("../models/Profile");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

//  Update user profile (gender, DOB, contact, about)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gender, dateOfBirth, about, contactNumber } = req.body;

    if (!gender && !dateOfBirth && !about && !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { gender, dateOfBirth, about, contactNumber },
      { new: true, upsert: true }
    ).populate('user', 'firstName lastName email image');

    // Return the profile with user data
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        ...updatedProfile.toObject(),
        firstName: updatedProfile.user.firstName,
        lastName: updatedProfile.user.lastName,
        email: updatedProfile.user.email,
        image: updatedProfile.user.image,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
    });
  }
};

// get full profile info (including user)
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const profile = await Profile.findOne({ user: userId })
      .populate('user', 'firstName lastName email image');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: {
        ...profile.toObject(),
        firstName: profile.user.firstName,
        lastName: profile.user.lastName,
        email: profile.user.email,
        image: profile.user.image,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching profile",
    });
  }
};

// Update user profile picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const file = req.files.image;

    // Upload to cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "travelSync-profile",
      width: 250,
      crop: "scale",
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { image: uploadResult.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating display picture:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile picture",
    });
  }
};

//Delete user account and profile
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete Profile
    await Profile.findOneAndDelete({ user: userId });

    // Delete User
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting account",
    });
  }
};
