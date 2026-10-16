import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import api from "./routes/api.js";
import { ensureRoadmap } from "./services/ensureRoadmap.js";
import { startReminderScheduler } from "./services/notifications.js";
const app=express();
const PORT=process.env.PORT||5000;
// CORS
const allowedOrigins=["http://localhost:5173",
"https://aitraning.netlify.app"];
app.use(cors( {
  origin:(origin,cb)=>!origin||allowedOrigins.includes(origin)?cb(null,
  true):cb(new Error(`CORS not allowed: ${origin}`)),
  methods:["GET","POST","PUT","PATCH","DELETE",
  "OPTIONS"],allowedHeaders:["Content-Type",
  "Authorization"]
}));
// Middleware
app.use(express.json());
// Health check
app.get("/api/health",(req,res)=>res.json( {
  ok:true,message:"AI SkillForge API running"
}));
// API
app.use("/api",api);
// 404
app.use((req,res)=>res.status(404).json( {
  error:"Route not found"
}));
// Start Server
async function startServer() {
  try {
    if(!process.env.MONGODB_URI)throw new Error("MONGODB_URI environment variable is missing");
    await mongoose.connect(process.env.MONGODB_URI,
    {
      dbName:process.env.MONGODB_DB||"aitraning"
    });
    console.log("MongoDB connected:",mongoose.connection.name);
    const seeded = await ensureRoadmap();
    console.log("Study roadmap ready:", seeded.total, "days; added:", seeded.added);
    app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
    startReminderScheduler();
  }catch(e) {
    console.error("Server startup failed:",
    e);
    process.exit(1)
  }
}
startServer();
