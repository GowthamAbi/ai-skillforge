import { useEffect, useState } from "react";
import { api } from "./api/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  CheckCircle2,
  Circle,
  Bot,
  Clock,
  Flame,
  Target,
} from "lucide-react";

const Card = ({ children }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
    {children}
  </div>
);

export default function App() {
  const [data, setData] = useState(null);
  const [git, setGit] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOAD DASHBOARD
  // =========================
  const load = async () => {
    try {
      setError("");

      const dashboardData = await api("/dashboard");
      setData(dashboardData);

      // GitHub failure should not stop dashboard
      try {
        const githubData = await api("/github");
        setGit(githubData);
      } catch (githubError) {
        console.error("GitHub load failed:", githubError);

        setGit({
          configured: false,
          commits: 0,
          repos: [],
        });
      }
    } catch (error) {
      console.error("Dashboard load failed:", error);

      setError(
        "Unable to connect to the backend. Make sure your Node.js server is running."
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (error) {
    return (
      <div className="p-10">
        <div className="rounded-2xl border border-red-900 bg-red-950/40 p-5 text-red-300">
          <h2 className="text-xl font-bold">
            Connection Error
          </h2>

          <p className="mt-2">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-slate-300">
        Loading SkillForge...
      </div>
    );
  }

  const d = data.current;

  // =========================
  // TOGGLE TASK
  // =========================
  const toggle = async (task) => {
    try {
      await api(`/days/${d.day}/task/${task._id}`, {
        method: "PATCH",

        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      await load();
    } catch (error) {
      console.error("Task update failed:", error);
      alert("Unable to update task.");
    }
  };

  // =========================
  // SAVE STUDY TIME
  // =========================
  const saveTime = async (event) => {
    event.preventDefault();

    const minutes = Number(event.target.minutes.value);

    if (Number.isNaN(minutes) || minutes < 0) {
      alert("Please enter valid study minutes.");
      return;
    }

    try {
      await api(`/days/${d.day}/time`, {
        method: "PATCH",

        body: JSON.stringify({
          studyMinutes: minutes,
        }),
      });

      await load();
    } catch (error) {
      console.error("Study time update failed:", error);
      alert("Unable to save study time.");
    }
  };

  // =========================
  // AI SCORE
  // =========================
  const score = async () => {
    try {
      setBusy(true);

      await api(`/days/${d.day}/score`, {
        method: "POST",
      });

      await load();
    } catch (error) {
      console.error("AI evaluation failed:", error);

      alert(
        "AI evaluation failed. Check your backend and OpenAI API configuration."
      );
    } finally {
      setBusy(false);
    }
  };

  // =========================
  // CHART
  // =========================
  const chart =
    data.days?.map((item) => ({
      day: `D${item.day}`,
      score: item.score || 0,
    })) || [];

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-8">

      {/* HEADER */}

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">

        <div>
          <p className="text-sm font-semibold text-cyan-400">
            AI ENGINEERING STUDY OS
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            AI SkillForge
          </h1>

          <p className="mt-1 text-slate-400">
            Day {d.day}/50 · {d.topic}
          </p>
        </div>

        <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300">
          {data.completion}% complete
        </div>

      </header>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* PROGRESS */}

        <Card>
          <Target className="mb-2" />

          <div className="text-2xl font-bold">
            {data.completion}%
          </div>

          <p className="text-slate-400">
            Overall Progress
          </p>
        </Card>

        {/* STUDY HOURS */}

        <Card>
          <Clock className="mb-2" />

          <div className="text-2xl font-bold">
            {(data.totalMinutes / 60).toFixed(1)}h
          </div>

          <p className="text-slate-400">
            Total Study
          </p>
        </Card>

        {/* GITHUB */}

        <Card>

          {/* No lucide GitHub icon */}
          <div className="mb-2 text-2xl">
            🐙
          </div>

          <div className="text-2xl font-bold">
            {git?.commits ?? 0}
          </div>

          <p className="text-slate-400">
            Commits Today
          </p>

        </Card>

        {/* SCORE */}

        <Card>
          <Flame className="mb-2" />

          <div className="text-2xl font-bold">
            {d.score || 0}/100
          </div>

          <p className="text-slate-400">
            AI Mentor Score
          </p>
        </Card>

      </div>

      {/* MAIN GRID */}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">

        {/* TASKS */}

        <Card>

          <h2 className="mb-4 text-xl font-semibold">
            Today's Tasks
          </h2>

          <div className="space-y-3">

            {d.tasks?.map((task) => (

              <button
                key={task._id}
                type="button"
                onClick={() => toggle(task)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-800 p-3 text-left transition hover:bg-slate-800"
              >

                {task.completed ? (
                  <CheckCircle2 className="shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="shrink-0 text-slate-500" />
                )}

                <span>

                  <span className="font-bold">
                    {task.type?.toUpperCase()}
                  </span>

                  {" · "}

                  {task.title}

                </span>

              </button>

            ))}

          </div>

          {/* STUDY TIME */}

          <form
            onSubmit={saveTime}
            className="mt-5 flex flex-col gap-2 sm:flex-row"
          >

            <input
              name="minutes"
              type="number"
              min="0"
              defaultValue={d.studyMinutes || 0}
              className="min-w-0 flex-1 rounded-xl bg-slate-800 p-3 outline-none"
              placeholder="Study minutes"
            />

            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
            >
              Save Time
            </button>

          </form>

        </Card>

        {/* AI MENTOR */}

        <Card>

          <div className="flex items-center gap-2">

            <Bot />

            <h2 className="text-xl font-semibold">
              AI Mentor
            </h2>

          </div>

          <div className="my-5 rounded-xl bg-slate-950 p-4 text-slate-300">

            {d.feedback ||
              "Complete your tasks, log your study time, then ask the AI mentor to evaluate your day."}

          </div>

          <button
            type="button"
            disabled={busy}
            onClick={score}
            className="rounded-xl bg-violet-500 px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >

            {busy
              ? "Evaluating..."
              : "Evaluate My Day"}

          </button>

          {/* GITHUB STATUS */}

          <div className="mt-6 border-t border-slate-800 pt-4">

            <h3 className="font-semibold">
              GitHub Verification
            </h3>

            <p className="mt-2 text-sm text-slate-400">

              Status:{" "}

              <span
                className={
                  git?.configured
                    ? "text-emerald-400"
                    : "text-amber-400"
                }
              >

                {git?.configured
                  ? "Connected"
                  : "Not Connected"}

              </span>

            </p>

            {!git?.configured && (
              <p className="mt-2 text-sm text-slate-500">
                Add GITHUB_USERNAME and GITHUB_TOKEN
                to server/.env
              </p>
            )}

            <p className="mt-3 text-sm text-slate-400">
              Today's repositories:
            </p>

            <p className="mt-1 text-sm">

              {git?.repos?.length > 0
                ? git.repos.join(", ")
                : "No repositories detected today."}

            </p>

          </div>

        </Card>

      </div>

      {/* CHART */}

      <div className="mt-4">

        <Card>

          <h2 className="mb-4 text-xl font-semibold">
            50-Day Score Tracking
          </h2>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={chart}>

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  domain={[0, 100]}
                  width={35}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  strokeWidth={2}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </Card>

      </div>

    </div>
  );
}