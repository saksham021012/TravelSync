const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY

const getWeatherDetails = async(location) => {
    try {
        console.log("WEATHER API HAS BEEN HIT")
        const response = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
            params: {
                key: API_KEY,
                q: location,
                alerts: 'yes,'
            },
        });

        return response.data.alerts?.alert || [];
    } catch (error) {
        console.log("WeatherApi error", error.message);
        return [];
    }
}

module.exports = {getWeatherDetails};