# AI SkillForge

50-day AI Engineer study tracker: React + Tailwind + Node/Express + MongoDB + OpenAI + GitHub verification.

## Old SkillForge + new AI Engineer Path (Oct 2026)

The entry screen now has two animated cards and **no sidebar**. `Old SkillForge`
opens the original dashboard at `/#/old`; its existing 50-day `Day`/`StudyPlan`
collections and all original features are preserved. `AI Engineer Path` opens
`/#/path`, with its own sidebar and a separate MongoDB `EngineerJourney`
collection. The new journey starts **19 October 2026**, targets **240 focused
minutes a day**, and immediately unlocks the next 4-hour study block on
completion (the actual time of day is flexible).

Course catalog imported from the previously reviewed roadmap:

| Udemy course | Instructor | Imported entries | Udemy course lectures |
| --- | --- | ---: | ---: |
| Applied Generative AI: Inference to Agents – தமிழ் | Salman Faroz | 67 | 75 |
| AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents | Ed Donner / Ligency | 210 | 210 |
| AI Engineer Agentic Track: The Complete Agent & MCP Course | Ed Donner / Ligency | 132 | 132 |
| AI Engineer Production Track: Deploy LLMs & Agents at Scale | Ed Donner / Ligency | 123 | 124 |

The imported 532 video titles and durations are drawn from the repo's existing
50-day roadmap; imported video numbers represent **roadmap order**, not
independently verified Udemy lecture IDs or exact official section numbers.
The roadmap is missing 8 Tamil and 1 Production lecture metadata entries.
Every video has a free 5-question topic-based checkpoint quiz (80% pass), and
each module closes with a separate 10-question final test (80% pass).
Questions are written in source (`server/data/pathQuiz.js`), not derived from
private lecture transcripts or paid LLM calls. Unlock after marking watched.

**Udemy linking:** The course page always opens on Udemy. For an exact lecture
link, open the lecture in your signed-in Udemy account, copy its
`/course/<slug>/learn/lecture/<id>` URL, and save it on that video's card.
The button then opens that exact Udemy video; no lesson URLs are fabricated.
Udemy watch progress is self-marked, not automatically synchronized.

Module-end projects can be submitted through a GitHub repository URL or a
small code-file text upload, followed by a free learner self-check. No paid AI
review is performed. The old project's review and data remain unchanged.
The new browser push subscriptions opt into `path` mode, so their 9 PM IST
notification links directly to `/#/path`; legacy subscriptions retain Old mode.
This needs HTTPS, server VAPID keys, and an always-running 9 PM IST scheduler.

**Production limitation:** Authentication is not present in the original app;
the new route also inherits single-learner data access. Secure all API routes
and notifications before opening the deployed app to untrusted users.

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

### New AI Engineer Path daily rank cards

After **Submit day & unlock next 4 hours** passes its checks, SkillForge
generates a celebratory daily **Rank Card** from tracked study minutes, watched
videos and actual quiz scores. It records earned XP, the rank, completed video
titles, badges and the completion-date streak. Go to **Rank Cards** in the new
sidebar to reopen any past card and **Download PNG** or **Share card** from
supported browsers. On browsers without native file sharing, Share downloads
the PNG so the learner can attach it to WhatsApp or other apps manually.

The backend also sends a styled HTML rank-card email **immediately when a day
is completed** (regardless of time of day). Render's **Free** web service blocks
outbound SMTP ports 25/465/587, so use a transactional email provider's HTTPS
API instead of Gmail SMTP. For example, Resend has a free allowance sufficient
for one daily report. Set these on the **new AI Engineer Path Render service**:

| Render environment variable | Purpose |
| --- | --- |
| `STUDY_EMAIL` | Verified recipient address for the report |
| `RESEND_API_KEY` | Resend sending-only API key, configured privately in Render |
| `REPORT_FROM_EMAIL` | Sender from a domain verified in Resend, e.g. `AI SkillForge <reports@example.com>` |

Resend requires you to verify a sender domain for normal delivery. Its
`onboarding@resend.dev` test sender can be used only under its testing rules;
it is not a general-purpose production sender. The legacy `EMAIL_USER` and
`EMAIL_PASS` Gmail SMTP option remains for environments that permit SMTP.
Never commit or share email API keys or app passwords. If any value is missing
or email delivery fails, finishing the day still works and the PNG remains available
in Rank Cards; the UI reports whether the email was configured or sent.
No paid AI or quiz API is involved. A day that was not submitted is **not**
emailed automatically; a calendar-time daily digest needs an additional
reliable scheduled worker and recipient preference.

Run `node --test server/tests/*.test.js` and `cd client && npm run build`
when dependencies have been installed.
