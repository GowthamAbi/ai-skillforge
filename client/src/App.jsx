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
  RefreshCw,
} from "lucide-react";

// ======================================================
// CARD
// ======================================================

const Card = ({ children }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
    {children}
  </div>
);

// ======================================================
// APP
// ======================================================

export default function App() {
  const [data, setData] = useState(null);
  const [git, setGit] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [error, setError] = useState("");

  // ====================================================
  // LOAD DASHBOARD
  // ====================================================

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      // ------------------------------
      // Dashboard
      // ------------------------------

      const dashboardData = await api("/dashboard");

      setData(dashboardData);

      // ------------------------------
      // GitHub
      // ------------------------------

      try {
        const githubData = await api("/github");

        setGit(githubData);
      } catch (githubError) {
        console.error(
          "GitHub load failed:",
          githubError
        );

        // GitHub failure should NOT crash dashboard

        setGit({
          configured: false,
          commits: 0,
          repos: [],
        });
      }
    } catch (loadError) {
      console.error(
        "Dashboard load failed:",
        loadError
      );

      setError(
        loadError?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    load();
  }, []);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin text-cyan-400" />

          <p className="text-lg font-semibold">
            Loading AI SkillForge...
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Connecting to your training dashboard
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // CONNECTION ERROR
  // ====================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-red-900 bg-red-950/30 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-300">
            Unable to Load Dashboard
          </h1>

          <p className="mt-3 text-red-200">
            {error}
          </p>

          <button
            type="button"
            onClick={load}
            className="mt-6 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // NO DASHBOARD RESPONSE
  // ====================================================

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Dashboard unavailable
          </h1>

          <button
            type="button"
            onClick={load}
            className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // EMPTY DATABASE
  // ====================================================

  if (
    !Array.isArray(data.days) ||
    data.days.length === 0 ||
    !data.current
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <div className="text-5xl">
            📚
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            No Study Plan Found
          </h1>

          <p className="mt-3 text-slate-400">
            Your frontend and backend are connected
            successfully, but your MongoDB database
            does not contain the 50-day roadmap.
          </p>

          <div className="mt-5 rounded-xl bg-slate-950 p-4 text-left">
            <p className="text-sm text-slate-400">
              Run this command from your server:
            </p>

            <code className="mt-2 block text-cyan-400">
              npm run seed
            </code>
          </div>

          <button
            type="button"
            onClick={load}
            className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // SAFE CURRENT DAY
  // ====================================================

  const d = data.current;

  // ====================================================
  // TOGGLE TASK
  // ====================================================

  const toggle = async (task) => {
    if (!d?.day || !task?._id) {
      return;
    }

    try {
      await api(
        `/days/${d.day}/task/${task._id}`,
        {
          method: "PATCH",

          body: JSON.stringify({
            completed: !task.completed,
          }),
        }
      );

      await load();
    } catch (updateError) {
      console.error(
        "Task update failed:",
        updateError
      );

      alert(
        updateError?.message ||
          "Unable to update task."
      );
    }
  };

  // ====================================================
  // SAVE STUDY TIME
  // ====================================================

  const saveTime = async (event) => {
    event.preventDefault();

    if (!d?.day) {
      return;
    }

    const minutes = Number(
      event.currentTarget.elements.minutes.value
    );

    if (
      Number.isNaN(minutes) ||
      minutes < 0
    ) {
      alert(
        "Please enter valid study minutes."
      );

      return;
    }

    try {
      await api(
        `/days/${d.day}/time`,
        {
          method: "PATCH",

          body: JSON.stringify({
            studyMinutes: minutes,
          }),
        }
      );

      await load();
    } catch (timeError) {
      console.error(
        "Study time update failed:",
        timeError
      );

      alert(
        timeError?.message ||
          "Unable to save study time."
      );
    }
  };

  // ====================================================
  // AI SCORE
  // ====================================================

  const score = async () => {
    if (!d?.day) {
      return;
    }

    try {
      setBusy(true);

      await api(
        `/days/${d.day}/score`,
        {
          method: "POST",
        }
      );

      await load();
    } catch (scoreError) {
      console.error(
        "AI evaluation failed:",
        scoreError
      );

      alert(
        scoreError?.message ||
          "AI evaluation failed. Check your backend and OpenAI API configuration."
      );
    } finally {
      setBusy(false);
    }
  };

  // ====================================================
  // CHART DATA
  // ====================================================

  const chart = Array.isArray(data.days)
    ? data.days.map((item) => ({
        day: `D${item.day}`,
        score: Number(item.score) || 0,
      }))
    : [];

  // ====================================================
  // VALUES
  // ====================================================

  const completion =
    Number(data.completion) || 0;

  const totalMinutes =
    Number(data.totalMinutes) || 0;

  const totalHours =
    (totalMinutes / 60).toFixed(1);

  const tasks =
    Array.isArray(d.tasks)
      ? d.tasks
      : [];

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-7xl p-5 md:p-8">

        {/* ============================================= */}
        {/* HEADER */}
        {/* ============================================= */}

        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">

          <div>
            <p className="text-sm font-semibold text-cyan-400">
              AI ENGINEERING STUDY OS
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              AI SkillForge
            </h1>

            <p className="mt-1 text-slate-400">
              Day {d.day}/50
              {d.topic
                ? ` · ${d.topic}`
                : ""}
            </p>
          </div>

          <div className="rounded-full bg-cyan-500/10 px-4 py-2 font-medium text-cyan-300">
            {completion}% complete
          </div>

        </header>

        {/* ============================================= */}
        {/* STATS */}
        {/* ============================================= */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* PROGRESS */}

          <Card>
            <Target className="mb-2 text-cyan-400" />

            <div className="text-2xl font-bold">
              {completion}%
            </div>

            <p className="text-slate-400">
              Overall Progress
            </p>
          </Card>

          {/* STUDY HOURS */}

          <Card>
            <Clock className="mb-2 text-blue-400" />

            <div className="text-2xl font-bold">
              {totalHours}h
            </div>

            <p className="text-slate-400">
              Total Study
            </p>
          </Card>

          {/* GITHUB */}

          <Card>
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

          {/* AI SCORE */}

          <Card>
            <Flame className="mb-2 text-orange-400" />

            <div className="text-2xl font-bold">
              {Number(d.score) || 0}/100
            </div>

            <p className="text-slate-400">
              AI Mentor Score
            </p>
          </Card>

        </div>

        {/* ============================================= */}
        {/* MAIN GRID */}
        {/* ============================================= */}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">

          {/* =========================================== */}
          {/* TASKS */}
          {/* =========================================== */}

          <Card>

            <h2 className="mb-4 text-xl font-semibold">
              Today's Tasks
            </h2>

            <div className="space-y-3">

              {tasks.length === 0 && (
                <p className="rounded-xl border border-slate-800 p-4 text-slate-400">
                  No tasks available for this day.
                </p>
              )}

              {tasks.map((task) => (
                <button
                  key={task._id}
                  type="button"
                  onClick={() =>
                    toggle(task)
                  }
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-800 p-3 text-left transition hover:bg-slate-800"
                >

                  {task.completed ? (
                    <CheckCircle2 className="shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="shrink-0 text-slate-500" />
                  )}

                  <span>

                    {task.type && (
                      <>
                        <span className="font-bold">
                          {task.type.toUpperCase()}
                        </span>

                        {" · "}
                      </>
                    )}

                    {task.title ||
                      "Untitled task"}

                  </span>

                </button>
              ))}

            </div>

            {/* ========================================= */}
            {/* STUDY TIME */}
            {/* ========================================= */}

            <form
              onSubmit={saveTime}
              className="mt-5 flex flex-col gap-2 sm:flex-row"
            >

              <input
                name="minutes"
                type="number"
                min="0"
                defaultValue={
                  Number(
                    d.studyMinutes
                  ) || 0
                }
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-500"
                placeholder="Study minutes"
              />

              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Save Time
              </button>

            </form>

          </Card>

          {/* =========================================== */}
          {/* AI MENTOR */}
          {/* =========================================== */}

          <Card>

            <div className="flex items-center gap-2">
              <Bot className="text-violet-400" />

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
              className="rounded-xl bg-violet-500 px-5 py-3 font-semibold transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {busy
                ? "Evaluating..."
                : "Evaluate My Day"}

            </button>

            {/* ========================================= */}
            {/* GITHUB */}
            {/* ========================================= */}

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
                  Add GITHUB_USERNAME and
                  GITHUB_TOKEN to your Render
                  environment variables.
                </p>
              )}

              <p className="mt-3 text-sm text-slate-400">
                Today's repositories:
              </p>

              <p className="mt-1 text-sm">

                {Array.isArray(
                  git?.repos
                ) &&
                git.repos.length > 0
                  ? git.repos.join(", ")
                  : "No repositories detected today."}

              </p>

            </div>

          </Card>

        </div>

        {/* ============================================= */}
        {/* SCORE CHART */}
        {/* ============================================= */}

        <div className="mt-4">

          <Card>

            <h2 className="mb-4 text-xl font-semibold">
              50-Day Score Tracking
            </h2>

            {chart.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-slate-500">
                No score data available.
              </div>
            ) : (
              <div className="h-72">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={chart}
                  >

                    <XAxis
                      dataKey="day"
                      tick={{
                        fontSize: 11,
                      }}
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
            )}

          </Card>

        </div>

      </main>
    </div>
  );
}