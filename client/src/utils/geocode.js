// utils/geocode.js
export const geocodeLocation = async (locationName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        locationName
      )}&format=json&limit=1`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
