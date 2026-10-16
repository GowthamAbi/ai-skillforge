# AI SkillForge

50-day AI Engineer study tracker: React + Tailwind + Node/Express + MongoDB + OpenAI + GitHub verification.

## Daily timetable
9:00 PM–2:00 AM: 15m revision, 105m learning, 10m break, 100m coding, 10m break, 40m project, 20m interview/recap.

## Setup
Server: copy `.env.example` to `.env`, fill MongoDB/OpenAI/GitHub values, then `npm install`, `npm run seed`, `npm run dev`.
Client: `npm install`, `npm run dev`.

Re-run `npm run seed` after this update so MongoDB receives the detailed 50-day timetable. Existing study minutes, scores, feedback, and matching task completion are preserved.

## Study calendar

On the Dashboard, choose a start date and click **Start learning**. You can
**Pause today**, **Resume today**, or **Skip this date** for a planned break.
The 50-day roadmap recalculates calendar dates in India Standard Time without
resetting completed tasks, scores, or submissions. No reseed is required.

Run `node --test server/tests/studySchedule.test.js` to verify the date logic.

**Security:** This is still a single-learner prototype; its existing API has no
authentication. Add authentication, authorization, and per-user ownership
before enabling multi-user/public production use.
