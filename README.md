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

## API-free studying and reminders (Oct 2026)

The 50-day tasks are **predefined** in `server/data/roadmap.js` (not generated
by OpenAI). The backend now inserts **missing** study days automatically on
startup, without resetting existing progress. OpenAI access is optional:

- With `OPENAI_API_KEY` and usable credits: use the AI mentor/reviewer.
- Without a paid API: use the offline progress score and explicitly labeled
  project self-check. Self-check is based on **your** confirmations and is
  **not** an AI review or a code quality certification.
- `GET /api/capabilities` shows whether an OpenAI key is **configured**,
  not whether billing/quota works. It does not return the secret.

### 9 PM IST reminders

The server sends a 9 PM reminder only on active (non-paused) study days.
Email uses `STUDY_EMAIL`, `EMAIL_USER`, `EMAIL_PASS`. For background browser
push when the tab/phone is locked:

1. Run `cd server && npm install` to install the optional `web-push` dependency
   and update the server lockfile (commit the updated lockfile in a normal
   development environment).
2. Run `npx web-push generate-vapid-keys` once. Set `VAPID_PUBLIC_KEY`,
   `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT` **only in your server host environment**.
   Never put the private key in client files or commit it.
3. Deploy backend and HTTPS frontend. Open Dashboard, tap
   **Enable browser reminders**, and allow notification permissions.
4. Keep the backend running at 9 PM IST. Free hosts that sleep can miss the
   notification: use a reliable scheduler/paid always-on host if delivery
   matters. Device/browser push delivery is best-effort; test on your phone.

The existing app has no login/authentication; add authenticated subscriptions
and per-user data isolation before opening it to multiple public users.

Run `node --test server/tests/*.test.js` and `cd client && npm run build`
when dependencies have been installed.
