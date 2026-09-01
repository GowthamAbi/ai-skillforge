import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import api from "./routes/api.js";
import Day from "./models/Day.js";
import {
  studyAlert
} from "./services/emailService.js";
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
    app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
    setInterval(async()=> {
      const now=new Date().toLocaleString("en-US",
      {
        timeZone:"Asia/Kolkata",hour12:false,hour:"2-digit",
        minute:"2-digit"
      });
      if(now==="21:00") {
        const days=await Day.find().sort( {
          day:1
        });
        const current=days.find(d=>d.tasks.some(t=>!t.completed))||days.at(-1);
        if(current)await studyAlert(current)
      }
    },60000)
  }catch(e) {
    console.error("Server startup failed:",
    e);
    process.exit(1)
  }
}
startServer();
