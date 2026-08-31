import "dotenv/config";
import mongoose from "mongoose";
import Day from "../models/Day.js";
import { roadmap } from "./roadmap.js";

async function seed() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    for (const day of roadmap) {
      await Day.updateOne(
        { day: day.day },
        { $setOnInsert: day },
        { upsert: true }
      );
    }

    const count = await Day.countDocuments();

    console.log(`50-day roadmap seeded successfully`);
    console.log(`Total days in database: ${count}`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

seed();