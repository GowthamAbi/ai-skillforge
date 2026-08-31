# AI SkillForge
50-day AI Engineering study dashboard: task tracking, study minutes, charts, GitHub activity and OpenAI mentor scoring.

## Requirements
Node 20+ and MongoDB (local or Atlas).

## Server
```bash
cd server
npm install
cp .env.example .env
# edit .env with your own secrets
npm run seed
npm run dev
```

## Client
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

## Secrets
Never put OPENAI_API_KEY or GITHUB_TOKEN in client/.env. Keep them only in server/.env. Never commit server/.env.

## AI mentor
The server uses the official OpenAI Node SDK and Responses API. Change OPENAI_MODEL in server/.env if desired.
