# AI Skill Forge 2.0 — Implementation Plan

## Product definition

**Mode:** Personal AI Academy (one learner / owner)  
**Release posture:** Private website initially  
**Development branch:** `feature/ai-skillforge-2.0`  
**Protected baseline:** `main`

## Guiding principles

- Extend the existing project; do not rebuild from scratch.
- Preserve all current features and identifiers unless a reviewed compatibility plan proves a change is necessary.
- Prefer additive, backward-compatible database changes.
- Do not merge or deploy without explicit approval.
- Never store secrets in source control or ask the owner to paste secret values into chat.

## Workstreams and exit criteria

### 0 — Safe baseline and repository inventory
- Record main SHA, branch state, repository structure, package scripts, runtime versions, and existing CI.
- Establish baseline client/server install, lint, build, and test results where the repository environment permits.
- Inventory all models, routes, API consumers, and collections.
- Produce a file-by-file change plan.
- Exit: baseline report exists; no changes to main or production data.

### 1 — Private single-user security boundary
- Define a private access mechanism appropriate to the existing deployment architecture.
- Protect all API routes that expose or mutate personal progress, code drafts, projects, and learning data.
- Add secure session handling, CSRF protection where cookie sessions are used, safe CORS, and security headers.
- Keep secrets in Render/Netlify secret settings, never in committed files.
- Add request throttling and audit logging.
- Exit: unauthenticated requests cannot read or modify private learning data; owner workflow remains usable.

### 2 — Database safety and compatibility
- Inventory every Mongoose model and all read/write paths.
- Create a documented backup and restore procedure; verify backup integrity before migration.
- Add only additive schema changes; preserve legacy documents and fields.
- Design a dry-run migration with counts, before/after samples, and rollback instructions.
- Exit: backup verified; migration dry-run is non-destructive; regression tests prove legacy records remain readable.

### 3 — Curriculum and learning content
- Preserve the existing seven phases and topic IDs.
- Map the 22-module source syllabus into the seven phases and a 24-week schedule.
- Keep topic, module, week, lesson, and activity identities stable.
- Deliver English-only theory, practical examples, exercises, AI responses, feedback, and assessments. No Tamil UI, translation mode, or Tamil lesson content.
- Exit: every mapped topic has traceable syllabus coverage and content-quality checks.

### 4 — Learning engine and coding workspace
- Retain the existing staged flow: concept learning, coding practice, task/problem solving, revision, and assessment.
- Improve notebook persistence and restore behavior.
- Add executable test cases for code tasks and validate examples against supported runtimes.
- Keep Python, JavaScript, and Java support where currently implemented.
- Exit: progress survives refresh; tests validate success and failure cases; no cross-topic draft collisions.

### 5 — AI Tutor and feedback
- Centralize OpenAI calls behind server-side services.
- Validate model configuration at startup or through a safe health check.
- Add English-only concept Q&A, code debugging, hint-first support, and personalized revision.
- Apply token, request, and cost limits.
- Exit: provider failures are handled gracefully; no API key reaches the browser; responses are logged without exposing secrets.

### 6 — Assessment, projects, and motivation
- Preserve existing quizzes, module tests, projects, XP, streaks, and completion records.
- Add transparent scoring and attempt history where missing.
- Prevent client-side privilege escalation for scores or completion.
- Exit: server is the source of truth for assessment outcomes and progress.

### 7 — Personal analytics
- Daily, weekly, and monthly learning summaries.
- Time spent, topics completed, quiz performance, coding attempts, weak areas, and consistency.
- Compare periods using stable definitions and avoid counting duplicate events.
- Exit: analytics reconcile with stored source records.

### 8 — Private release readiness
- Responsive mobile and desktop QA.
- Accessibility and error-state checks.
- Build, lint, tests, dependency/security review.
- Verify environment variables and API health on staging/private services.
- Restore rehearsal and backup confirmation.
- Exit: documented go/no-go checklist passes; obtain explicit owner approval before merge or deployment.

## Suggested implementation order

1. Audit docs and branch protection checks.
2. Baseline build/test and route/model inventory.
3. Data backup/restore verification.
4. Private access and API security.
5. Regression tests and schema compatibility.
6. Curriculum mapping and content QA.
7. Learning engine and code runner hardening.
8. AI Tutor, assessments, analytics.
9. Private staging verification.
10. User approval gate for any merge/deployment.

## Definition of done

A change is complete only when:
- it is committed to the feature branch;
- its diff is reviewed;
- relevant tests pass;
- existing user data and legacy flows remain compatible;
- security implications are documented;
- no production deployment or main-branch merge occurred without explicit approval.


## Product specification

See [`AI_SKILL_FORGE_2_LEARNING_ROADMAP_SPEC.md`](./AI_SKILL_FORGE_2_LEARNING_ROADMAP_SPEC.md) for the approved English-only product experience, page behavior, learning state machine, API contract, data architecture, security requirements, and acceptance checklist.
