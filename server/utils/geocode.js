const axios = require('axios');

async function geocodeLocation(location) {
    try {
        const url = 'https://nominatim.openstreetmap.org/search';
        const params = {
            q: location,
            format: 'json',
            limit: 1
        };

        const response = await axios.get(url, { params });
        if (response.data && response.data.length > 0) {
            const place = response.data[0];
            return {
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon)
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Geocoding error:', error.message);
        return null;
    }
}

module.exports = geocodeLocation ;
