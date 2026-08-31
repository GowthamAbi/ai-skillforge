import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import api from "./routes/api.js";

const app = express();

const PORT = process.env.PORT || 5000;

// ------------------------------------
// CORS
// ------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://aitraning.netlify.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman / Render health checks / server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(
        new Error(`CORS not allowed: ${origin}`)
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ------------------------------------
// Middleware
// ------------------------------------

app.use(express.json());

// ------------------------------------
// Health check
// ------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "AI SkillForge API running",
  });
});

// ------------------------------------
// API
// ------------------------------------

app.use("/api", api);

// ------------------------------------
// 404
// ------------------------------------

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ------------------------------------
// Start Server
// ------------------------------------

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI environment variable is missing"
      );
    }

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error
    );

    process.exit(1);
  }
}

startServer();