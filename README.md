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

## Smart Learning + personal Udemy Course Library (Oct 2026)

The New **AI Engineer Path** now includes two additional sidebar tabs:

- **My Course Library:** the four curated courses are protected, while the learner can add, edit, prioritize (Core / Supporting / Optional), or archive other courses from either Udemy account. Seven previously discussed Account 1 course *names* appear as optional form suggestions; the remaining course inventory is **not** assumed or automatically imported.
- **Smart Learning:** the learner can add an optional Udemy video/topic with duration, course, verified-on-Udemy URL, skill category, practical coding task, and a selected study day. **Auto-fit** finds the next existing 50-day plan with enough spare minutes. Manual assignment is rejected if the day would exceed its capacity. Library-only unscheduled extras are allowed; lesson fields and assigned day can be edited later.
- Existing 240-minute study days keep their core-video, 30-minute quiz, and 20-minute interview allocations. Extra videos **replace part of coding time**, with at least 35 minutes reserved for coding. They never increase the total daily target or block day completion, module tests, projects, original rank cards, or the Old dashboard.
- The UI shows **possible topic overlaps** based on reproducible title-token similarity with existing roadmap entries and other extras. These are suggestions only: no automatic skipping or deletion. The learner chooses to skip/restore a repeated extra. Skipped lessons free their assigned time; archiving keeps any recorded watch/quiz history.
- Each custom video can be self-marked watched and receives the same free, deterministic **five-question practice quiz** as built-in videos. The bank now includes Python, SQL and full-stack topic questions. Quizzes are **not extracted from private Udemy video transcripts**.
- A **Job-ready skills checklist** summarizes *tracked lessons and actual quiz passes* by skill category. It is not a certified measure of hiring readiness. The seven Account 1 suggestions only prefill names and priorities; the learner supplies missing account URLs and lesson data.

Optional library records are persisted in `EngineerJourney.customCourses` and `.customLessons`; built-in `PATH_COURSES`, `PATH_DAYS` and prior progress remain unchanged. New endpoints under `/api/path`: `POST/PATCH/DELETE /courses`, `POST/PATCH/DELETE /extra-lessons` and `POST /extra-lessons/:id/status`. Custom lesson quizzes use existing `/lessons/:id/quiz` endpoints. These are designed for the existing **single-learner prototype**, with no authentication; add account protection before sharing the API publicly.

**Deploy the New Path Render backend before the Netlify frontend**, so its `/api/path/dashboard` response includes `library` and the new mutation endpoints. No extra API keys or paid quiz service are needed. Run `node --test server/tests/*.test.js` and `npm run build --prefix client` before deploying.

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


## Full AI Roadmap (new feature branch)

The **AI Roadmap** portal is available at `/#/roadmap` and is separate from Old SkillForge and the existing 50-day AI Engineer Path. It follows the uploaded seven-phase syllabus: Programming Foundations, Machine Learning, Deep Learning, NLP, Generative AI, AI Engineering, and Advanced Specialization / Capstone.

- Sidebar hierarchy: phase → main heading → subheading → individual topic.
- Dashboard: overall completion, completed / pending topics, and phase-level percentages.
- Each topic page has four learning stages: concept learning, coding practice, task/problem solving, and revision/assessment.
- Topic progress is stored in the existing `EngineerJourney.aiRoadmapProgress` MongoDB field through `GET /api/path/roadmap-progress` and `PATCH /api/path/roadmap-progress/:topicId`.
- Existing course/video progress collections are retained. No migration or data reset is needed for this additive field.
- The page currently supplies a guided study scaffold and a general checkpoint quiz. It does **not** yet provide a fully authored Tamil theory article, tailored runnable code/output, or a unique subject quiz for every single topic; those lesson contents should be authored in subsequent iterations.
- The current backend is a single-learner prototype without authentication. Do not expose it to multiple users until authentication, authorization and per-user progress isolation are implemented.

### Verify before deploying

Run from the repository root after installing dependencies:

```bash
npm ci --prefix client
npm run build --prefix client
npm ci --prefix server
node --test server/tests/*.test.js
```

Deploy the updated backend before the Netlify frontend, then verify `GET /api/path/roadmap-progress` returns a `progress` object and test saving a topic stage.
