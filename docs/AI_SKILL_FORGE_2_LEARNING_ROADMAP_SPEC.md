# AI Skill Forge 2.0 — Learning Roadmap Product & Technical Specification

**Status:** Approved product direction / implementation specification  
**Product:** AI Skill Forge 2.0 — Personal AI Academy  
**Language:** English only (UI, lesson content, AI responses, quizzes, feedback, notifications)  
**Release:** Private single-learner website  
**Design reference:** User-provided dashboard and seven-panel feature montage  
**Branch:** `feature/ai-skillforge-2.0`

## 1. Product experience

The product is a functional learning platform, not a static dashboard mockup. All navigation, cards, progress controls, lesson actions, assessments, and settings must be connected to real application state and backend APIs.

### Global visual system
- Dark navy background, layered slate panels, subtle borders and soft shadows.
- Purple/indigo and electric-blue gradients for primary actions and active navigation.
- Cyan highlights for learning/technical actions; green for verified completion.
- Rounded cards, compact typography, clear hierarchy, restrained glow effects.
- Responsive layouts: desktop sidebar; tablet collapsible navigation; mobile drawer/bottom-safe controls.
- Accessible focus states, keyboard navigation, semantic buttons, reduced-motion support.
- No Tamil text, language selector, or translation mode anywhere in the product.

### Global application shell
- Brand: AI Skill Forge 2.0 / Personal AI Academy.
- Left navigation: Dashboard, Learning Roadmap, AI Tutor, Practice Lab, Projects, Quizzes & Assessments, Progress & Analytics, Private Mode, Settings.
- Header: contextual page title, global search, notification indicator, private-mode status, profile menu.
- All sidebar items navigate to real pages. Hide or disable only features that are genuinely unavailable; do not use dead links.

## 2. Learning Roadmap pages

### 2.1 Roadmap dashboard — `/learning-roadmap`
Show:
- Welcome and short platform description.
- Overall learning progress, completed modules, lessons, projects, and assessment score.
- Continue Learning card with the last active path/module/lesson and a working Continue action.
- Learning-path cards with title, description, level, duration, skills, module count, and progress.
- Recommended next action based on actual persisted progress.
- Search and filters by domain, level, and status.

Initial learning paths:
1. Python & Data Science
2. Machine Learning
3. Deep Learning
4. Natural Language Processing
5. AI Engineering
6. Generative AI

A path is a curated curriculum container. Do not fabricate completion percentages; derive them from stored progress.

### 2.2 Learning path overview — `/learning-roadmap/:pathId`
Show:
- Path description, level, prerequisites, estimated duration, outcomes and skills.
- Overall progress and module timeline.
- Module cards with sequence, duration, lesson count, status, prerequisite state and progress.
- Continue/Start action.
- Completed, in-progress, upcoming and locked visual states.

### 2.3 Module detail — `/learning-roadmap/:pathId/modules/:moduleId`
Show:
- Module objectives, skills, prerequisites and estimated time.
- Ordered lesson list with duration, difficulty and completion state.
- Practice tasks, project (if present), and module assessment.
- Resume last incomplete lesson.
- Clear unlock requirements for locked content.

### 2.4 Lesson workspace — `/learning-roadmap/:pathId/lessons/:lessonId`
Use a focused learning workspace:
1. Lesson title, breadcrumb, duration and progress.
2. Learning objectives.
3. Concept explanation and technical vocabulary.
4. Syntax and worked examples.
5. Copyable code blocks and runnable Practice Lab hand-off.
6. Expected output and line-by-line explanation.
7. Real-world use cases.
8. Guided exercises with hints and test cases.
9. Mini-project or practical task where configured.
10. Lesson recap, notes and mistake review.
11. Previous / Next lesson navigation.
12. Mark complete only after server-side completion requirements pass.

Persist drafts and progress incrementally. Refresh/reopen must restore the learner's last position and saved work.

## 3. Learning state machine and unlock rules

Lesson states: `not_started`, `in_progress`, `practice_completed`, `completed`, `locked`.

Module states: `locked`, `available`, `in_progress`, `assessment_pending`, `completed`.

