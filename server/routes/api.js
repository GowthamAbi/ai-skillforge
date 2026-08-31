import { Router } from "express";

import Day from "../models/Day.js";
import { githubToday } from "../services/githubService.js";
import { mentor } from "../services/openaiService.js";

const router = Router();

// ======================================================
// GET ALL DAYS
// ======================================================

router.get("/days", async (req, res) => {
  try {
    const days = await Day.find()
      .sort({ day: 1 });

    res.json(days);
  } catch (error) {
    console.error(
      "Get days error:",
      error
    );

    res.status(500).json({
      error: "Failed to load days",
    });
  }
});

// ======================================================
// DASHBOARD
// ======================================================

router.get("/dashboard", async (req, res) => {
  try {
    const days = await Day.find()
      .sort({ day: 1 });

    // ----------------------------------
    // No roadmap in database
    // ----------------------------------

    if (days.length === 0) {
      return res.json({
        days: [],
        current: null,
        completion: 0,
        totalMinutes: 0,
      });
    }

    // ----------------------------------
    // Calculate completed tasks
    // ----------------------------------

    const completedTasks = days.reduce(
      (total, day) => {
        const tasks = day.tasks || [];

        return (
          total +
          tasks.filter(
            (task) => task.completed
          ).length
        );
      },
      0
    );

    // ----------------------------------
    // Calculate total tasks
    // ----------------------------------

    const totalTasks = days.reduce(
      (total, day) => {
        return (
          total +
          (day.tasks || []).length
        );
      },
      0
    );

    // ----------------------------------
    // Find current day
    // ----------------------------------

    const current =
      days.find((day) =>
        (day.tasks || []).some(
          (task) => !task.completed
        )
      ) ||
      days[days.length - 1] ||
      null;

    // ----------------------------------
    // Completion %
    // ----------------------------------

    const completion =
      totalTasks > 0
        ? Math.round(
            (completedTasks /
              totalTasks) *
              100
          )
        : 0;

    // ----------------------------------
    // Study time
    // ----------------------------------

    const totalMinutes = days.reduce(
      (total, day) =>
        total +
        (Number(day.studyMinutes) || 0),
      0
    );

    res.json({
      days,
      current,
      completion,
      totalMinutes,
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
});

// ======================================================
// UPDATE TASK
// ======================================================

router.patch(
  "/days/:day/task/:taskId",
  async (req, res) => {
    try {
      const day = await Day.findOne({
        day: Number(req.params.day),
      });

      if (!day) {
        return res.status(404).json({
          error: "Day not found",
        });
      }

      const task = day.tasks.id(
        req.params.taskId
      );

      if (!task) {
        return res.status(404).json({
          error: "Task not found",
        });
      }

      task.completed =
        Boolean(req.body.completed);

      await day.save();

      res.json(day);
    } catch (error) {
      console.error(
        "Task update error:",
        error
      );

      res.status(500).json({
        error: "Failed to update task",
      });
    }
  }
);

// ======================================================
// UPDATE STUDY TIME
// ======================================================

router.patch(
  "/days/:day/time",
  async (req, res) => {
    try {
      const studyMinutes = Math.max(
        0,
        Number(
          req.body.studyMinutes
        ) || 0
      );

      const day =
        await Day.findOneAndUpdate(
          {
            day: Number(
              req.params.day
            ),
          },
          {
            $set: {
              studyMinutes,
            },
          },
          {
            new: true,
          }
        );

      if (!day) {
        return res.status(404).json({
          error: "Day not found",
        });
      }

      res.json(day);
    } catch (error) {
      console.error(
        "Time update error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to update study time",
      });
    }
  }
);

// ======================================================
// GITHUB
// ======================================================

router.get("/github", async (req, res) => {
  try {
    const github =
      await githubToday();

    res.json(github);
  } catch (error) {
    console.error(
      "GitHub error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to load GitHub activity",
    });
  }
});

// ======================================================
// AI MENTOR SCORE
// ======================================================

router.post(
  "/days/:day/score",
  async (req, res) => {
    try {
      const day = await Day.findOne({
        day: Number(req.params.day),
      });

      if (!day) {
        return res.status(404).json({
          error: "Day not found",
        });
      }

      const github =
        await githubToday();

      const analysis =
        await mentor(
          day,
          github
        );

      day.score = Math.max(
        0,
        Math.min(
          100,
          Number(analysis?.score) || 0
        )
      );

      day.feedback =
        analysis?.feedback || "";

      await day.save();

      res.json({
        day,
        github,
      });
    } catch (error) {
      console.error(
        "Score error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to calculate score",
      });
    }
  }
);

export default router;