import React, { useState, useEffect } from "react";
import { X, MapPin, Navigation } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { geocodeLocation } from "../../utils/geocode"

const EmergencyModal = ({ isOpen, onClose, selectedTrip }) => {
  const [selected, setSelected] = useState("current");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") onClose();
  };

  const getTripDestination = () => {
    const validLocation = selectedTrip?.locations?.find(
      (loc) => loc.city || loc.country
    );

    if (!validLocation) return "No destination available";

    let city = validLocation.city || "";
    let country = validLocation.country || "";

    if (country === "Unknown Country" || country === "Unknown" || !country) {
      country = "";
    }

    return [city, country].filter(Boolean).join(", ") || "No destination available";
  };

  const handleContinue = async () => {
    if (isLoading) return;

    setIsLoading(true);

    if (selected === "current") {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          setIsLoading(false);
          onClose();

          navigate("/emergency-services", {
            state: {
              coordinates: coords,
              locationLabel: "Your Current Location",
            },
          });
        },
        (err) => {
          setIsLoading(false);
          toast.error("Unable to access your location.");
          console.error("Geolocation error:", err);
        }
      );
    } else if (selected === "destination") {
      try {
        const validLocation = selectedTrip?.locations?.find(
          (loc) => loc.city || loc.country
        );

        if (!validLocation) {
          setIsLoading(false);
          toast.error("No valid trip location found.");
          console.error("No valid location found in trip:", selectedTrip);
          return;
        }

        const locationLabel = getTripDestination();
        
        if (locationLabel === "No destination available") {
          setIsLoading(false);
          toast.error("No valid location information available.");
          return;
        }

        const coords = await geocodeLocation(locationLabel);

        if (!coords || (!coords.lat && !coords.latitude) || (!coords.lng && !coords.longitude)) {
          setIsLoading(false);
          toast.error(`Could not find coordinates for "${locationLabel}". Please try with current location.`);
          console.error("Invalid coordinates returned:", coords);
          return;
        }

        const normalizedCoords = {
          lat: coords.lat || coords.latitude,
          lng: coords.lng || coords.longitude
        };

        setIsLoading(false);
        onClose();

        navigate("/emergency-services", {
          state: {
            coordinates: normalizedCoords,
            locationLabel,
          },
        });
      } catch (error) {
        setIsLoading(false);
        console.error("Geocoding failed:", error);
        toast.error("Error fetching trip destination coordinates. Please try again.");
      }
    }
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

        <div
          className="flex gap-2 mb-5 cursor-pointer items-center"
          onClick={() => setSelected("current")}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 sm:mr-4 ${selected === "current"
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
          className="flex gap-2 mb-5 cursor-pointer items-center"
          onClick={() => setSelected("destination")}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 sm:mr-4 ${selected === "destination"
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