Default completion policy (configurable per lesson/module):
- Opening a lesson alone does not complete it.
- Mandatory lesson sections and configured practice requirements must be satisfied.
- If a lesson has a required assessment, it must meet its configured passing score.
- A module completes only when all mandatory lessons are completed and its module assessment is passed (if configured).
- A dependent module unlocks only when all declared prerequisite modules are completed.
- Roadmap visibility is not the same as access: learners may view locked module summaries, but protected lesson/practice/assessment endpoints must enforce unlock rules.
- Server is the source of truth. Never trust client-supplied scores, completion flags, XP, or unlock state.
- Completion endpoints must be idempotent; duplicate requests must not double-award rewards.

Proposed defaults, stored as curriculum configuration rather than hard-coded policy:
- Module assessment pass mark: 70%.
- Ten questions per standard module assessment.
- Unlimited attempts unless a curriculum item explicitly sets a limit.
- XP rewards are configurable and awarded once for each eligible completion.

## 4. Other feature pages

### AI Tutor — `/ai-tutor`
- English-only chat interface with conversation history.
- Context selector: current path, module, lesson, or general question.
- Explain concept, debug code, give examples, generate hints, suggest revision.
- Server-side OpenAI integration only; configurable model via environment variable.
- Request/token limits, timeout, retry policy, safe error states and usage logging.
- Never expose API keys in client code or logs.

### Practice Lab — `/practice-lab`
- Code editor, language selector for supported runtimes, run/stop/reset/save controls.
- Input/output console and clear execution errors.
- Exercise brief, requirements, hints, sample tests and learner test results.
- Server-side execution through isolated sandbox with execution timeout, memory/CPU limits, payload limits, rate limits and concurrency caps.
- Save drafts by learner + workspace/topic identity; do not overwrite unrelated legacy drafts.

### Projects — `/projects`
- Project catalogue with domain, level, skills, estimated duration and prerequisites.
- Project detail: problem statement, dataset/resources, milestones, acceptance criteria and submission.
- Save progress, code/files or repository URL where supported.
- Completion requires configured milestones and review/self-check rules.
- Do not claim a project is reviewed by AI unless that review actually occurred.

### Quizzes & Assessments — `/assessments`
- Lesson quizzes, module assessments and path-level assessments.
- Question types supported by the assessment schema.
- Server-calculated scoring, attempt history, explanations and retry state.
- Clear pass/fail state and unlock effect.
- Prevent answer/key leakage in APIs before submission.

### Progress & Analytics — `/analytics`
- Overall and per-path progress.
- Lesson/module completion, study time, practice attempts, assessment performance and project status.
- Daily/weekly/monthly filters and comparisons.
- Weak-topic identification based on actual failed attempts and low scores.
- Consistent definitions; deduplicate events and reconcile totals with stored records.
- No fabricated statistics or arbitrary demo values in production.

### Private Mode — `/private-mode`
- Explain single-learner private access.
- Show session/security status and sign-out/lock controls where implemented.
- Private access must be enforced server-side; hiding registration or showing a lock badge is not security.
- No public registration in the initial release.
- Add authenticated owner access and secure session handling before any public exposure.

## 5. Data architecture

Separate shared curriculum content from learner-specific progress. Proposed additive collections (subject to full model and route inventory):
- `LearningPath`: slug, title, description, level, duration, skills, prerequisites, publication state.
- `RoadmapModule`: pathId, stable module key, order, objectives, prerequisites, duration, publication state.
- `Lesson`: moduleId, stable lesson key, order, content blocks, exercises, completion policy, publication state.
- `UserLearningProgress`: owner/user key, pathId, moduleId, lessonId, state, progress, time spent, last position, completion timestamps.
- `ExerciseAttempt`: owner/user key, exerciseId, submitted answer/code reference, test results, timestamps.
- `AssessmentAttempt`: owner/user key, assessmentId, server-calculated score, pass state, answers/result summary, timestamps.
- `LearningEvent` (optional): normalized events for accurate analytics and deduplication.

Use stable IDs and explicit indexes. Enforce unique constraints only after checking existing data for collisions. Do not migrate or replace legacy records as part of UI work.

### Legacy compatibility constraints
- Preserve `EngineerJourney` and its `single-learner` key and all existing nested data.
- Preserve `aiRoadmapProgress`, topic IDs, completed stages, quiz attempts, notes and drafts.
- Preserve `RoadmapCodeWorkspace` topic IDs and workspace history.
- Preserve day-based roadmap, custom courses/lessons, projects, module tests and study schedule.
- No destructive seed, collection drop, reset, rename, or bulk rewrite.
- Back up and verify a restore before any production data migration.
- Use an adapter/compatibility layer where existing data can be safely reused.

