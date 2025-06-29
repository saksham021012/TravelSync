import React, { useEffect, useState } from "react";
import Sidebar from "../components/Common/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrips } from "../services/Operations/trip";

const Trips = () => {
  const dispatch = useDispatch();
  const { trips, loading } = useSelector((state) => state.trip);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  const filteredTrips = trips.filter((trip) => {
    const title = trip.title?.toLowerCase() || "";
    const location = trip?.locations?.map(loc => loc.city).join(", ").toLowerCase() || "";
    return title.includes(searchTerm.toLowerCase()) || location.includes(searchTerm.toLowerCase());
  });

  const formatDateRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const formatOpts = { month: "short", day: "2-digit" };
    const year = e.getFullYear();
    return `${s.toLocaleDateString("en-US", formatOpts)} - ${e.toLocaleDateString("en-US", formatOpts)}, ${year}`;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Trips</h1>
          <button
            onClick={() => alert("Open trip creation wizard")}
            className="create-trip-btn py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow hover:shadow-lg transition"
          >
            ⊕ Create New Trip
          </button>
        </header>

        {/* Search Bar */}
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

        {/* Trips */}
        {loading ? (
          <p className="text-gray-500">Loading trips...</p>
        ) : filteredTrips.length > 0 ? (
          
          
          <div className="flex flex-col gap-6">
            {filteredTrips.map((trip, index) => (
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
                      {trip.locations?.map(loc => loc.city).join(", ")}
                    </p>
                  </div>
                  <div className="flex gap-3 opacity-70 hover:opacity-100">
                    <button
                      onClick={() => alert(`Viewing details for: ${trip.title}`)}
                      className="action-btn border border-gray-300 text-sm px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition"
                    >
                      👁 View
                    </button>
                    <button
                      onClick={() => alert(`Editing trip: ${trip.title}`)}
                      className="action-btn border border-green-400 text-sm px-3 py-2 rounded-md hover:bg-green-500 hover:text-white transition"
                    >
                      ✎ Edit
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
    </div>
  );
};

export default Trips;