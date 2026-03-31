// server.js
// Main entry point of the Express application
// Connects to DB, registers all routes, starts the server

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Import all route files
const authRoutes = require("./routes/authRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const companyRoutes = require("./routes/companyRoutes");
const noteRoutes = require("./routes/noteRoutes");
const mockRoutes = require("./routes/mockRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Load .env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────

// Allow requests from the React frontend
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://127.0.0.1:5173",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent cross-origin
  })
);

app.use(express.json());      // Parse JSON request bodies
app.use(cookieParser());       // Parse cookies from request headers

// ─── ROUTES ───────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/mock", mockRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PrepPilot API is running" });
});

// ─── ERROR HANDLERS ───────────────────────────────────────────────────────────

app.use(notFound);      // Catches unknown routes
app.use(errorHandler);  // Formats all errors as JSON

// ─── START SERVER ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
