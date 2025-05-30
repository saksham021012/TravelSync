 

# TravelSync Backend

**TravelSync** is a smart travel assistant backend built with Node.js, Express, and MongoDB. It helps travelers by providing real-time alerts and travel insights including flights, weather, news, and emergency services—all powered by intelligent automation and external APIs.

---

## 🚀 Features

- 🔐 **User Authentication** with OTP verification via email
- 🛫 **Trip Management** (CRUD) with automatic flight segment extraction
- 🌦️ **Weather Alerts** based on destination
- ✈️ **Flight Status Monitoring** using real-time airline data
- 📰 **Localized News Alerts** from trusted sources
- 🚨 **Disruption & Emergency Alerts**
- 🧭 **Local Emergency Services Info** (police stations, hospitals, embassies) via Geoapify
- 🌍 **Timezone-aware Travel Info** (local + UTC times)
- 📜 **History of Alerts & Disruptions**

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **External APIs:**
  - AeroDataBox (Flight status & routes)
  - WeatherAPI.com (Weather updates)
  - NewsAPI (News alerts)
  - Geoapify (Emergency services, location-based places)
- **Other Tools:**
  - Nodemailer (OTP email service)
  - JWT (Authentication)
  - Postman (API testing/documentation)

---

## ⚙️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/travelsync-backend.git
cd travelsync-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the server
npm start
```

---

## 📄 .env Example

```env
MAIL_HOST=smtp.example.com
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password

PORT=5000
MONGODB_URL=mongodb://localhost:27017/travelsync

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

JWT_SECRET=your_jwt_secret_key

WEATHER_API_KEY=your_weather_api_key
GNEWS_API_KEY=your_news_api_key
AERODATABOX_API_KEY=your_aerodatabox_api_key
GEOAPIFY_API_KEY=your_geoapify_api_key

```

---

## 🔍 Future Enhancements

- [ ] Push notification support
- [ ] Integration of interactive maps for visualizing emergency services and travel points
- [ ] Frontend integration using React for user dashboard, trip management, and real-time alerts display

---


