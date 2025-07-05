import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Common/Sidebar";
import CreateTripModal from "../components/Trips/CreateTripModal";
import toast from "react-hot-toast";

import { getAllTrips, createTrip, updateTrip, deleteTrip } from "../services/Operations/trip";

const Trips = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trips, loading } = useSelector((state) => state.trip);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit" | "view"
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  const filteredTrips = trips.filter((trip) => {
    const title = trip.title?.toLowerCase() || "";
    const location = trip?.locations?.map((loc) => loc.city).join(", ").toLowerCase() || "";
    return title.includes(searchTerm.toLowerCase()) || location.includes(searchTerm.toLowerCase());
  });

  const formatDateRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const formatOpts = { month: "short", day: "2-digit" };
    const year = e.getFullYear();
    return `${s.toLocaleDateString("en-US", formatOpts)} - ${e.toLocaleDateString("en-US", formatOpts)}, ${year}`;
  };

  const openModal = (mode, trip = null) => {
    setModalMode(mode);
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleSaveTrip = async (data) => {
    try {
      if (modalMode === "create") {
        await dispatch(createTrip(data, navigate));
      } else if (modalMode === "edit" && selectedTrip?._id) {
        await dispatch(updateTrip(selectedTrip._id, data));
      }
      dispatch(getAllTrips());
    } finally {
      setIsModalOpen(false);
      setSelectedTrip(null);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      console.log("Deleting trip with id:", tripId);

      await dispatch(deleteTrip(tripId));
      await dispatch(getAllTrips());

      toast.success("Trip deleted successfully");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip");
    }

  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800">
      <nav className="w-full md:w-60 bg-white shadow-sm">
        <Sidebar />
      </nav>

      <main className="flex-1 p-8 animate-fade-in-up">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Trips</h1>
          <button
            onClick={() => openModal("create")}
            className="py-2 px-4 cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow hover:shadow-lg transition"
          >
            ⊕ Create New Trip
          </button>
        </header>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-3 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search trips by name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Trip List */}
        {loading ? (
          <p className="text-gray-500">Loading trips...</p>
        ) : filteredTrips.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip._id}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
              >
                <span className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 w-0 group-hover:w-full transition-all duration-400 rounded-t-xl" />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{trip.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {trip.locations?.map((loc) => loc.city).join(", ")}
                    </p>
                  </div>
                  <div className="flex gap-3 opacity-70 hover:opacity-100">
                    <button
                      onClick={() => openModal("view", trip)}
                      className="border cursor-pointer border-gray-300 text-sm px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition"
                    >
                      👁 View
                    </button>
                    <button
                      onClick={() => openModal("edit", trip)}
                      className="border cursor-pointer border-green-400 text-sm px-3 py-2 rounded-md hover:bg-green-500 hover:text-white transition"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      className="border cursor-pointer border-red-400 text-sm px-3 py-2 rounded-md hover:bg-red-500 hover:text-white transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            <div className="text-5xl mb-4">🧳</div>
            <h3 className="text-xl font-semibold mb-2">No trips found</h3>
            <p>Try adjusting your search or create a new trip to get started!</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrip(null);
        }}
        onSave={handleSaveTrip}
        initialData={selectedTrip}
        mode={modalMode}
      />
    </div>
  );
};

export default Trips;
