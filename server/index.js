require('dotenv').config();
const express = require("express")
const app = express()


const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const { cloudinaryConnect } = require("./config/cloudinary")
const fileUpload = require("express-fileupload")
require("./jobs/automation/alertEmailScheduler");

const PORT = process.env.PORT || 4000


//cors
const allowedOrigins = [
    "http://localhost:5174",               // local dev
    "https://travel-sync-sepia.vercel.app" // your Vercel frontend
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

//database connect
connectDB();

//middlewares
app.use(express.json());
app.use(cookieParser());


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    })
)

//cloudinary connection
cloudinaryConnect();

// Import routes
const alerts = require("./routes/alerts");
const auth = require("./routes/auth");
const emergency = require("./routes/emergency");
const flightSegment = require("./routes/flightSegment");
const trip = require("./routes/trip");
const itineraryRoutes = require('./routes/itinerary');
const profileRoutes = require("./routes/profile");

// Use routes
app.use("/api/auth", auth);
app.use("/api/trips", trip);
app.use("/api/alerts", alerts);
app.use("/api/emergency", emergency);
app.use("/api/flightSegment", flightSegment);
app.use('/api/itineraries', itineraryRoutes);
app.use("/api/profile", profileRoutes);

//default route

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: `Your server is up and running`
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

// 404 route handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`)
})