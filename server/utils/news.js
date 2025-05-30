const axios = require("axios")

const GNEWS_API_KEY = process.env.GNEWS_API_KEY; // Store in .env

const getNewsAlerts = async (location) => {
  try {
    const response = await axios.get(`https://gnews.io/api/v4/search`, {
      params: {
        q: `${location} travel OR protest OR disruption OR emergency`,
        lang: 'en',
        country: '', // leave blank to search globally
        max: 5,
        token: GNEWS_API_KEY,
      },
    });

    const articles = response.data.articles || [];

    return articles.map(article => ({
      title: article.title,
      message: article.description || article.content || 'News alert',
      url: article.url,
      source: article.source?.name || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching news alerts:', error.message);
    return [];
  }
};

module.exports = {getNewsAlerts};