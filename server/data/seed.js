import "dotenv/config";
import mongoose from "mongoose";

import Day from "../models/Day.js";
import { roadmap } from "./roadmap.js";

async function seedDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing"
      );
    }

    console.log(
      "Connecting to MongoDB..."
    );

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      "MongoDB connected"
    );

    console.log(
      `Roadmap contains ${roadmap.length} days`
    );

    for (const item of roadmap) {
      await Day.updateOne(
        {
          day: item.day,
        },

        {
          $setOnInsert: item,
        },

        {
          upsert: true,
        }
      );
    }

    const count =
      await Day.countDocuments();

    console.log(
      `Database contains ${count} days`
    );

    console.log(
      "Roadmap seeded successfully"
    );
  } catch (error) {
    console.error(
      "Seed failed:",
      error
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    console.log(
      "MongoDB disconnected"
    );
  }
}

seedDatabase();