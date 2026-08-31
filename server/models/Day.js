import mongoose from "mongoose";

const taskSchema =
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  });

const daySchema =
  new mongoose.Schema(
    {
      day: {
        type: Number,
        required: true,
        unique: true,
      },

      title: {
        type: String,
        required: true,
      },

      topic: {
        type: String,
        default: "",
      },

      tasks: {
        type: [taskSchema],
        default: [],
      },

      studyMinutes: {
        type: Number,
        default: 0,
      },

      score: {
        type: Number,
        default: 0,
      },

      feedback: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Day",
  daySchema
);