import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import User from "./models/User.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 4100);
const origins = (process.env.CLIENT_ORIGINS || "http://localhost:5173")
  .split(",").map((origin) => origin.trim()).filter(Boolean);
const cookieName = "linguapro_session";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be a random secret with at least 32 characters");
}
if (isProduction && origins.some((origin) => !origin.startsWith("https://"))) {
  throw new Error("Production CLIENT_ORIGINS must use HTTPS");
}
if (process.env.TRUST_PROXY === "true") app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || origins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please try again later." }
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 180,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    learningLanguage: user.learningLanguage,
    explanationLanguage: user.explanationLanguage,
    level: user.level,
    dailyGoalMinutes: user.dailyGoalMinutes,
    plan: user.plan,
    progress: user.progress,
    createdAt: user.createdAt
  };
}

function issueSession(res, user) {
  const token = jwt.sign(
    { sub: user.id, purpose: "linguapro-session" },
    process.env.JWT_SECRET,
    { expiresIn: "7d", issuer: "linguapro-api", audience: "linguapro-client", jwtid: crypto.randomUUID() }
  );
  res.cookie(cookieName, token, cookieOptions);
}

function clearSession(res) {
  res.clearCookie(cookieName, {
    httpOnly: true, secure: isProduction, sameSite: "lax", path: "/"
  });
}

async function requireUser(req, res, next) {
  try {
    const token = req.cookies?.[cookieName];
    if (!token) return res.status(401).json({ error: "Please sign in to continue." });
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "linguapro-api", audience: "linguapro-client"
    });
    if (payload.purpose !== "linguapro-session" || !mongoose.isValidObjectId(payload.sub)) {
      return res.status(401).json({ error: "Session is invalid. Please sign in again." });
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      clearSession(res);
      return res.status(401).json({ error: "Session is no longer valid." });
    }
    req.user = user;
    return next();
  } catch {
    clearSession(res);
    return res.status(401).json({ error: "Session expired. Please sign in again." });
  }
}

function validateProfile(body, { registration = false } = {}) {
  const errors = [];
  if (registration && (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 80)) {
    errors.push("Name must be 2–80 characters.");
  }
  if (registration) {
    if (typeof body.password !== "string" || body.password.length < 10 || body.password.length > 72) {
      errors.push("Password must be 10–72 characters.");
    }
    if (typeof body.email !== "string" || body.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      errors.push("Enter a valid email address.");
    }
  }
  const enums = {
    learningLanguage: ["English", "Hindi", "Tamil", "Malayalam", "Kannada", "Telugu"],
    explanationLanguage: ["English", "Hindi", "Tamil", "Malayalam", "Kannada", "Telugu"],
    level: ["Basic", "Intermediate", "Advanced"],
    dailyGoalMinutes: [10, 20, 30, 45]
  };
  for (const [field, allowed] of Object.entries(enums)) {
    if (body[field] !== undefined && !allowed.includes(body[field])) errors.push(`Invalid ${field}.`);
  }
  return errors;
}

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "linguapro-api" }));
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = validateProfile(body, { registration: true });
    if (errors.length) return res.status(400).json({ error: errors[0] });

    const email = body.email.trim().toLowerCase();
    const exists = await User.exists({ email });
    if (exists) return res.status(409).json({ error: "Unable to create account with those details. Try signing in instead." });

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      name: body.name.trim(),
      email,
      passwordHash,
      learningLanguage: body.learningLanguage || "English",
      explanationLanguage: body.explanationLanguage || "Tamil",
      level: body.level || "Basic",
      dailyGoalMinutes: body.dailyGoalMinutes || 20
    });
    issueSession(res, user);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ error: "Unable to create account with those details. Try signing in instead." });
    return next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!email || !password || email.length > 254 || password.length > 72) {
      return res.status(400).json({ error: "Enter your email and password." });
    }
    const user = await User.findOne({ email }).select("+passwordHash");
    const matches = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!matches) return res.status(401).json({ error: "Email or password is incorrect." });
    issueSession(res, user);
    return res.json({ user: publicUser(user) });
  } catch (error) { return next(error); }
});

app.get("/api/auth/me", requireUser, (req, res) => res.json({ user: publicUser(req.user) }));

app.patch("/api/auth/profile", requireUser, async (req, res, next) => {
  try {
    const errors = validateProfile(req.body || {});
    if (errors.length) return res.status(400).json({ error: errors[0] });
    const allowed = ["name", "learningLanguage", "explanationLanguage", "level", "dailyGoalMinutes"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === "name") {
          if (typeof req.body.name !== "string" || req.body.name.trim().length < 2 || req.body.name.trim().length > 80) {
            return res.status(400).json({ error: "Name must be 2–80 characters." });
          }
          updates.name = req.body.name.trim();
        } else updates[key] = req.body[key];
      }
    }
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true });
    return res.json({ user: publicUser(user) });
  } catch (error) { return next(error); }
});

app.post("/api/auth/logout", (_req, res) => {
  clearSession(res);
  return res.status(204).end();
});

app.use((err, _req, res, _next) => {
  if (err?.message === "Origin not allowed") return res.status(403).json({ error: "Origin not allowed." });
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ error: "Invalid JSON body." });
  console.error("LinguaPro API error:", err?.message || "unknown error");
  return res.status(500).json({ error: "Something went wrong. Please try again." });
});

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`LinguaPro API listening on port ${port}`));
} catch (error) {
  console.error("Could not connect to MongoDB:", error.message);
  process.exit(1);
}
