const axios = require("axios");

const getNearbyServices = async (latitude, longitude) => {
    const API_KEY = process.env.GEOAPIFY_API_KEY;
    // Categories to fetch: hospital, police, fire station, pharmacy, public phone
    const categories = 'healthcare.hospital,service.police,service.fire_station,healthcare.pharmacy,emergency.phone';
    const radius = 5000; // in meters

    // Geoapify API expects longitude first, then latitude in the URL
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${longitude},${latitude},${radius}&bias=proximity:${longitude},${latitude}&limit=50&apiKey=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const features = response.data.features;

        // Prepare groups to separate places by category
        const groupedServices = {
            hospitals: [],
            policeStations: [],
            fireStations: [],
            pharmacies: [],
            publicPhones: []
        };

        features.forEach(place => {
            const cats = place.properties.categories;

            const formattedPlace = {
                name: place.properties.name || "Unknown",
                address: place.properties.formatted || "Address not available",
                distance: place.properties.distance,
                coordinates: place.geometry.coordinates
            };

            // Add to category only if less than 2 already present
            if (cats.includes("healthcare.hospital") && groupedServices.hospitals.length < 2) {
                groupedServices.hospitals.push(formattedPlace);
            }
            if (cats.includes("service.police") && groupedServices.policeStations.length < 2) {
                groupedServices.policeStations.push(formattedPlace);
            }
            if (cats.includes("service.fire_station") && groupedServices.fireStations.length < 2) {
                groupedServices.fireStations.push(formattedPlace);
            }
            if (cats.includes("healthcare.pharmacy") && groupedServices.pharmacies.length < 2) {
                groupedServices.pharmacies.push(formattedPlace);
            }
            if (cats.includes("emergency.phone") && groupedServices.publicPhones.length < 2) {
                groupedServices.publicPhones.push(formattedPlace);
            }
        });

        return groupedServices;

    } catch (error) {
        console.error('Error fetching emergency services:', error.message);
        return {
            hospitals: [],
            policeStations: [],
            fireStations: [],
            pharmacies: [],
            publicPhones: []
        };
    }
};

module.exports = { getNearbyServices };