## 6. API contract (versioned)

Proposed endpoints; confirm naming and avoid duplicating existing routes during implementation:
- `GET /api/v1/learning-paths`
- `GET /api/v1/learning-paths/:pathId`
- `GET /api/v1/learning-paths/:pathId/modules`
- `GET /api/v1/modules/:moduleId`
- `GET /api/v1/modules/:moduleId/lessons`
- `GET /api/v1/lessons/:lessonId`
- `POST /api/v1/lessons/:lessonId/start`
- `PATCH /api/v1/lessons/:lessonId/progress`
- `POST /api/v1/lessons/:lessonId/complete`
- `GET /api/v1/progress/overview`
- `GET /api/v1/progress/learning-paths/:pathId`
- `GET /api/v1/modules/:moduleId/unlock-status`
- `GET /api/v1/assessments/:assessmentId`
- `POST /api/v1/assessments/:assessmentId/submit`

Use consistent response envelopes, input validation, authorization and centralized error handling. Reuse existing endpoints where behavior is equivalent; do not break existing clients.

## 7. Frontend structure

Suggested component organization (adapt to the repository's existing JSX structure rather than forcing a wholesale rewrite):
- `pages/roadmap/RoadmapDashboard`
- `pages/roadmap/LearningPathOverview`
- `pages/roadmap/ModuleDetails`
- `pages/roadmap/LessonWorkspace`
- `pages/AITutor`
- `pages/PracticeLab`
- `pages/Projects`
- `pages/Assessments`
- `pages/Analytics`
- `pages/PrivateMode`
- `components/layout/AppShell`, `Sidebar`, `Header`, `MobileNavigation`
- `components/roadmap/LearningPathCard`, `RoadmapTimeline`, `ModuleCard`, `LessonList`, `ProgressBar`, `UnlockIndicator`
- `services/roadmapService`, `lessonService`, `progressService`, `assessmentService`, `aiTutorService`
- shared typed API response and domain types.

## 8. Non-functional requirements
- Responsive at 360px mobile width through desktop.
- Loading, empty, error, retry, offline and not-found states for every data-driven page.
- Keyboard accessible controls and visible focus.
- Reduced-motion support.
- No secrets in browser bundle.
- API authorization on every private read/write.
- Rate limits for AI and code execution.
- Structured logs without secrets or unnecessary private content.
- Unit/integration tests for unlock rules, completion, scoring, authorization and legacy compatibility.
- Build and regression tests before private deployment.

## 9. Acceptance checklist
- [ ] Dashboard and every navigation item open the correct functional page.
- [ ] Learning paths and modules are loaded from persisted curriculum data.
- [ ] Path, module, lesson and breadcrumb navigation work.
- [ ] Search and filters work.
- [ ] Lesson content, examples, output, exercises and notes render correctly.
- [ ] Drafts and progress survive refresh and browser restart.
- [ ] Completion requirements are validated on the server.
- [ ] Assessment score is calculated on the server.
- [ ] Prerequisite unlocks work and cannot be bypassed via direct API calls.
- [ ] AI Tutor handles successful, failed, timed-out and rate-limited requests.
- [ ] Practice Lab runs only in the configured sandbox and enforces limits.
- [ ] Projects and submissions persist correctly.
- [ ] Analytics reconcile with source progress/attempt records.
- [ ] Private access is enforced by the backend.
- [ ] All text and AI responses are English-only.
- [ ] Mobile/tablet/desktop and accessibility checks pass.
- [ ] Existing legacy records and flows remain intact.
- [ ] No merge or deployment occurs without explicit owner approval.

## 10. Implementation sequence
1. Baseline branch, file, route, model and dependency audit.
2. Build/test baseline and legacy regression tests.
3. Private access/security boundary.
4. Curriculum mapping and backward-compatible data layer.
5. App shell and roadmap dashboard.
6. Path overview, module detail and lesson workspace.
7. Progress state machine and prerequisite unlock service.
8. Practice Lab integration and exercise evaluation.
9. Assessments and projects.
10. AI Tutor and analytics.
11. Responsive/accessibility/security QA.
12. Private staging verification and owner approval gate.

**Definition of done:** Feature-branch implementation, reviewed diff, passing relevant tests, preserved legacy data, documented security behavior, and no unapproved merge/deployment.
