# LinguaPro Auth API (initial phase)

This is an isolated API scaffold for the LinguaPro prototype. It does not alter the existing SkillForge server. It provides email/password registration and login, an HTTP-only session cookie, current-user lookup, profile preferences, and logout.

## Local setup

1. Install Node.js 20 or later and MongoDB (local or hosted).
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI`, a randomly generated `JWT_SECRET` of at least 32 characters, and the exact frontend origin in `CLIENT_ORIGINS`.
4. Run `npm install`, then `npm run dev`.
5. Health check: `GET http://localhost:4100/api/health`.

Never commit `.env`, put server secrets in frontend code, or paste API keys into chat.

## Routes

- `POST /api/auth/register`: name, email, password (10–72 chars), optional learning language, explanation language, level, daily goal.
- `POST /api/auth/login`: email and password.
- `GET /api/auth/me`: current signed-in profile.
- `PATCH /api/auth/profile`: editable profile preferences.
- `POST /api/auth/logout`: clears the session cookie.

All authenticated routes use the server-verified HTTP-only cookie. Passwords are bcrypt-hashed; authentication endpoints are rate limited; request bodies and profile enum values are validated.

## Deployment checklist

- Deploy this folder as a separate Node service; set the environment variables in the hosting dashboard.
- Use HTTPS in production and set `NODE_ENV=production`, `JWT_SECRET`, `MONGODB_URI`, and the real HTTPS frontend origin in `CLIENT_ORIGINS`.
- If the frontend and API are on different sites, review cookie `SameSite` and CSRF protection before enabling cross-site cookies. Keep frontend and API on the same site where possible.
- Add email verification, password-reset delivery, session revocation/rotation, CSRF protection for cross-site deployment, automated integration tests, and monitoring before public launch.
- Do not treat the demo dashboard's local browser state as account-backed progress until its frontend is wired to these API routes.
- Payments, AI tutoring, billing entitlements, and per-user task/progress collections are not implemented in this initial scaffold.
