# 🌍 TravelSync – Intelligent Travel Assistant

![Node.js](https://img.shields.io/badge/Node.js-Backend-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![Express](https://img.shields.io/badge/Express.js-Web%20Framework-lightgrey?logo=express)
![Frontend Status](https://img.shields.io/badge/Frontend-In%20Progress-yellow?logo=react)


---

## 🚀 Overview

**TravelSync** is a full-stack a smart travel assistant for trip planning, itinerary management, AI-powered suggestions, and real-time travel alerts with support.

> ⚠️ **Note:** Frontend is currently under development using React, Redux, and Tailwind CSS.

---

## ✨ Features

- 🔐 **User Authentication** – with OTP verification via email
- 🛫 **Trip Management** – CRUD operations with flight segment detection
- 🌦️ **Weather Alerts** – based on destination & travel time
- ✈️ **Flight Status Monitoring** – real-time flight info using AeroDataBox
- 📰 **Localized News/Disruption Alerts** – region-specific news from trusted sources
- 🧭 **Local Emergency Info** – nearby hospitals, embassies, and police
- 🧠 **AI-Powered Suggestions** – via Gemini API for personalized itineraries
- 🕐 **Timezone-Aware Travel Info** – includes both local and UTC times

---

## 🧱 Tech Stack

| Layer         | Tech/Tool                     |
|---------------|-------------------------------|
| Backend       | Node.js, Express.js           |
| Database      | MongoDB (via Mongoose)        |
| Auth & Email  | JWT, Nodemailer (OTP)         |
| APIs Used     | AeroDataBox, WeatherAPI, NewsAPI, Geoapify, Gemini AI |
| Testing       | Postman                       |

---

## ⚙️ Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/travelsync-backend.git
cd travelsync-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Start the server
npm start
```
## 📄 env example

```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/travelsync

MAIL_HOST=smtp.example.com
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password

JWT_SECRET=your_jwt_secret_key

WEATHER_API_KEY=your_weather_api_key
GNEWS_API_KEY=your_news_api_key
AERODATABOX_API_KEY=your_aerodatabox_api_key
GEOAPIFY_API_KEY=your_geoapify_api_key
```
```
