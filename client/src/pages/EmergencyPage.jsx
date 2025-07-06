import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { fetchEmergencyServices } from "../services/Operations/emergency";
import MapView from "../components/Emergency/MapView.jsx";
import FilterBar from "../components/Emergency/FilterBar";
import LocationCard from "../components/Emergency/LocationCard";

const EmergencyPage = () => {
  const { state } = useLocation();
  const { coordinates, locationLabel } = state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [services, setServices] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (coordinates) {
      setLoading(true);
      setError(null);
      
      dispatch(fetchEmergencyServices(coordinates.lat, coordinates.lng))
        .then((response) => {
          setServices(response);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch emergency services");
          setLoading(false);
        });
    }
  }, [coordinates, dispatch]);

  const filteredServices = () => {
    if (!services) return [];

    const all = [];
    Object.entries(services).forEach(([type, items]) => {
      if (filter === "all" || type === filter) {
        all.push(...items.map((item) => ({ ...item, type })));
      }
    });
    return all;
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );

  const LoadingCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-300 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Emergency Page Header - Integrated into content */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black">
              <ArrowLeft size={20} className="cursor-pointer" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-red-600">🚨 Emergency Services</h1>
              <p className="text-sm text-gray-600">
                Showing results for <span className="font-medium">{locationLabel}</span>
              </p>
            </div>
            <div>{/* Placeholder to center header title */}</div>
          </div>
        </div>

        <MapView services={services} />
        <FilterBar filter={filter} setFilter={setFilter} />
        
        <div className="mt-6 space-y-4">
          {loading ? (
            <>
              <LoadingSpinner />
              <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <LoadingCard key={idx} />
                ))}
              </div>
            </>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredServices().length > 0 ? (
            // Services loaded
            filteredServices().map((service, idx) => (
              <LocationCard key={idx} data={service} />
            ))
          ) : (
            // No services found
            <div className="text-center text-gray-500 py-10">No services found</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmergencyPage;