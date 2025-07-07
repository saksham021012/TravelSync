[Live At](https://travel-sync-mu.vercel.app/)

# 🌍 TravelSync – Intelligent Travel Assistant

![Node.js](https://img.shields.io/badge/Node.js-Backend-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![Express](https://img.shields.io/badge/Express.js-Web%20Framework-lightgrey?logo=express)
![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)

---

## 🚀 Overview

**TravelSync** is a comprehensive full-stack travel assistant that revolutionizes trip planning with intelligent features including AI-powered suggestions, real-time travel alerts, and seamless itinerary management. Built with modern technologies and a user-centric approach.

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** – JWT-based auth with email OTP verification
- 🛫 **Complete Trip Management** – Create, update, delete, and organize trips.
- 📅 **Smart Itinerary Planning** – Detailed scheduling with timezone-aware timestamps
- 🌦️ **Weather Intelligence** – Real-time weather alerts based on destination and travel dates
- ✈️ **Flight Status Monitoring** – Live flight tracking and notifications via AeroDataBox API
- 📰 **Travel Disruption Alerts** – Localized news and travel advisories from trusted sources
- 🆘 **Emergency Information** – Quick access to nearby hospitals, embassies, and emergency services
- 🧠 **AI-Powered Recommendations** – Personalized travel suggestions via Gemini API
- 🕐 **Timezone Management** – Automatic timezone detection and conversion for seamless travel

### User Experience
- 📱 **Responsive Design** – Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX** – Clean, intuitive interface built with React and Tailwind CSS
- ⚡ **Real-time Updates** – Live notifications and data synchronization
- 🔄 **State Management** – Efficient data handling with Redux
- 🌐 **Multi-language Support** – Localized content for international travelers

---

## 🧱 Tech Stack

### Backend
| Component     | Technology                    |
|---------------|-------------------------------|
| Runtime       | Node.js                       |
| Framework     | Express.js                    |
| Database      | MongoDB (Mongoose ODM)        |
| Authentication| JWT, Nodemailer (OTP)         |
| Testing       | Postman, Jest                 |

### Frontend
| Component     | Technology                    |
|---------------|-------------------------------|
| Library       | React 18+                     |
| State Mgmt    | Redux Toolkit                 |
| Styling       | Tailwind CSS                  |
| Routing       | React Router                  |
| HTTP Client   | Axios                         |

### External APIs
| Service       | Purpose                       |
|---------------|-------------------------------|
| AeroDataBox   | Flight status & information   |
| WeatherAPI    | Weather data & forecasts      |
| NewsAPI       | Travel news & disruptions     |
| Geoapify      | Maps & location services      |
| Gemini AI     | AI-powered recommendations    |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/travelsync.git
cd travelsync

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Set up environment variables
cd ../backend
cp .env.example .env
# Edit .env with your configuration

# 5. Start MongoDB (if running locally)
mongod

# 6. Start the backend server
npm run dev

# 7. Start the frontend (in a new terminal)
cd ../frontend
npm start
```

### Environment Configuration

Create a `.env` file in the backend directory:

```env
# Mail Config
MAIL_HOST=smtp.example.com
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password

# Server Config
PORT=4000
MONGODB_URL= your_mongodb_url

# Auth
JWT_SECRET=your_jwt_secret_key

# API Keys
WEATHER_API_KEY=your_weather_api_key
GNEWS_API_KEY=your_gnews_api_key
AERODATABOX_API_KEY=your_aerodatabox_api_key
GEOAPIFY_API_KEY=your_geoapify_api_key
GEMINI_API_KEY=your_gemini_api_key


```
