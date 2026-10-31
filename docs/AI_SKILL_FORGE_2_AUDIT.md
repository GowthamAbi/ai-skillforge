# AI Skill Forge 2.0 — Technical Audit

**Audit baseline:** 2026-10-31  
**Repository:** `GowthamAbi/ai-skillforge`  
**Baseline branch:** `main`  
**Development branch:** `feature/ai-skillforge-2.0`  
**Product mode:** Single-user Personal AI Academy  
**Initial release:** Private website

## 1. Executive summary

The repository already contains substantial learning-platform functionality. AI Skill Forge 2.0 must be an incremental hardening and completion effort, not a rewrite. The existing `main` branch and MongoDB records are protected baselines.

Existing areas identified include the legacy SkillForge experience, AI Engineer Path, seven-phase AI Roadmap, lesson generation, coding workspace, progress tracking, and a NotebookEditor. The roadmap generator describes 329 lessons. The current curriculum representation should be retained and mapped to the user's 22-module source syllabus and 24-week schedule; do not replace the current topic IDs or silently discard content.

## 2. Confirmed repository findings

- Default branch is `main`; baseline commit observed during audit: `9b457cc7557eb969645bee3795d20f2c67d652d7`.
- Existing PR #7 introduced a seven-phase AI Roadmap and topic-stage learning flow. Its branch was observed to have diverged from main (11 commits ahead and 62 behind at audit time); do not merge it directly.
- Existing roadmap-related files include:
  - `client/src/pages/AIRoadmap.jsx`
  - `client/src/data/aiRoadmap.js`
  - `server/models/GeneratedRoadmapLesson.js`
  - `server/models/RoadmapCodeWorkspace.js`
  - `server/scripts/generateRoadmapLessons.js`
  - `server/routes/roadmapCode.js`
  - `server/routes/engineerPath.js`
  - `client/src/components/NotebookEditor.jsx`
- The generated lesson schema contains topic identity, outcomes, theory, flow, code examples, tasks, quiz, revision summary, generation time, and model metadata.
- The generator's structural checks do not establish that code executes correctly, assessments are valid, or Tamil explanations are complete.
- `RoadmapCodeWorkspace` uses a unique `topicId` and has no `userId`; this is compatible only with the current single-learner assumption and must be deliberately retained or migrated if multi-user support is ever introduced.
- `EngineerJourney` uses a legacy `single-learner` key and also stores legacy learning data. Its document includes roadmap progress and older lessons, courses, tests, projects, and day records.
- `engineerPath` and legacy API routes were observed without user authentication. This is not acceptable for a public multi-user deployment, but the selected first release is private and single-user. Access restriction is still required before exposing the site publicly.
- The code runner uses Piston (or configured `CODE_RUNNER_EXECUTE_URL`) and supports Python, JavaScript, and Java with request-size and timeout limits. Authentication, per-user isolation, rate limiting, concurrency controls, and abuse monitoring require review before public exposure.
- The frontend API helper uses `VITE_API_URL` and has a production fallback URL. Verify actual Netlify/Render service configuration before relying on it.
- The lesson generator defaults to `OPENAI_MODEL || 'gpt-5.4-mini'`. The live environment's configured model has not been verified. A prior run reported that `gpt-5.6-mini` was unavailable; do not hard-code an unverified model.
- No CI workflow run or combined status was returned for the observed main SHA. This is absence of verification evidence, not proof that the code fails.

## 3. Risk register

| Severity | Finding | Required action |
|---|---|---|
| Critical | No verified authentication boundary on API routes | Keep deployment private; add a single-user access gate and protect sensitive endpoints |
| Critical | MongoDB legacy data shares a single-learner record | Back up and verify before any schema/data change; never reset collections |
| High | Code execution endpoint can consume compute resources | Add auth, rate limits, quotas, concurrency caps, audit logs, and safe runner configuration |
| High | Generated lesson structure is validated more than content quality | Add schema, code-execution, quiz, Tamil-content, and topic-coverage validation |
| High | Roadmap and legacy endpoints have no proven regression suite | Add route/model/API regression tests before refactors |
| Medium | Production API URL and hosting variables not verified | Inspect Netlify/Render configuration before private release |
| Medium | AI model env may be invalid or unavailable | Validate model configuration with a small non-destructive health check |
| Medium | No CI evidence for baseline commit | Establish build, lint, test, and security checks |

## 4. Data preservation inventory

Treat all existing records as valuable and preserve in place:
- `EngineerJourney` documents and their legacy key(s)
- Existing days, lessons, custom courses, custom lessons, module tests, projects
- `aiRoadmapProgress`, topic completion, quiz attempts and scores, notes, drafts
- `GeneratedRoadmapLesson` content and generation metadata
- `RoadmapCodeWorkspace` drafts and attempt history
- Any existing user, subscription, notification, rank, or progress collections discovered during full schema inventory

No destructive migration, collection drop, bulk rewrite, unique-key change, or seed reset is authorized by this project brief.

## 5. Scope decisions

- One owner/learner: the user.
- Private access only for the first release.
- No public registration or multi-user architecture in this phase.
- Retain existing legacy portals and learning data while improving the selected experience.
- Preserve current seven phases and topic identifiers.
- Map the 22-module source syllabus to the existing phases and a 24-week learning calendar without deleting existing topics.
- Tamil + English teaching content, practical coding, exercises, projects, assessments, and progress reporting remain product goals.

## 6. Verification limitations

The GitHub repository was inspected through the connected GitHub integration. Netlify, Render, MongoDB Atlas, and OpenAI live permissions/configuration were not independently verified during this repository audit. Do not claim a successful live deployment, database backup, production build, or API test until those checks are run against the actual services.

## 7. Change-control rules

1. All work happens on `feature/ai-skillforge-2.0`.
2. Never commit directly to `main`.
3. Never merge PR #7 or its diverged branch as a shortcut.
4. Never run destructive MongoDB commands.
5. Back up and verify before data migrations.
6. Keep changes small, reviewable, and reversible.
7. Run tests and inspect diffs after each implementation slice.
8. No merge or deployment without explicit user approval after verification.
