const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://stayfinder-mu.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// app.options("*", cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "StayFinder API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

module.exports = app;