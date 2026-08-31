import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import api from "./routes/api.js";

const app = express();

// -------------------------
// CORS
// -------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://aitraning.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);

      return callback(
        new Error(`CORS not allowed for origin: ${origin}`)
      );
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// -------------------------
// Middleware
// -------------------------

app.use(express.json());

// -------------------------
// Health Check
// -------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "AI SkillForge API is running",
  });
});

// -------------------------
// API Routes
// -------------------------

app.use("/api", api);

// -------------------------
// Server
// -------------------------

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });