//todo: refactor code to make it cleaner and better

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  updateProfile,
  deleteAccount,
} from "../services/Operations/profile";
import { setProfile } from "../slices/profileSlice";
import { setUser } from "../slices/authSlice";
import toast from "react-hot-toast";
import { Edit3, Save, Trash2, User, Mail, Phone, Calendar, Info } from "lucide-react";
import Sidebar from "../components/Common/Sidebar";

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading: profileLoading } = useSelector((state) => state.profile);
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    about: "",
    dateOfBirth: "",
    contactNumber: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loading = profileLoading || authLoading;

  useEffect(() => {
    // Always fetch fresh profile data on component mount
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    // Update form when user data changes
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.profile?.gender?.toLowerCase() || "",
        about: user.profile?.about || "",
        dateOfBirth: user.profile?.dateOfBirth || "",
        contactNumber: user.profile?.contactNumber || "",
      });
    }
  }, [user]);

  // Also update when profile state changes
  useEffect(() => {
    if (profile) {
      setForm(prevForm => ({
        ...prevForm,
        gender: profile.gender?.toLowerCase() || "",
        about: profile.about || "",
        dateOfBirth: profile.dateOfBirth || "",
        contactNumber: profile.contactNumber || "",
      }));
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const { gender, about, contactNumber, dateOfBirth } = form;
      const updatedProfile = await dispatch(updateProfile({ 
        gender, 
        about, 
        contactNumber, 
        dateOfBirth 
      }));
      
      if (updatedProfile) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    try {
      const result = await dispatch(deleteAccount());
      if (result) {
        toast.success("Account deleted successfully");
        setShowDeleteModal(false);
        // Redirect to login or home page
        // window.location.href = '/login';
      } else {
        toast.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error("Failed to delete account");
    }
  };

  const getInitials = () => {
    return (form.firstName[0] || "") + (form.lastName[0] || "");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
        <div className="w-full md:w-60 bg-white shadow-sm">
          <Sidebar />
        </div>
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800">
      {/* Sidebar */}
      <div className="w-full md:w-60 bg-white shadow-sm">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <header className="animate-fade-in-up mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </header>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up animation-delay-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl ring-4 ring-white">
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">
                  {getInitials()}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {form.firstName} {form.lastName}
              </h2>
              <p className="text-gray-600 mb-4 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up animation-delay-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6" />
              Personal Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 border-none cursor-pointer ${
                isEditing ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'
              }`}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="mb-4">
              <label className="flex items-center font-semibold text-sm text-gray-700 mb-2">
                First Name
              </label>
              <input
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm transition-all duration-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                disabled
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="flex items-center font-semibold text-sm text-gray-700 mb-2">
                Last Name
              </label>
              <input
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm transition-all duration-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                disabled
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="flex items-center font-semibold text-sm text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm transition-all duration-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="flex items-center gap-2 font-semibold text-sm text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm transition-all duration-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>

            {/* Contact Number */}
            <div className="mb-4 sm:col-span-2">
              <label className="flex items-center gap-2 font-semibold text-sm text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm transition-all duration-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>

            {/* About Me */}
            <div className="mb-4 sm:col-span-2">
              <label className="flex items-center gap-2 font-semibold text-sm text-gray-700 mb-2">
                <Info className="w-4 h-4" />
                About Me
              </label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm transition-all duration-300 bg-white resize-y min-h-[120px] focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 mt-6 animate-fade-in">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-none cursor-pointer hover:bg-slate-200 hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-none cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/25 inline-flex items-center gap-2 justify-center w-full text-center"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 animate-fade-in-up animation-delay-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-xl font-bold text-red-800 mb-2 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-red-700 mb-4">
            Deleting your account will permanently remove all your data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-none cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/25 inline-flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4 animate-scale-in">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Account Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you absolutely sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-none cursor-pointer hover:bg-slate-200 hover:-translate-y-0.5 flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-none cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/25 flex-1"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;