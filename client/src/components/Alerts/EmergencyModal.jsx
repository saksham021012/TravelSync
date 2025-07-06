import React, { useState, useEffect } from "react";
import { X, MapPin, Navigation } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { geocodeLocation } from "../../utils/geocode";

const EmergencyModal = ({ isOpen, onClose, selectedTrip }) => {
  const [selected, setSelected] = useState("current");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") onClose();
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          reject(err);
        }
      );
    });
  };

  const cleanLocationData = (city, country) => {
    // Remove common airport codes and clean city names
    const cleanedCity = city
      ?.replace(/\b(International\s+Airport|Airport|JFK|John\s+F\s+Kennedy)\b/gi, '')
      .trim();
    
    // Handle unknown/invalid country values
    const cleanedCountry = 
      country === "Unknown Country" || country === "Unknown" || !country ? "" : country;
    
    return { city: cleanedCity, country: cleanedCountry };
  };

  const buildLocationLabel = (city, country) => {
    // Handle special cases
    if (city?.toLowerCase().includes('new york')) {
      return country ? `New York, ${country}` : "New York, USA";
    }
    
    // Build location string
    if (city && country) {
      return `${city}, ${country}`;
    } else if (city) {
      return city;
    } else if (country) {
      return country;
    }
    
    return null;
  };

  const getValidTripLocation = () => {
    return selectedTrip?.locations?.find((loc) => loc.city || loc.country);
  };

  const handleContinue = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (selected === "current") {
        const coords = await getCurrentLocation();
        
        navigate("/emergency-services", {
          state: {
            coordinates: coords,
            locationLabel: "Your Current Location",
          },
        });
      } else if (selected === "destination") {
        const validLocation = getValidTripLocation();
        
        if (!validLocation) {
          throw new Error("No valid trip location found");
        }

        const { city, country } = cleanLocationData(validLocation.city, validLocation.country);
        const locationLabel = buildLocationLabel(city, country);
        
        if (!locationLabel) {
          throw new Error("No valid location information available");
        }

        const coords = await geocodeLocation(locationLabel);
        
        if (!coords || (!coords.lat && !coords.latitude) || (!coords.lng && !coords.longitude)) {
          throw new Error(`Could not find coordinates for "${locationLabel}"`);
        }

        // Normalize coordinate format
        const normalizedCoords = {
          lat: coords.lat || coords.latitude,
          lng: coords.lng || coords.longitude,
        };

        navigate("/emergency-services", {
          state: {
            coordinates: normalizedCoords,
            locationLabel,
          },
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Location error:", error);
      
      if (selected === "current") {
        toast.error("Unable to access your location.");
      } else {
        toast.error(error.message || "Error fetching trip destination coordinates. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTripDestination = () => {
    const validLocation = getValidTripLocation();
    
    if (!validLocation) return "No destination available";
    
    const { city, country } = cleanLocationData(validLocation.city, validLocation.country);
    const locationLabel = buildLocationLabel(city, country);
    
    return locationLabel || "Location data needs cleaning";
  };

  if (!isOpen) return null;

  return (
    <div
      id="overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 px-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-md md:w-[400px] p-6 sm:p-8 pt-10 relative shadow-xl max-h-[90vh] overflow-y-auto">
        <h1 className="font-bold text-lg sm:text-xl mb-5">Select Location</h1>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 text-xl"
        >
          <X size={24} className="cursor-pointer" />
        </button>

        <div className="space-y-4 mb-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelected("current")}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 sm:mr-4 ${
                selected === "current"
                  ? "border-violet-500 bg-violet-500"
                  : "border-gray-300"
              }`}
            >
              {selected === "current" && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <Navigation className="w-5 h-5" />
            <span className="text-sm sm:text-base font-medium text-gray-800">
              Use My Current Location
            </span>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelected("destination")}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 sm:mr-4 ${
                selected === "destination"
                  ? "border-violet-500 bg-violet-500"
                  : "border-gray-300"
              }`}
            >
              {selected === "destination" && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <MapPin className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-medium text-gray-800">
                Use Trip Destination
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {getTripDestination()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 flex-wrap">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium w-full sm:w-auto disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-violet-600 text-white cursor-pointer hover:bg-violet-700 text-sm font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;