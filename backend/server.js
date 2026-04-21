/**
 * ============================================================
 * JuaKaliHub — Main Server Entry Point
 * ============================================================
 * Connects skilled workers (jua kali) with clients across Kenya.
 *
 * Author  : JuaKaliHub Team
 * Stack   : Node.js · Express · MySQL
 * ============================================================
 */

"use strict";

// ── Core dependencies ────────────────────────────────────────
const express    = require("express");
const cors       = require("cors");
const bodyParser = require("body-parser");

// ── Environment configuration ────────────────────────────────
// Always load .env before reading any process.env values.
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// ── Initialise Express application ──────────────────────────
const app = express();

// ============================================================
// GLOBAL MIDDLEWARE
// ============================================================

/**
 * CORS — allow cross-origin requests.
 * In production, replace the wildcard origin with your actual
 * front-end domain(s), e.g. "https://juakalihub.co.ke".
 */
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * Body-parser — parse incoming request bodies.
 * JSON  : handles application/json payloads.
 * URL   : handles HTML form submissions.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ============================================================
// ROUTES
// ============================================================

/**
 * Health-check / root route.
 * Useful for uptime monitors and deployment pipelines to
 * confirm the server is live and responding.
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "JuaKaliHub API running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

/**
 * TODO: Mount feature routers here as you build them out.
 *
 * Example:
 *   const authRoutes   = require("./src/modules/auth/authRoutes");
 *   const workerRoutes = require("./src/modules/workers/workerRoutes");
 *   const clientRoutes = require("./src/modules/clients/clientRoutes");
 *   const jobRoutes    = require("./src/modules/jobs/jobRoutes");
 *   const reviewRoutes = require("./src/modules/reviews/reviewRoutes");
 *   const adminRoutes  = require("./src/modules/admin/adminRoutes");
 *
 *   app.use("/api/v1/auth",    authRoutes);
 *   app.use("/api/v1/workers", workerRoutes);
 *   app.use("/api/v1/clients", clientRoutes);
 *   app.use("/api/v1/jobs",    jobRoutes);
 *   app.use("/api/v1/reviews", reviewRoutes);
 *   app.use("/api/v1/admin",   adminRoutes);
 */

// ============================================================
// 404 — Unknown Route Handler
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
/**
 * Express recognises a 4-argument middleware as an error handler.
 * Any error passed to next(err) anywhere in the app lands here.
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[JuaKaliHub Error]", err.stack || err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log("╔══════════════════════════════════════╗");
  console.log("║        JuaKaliHub API Server         ║");
  console.log("╠══════════════════════════════════════╣");
  console.log(`║  Status  : ✅ Running                ║`);
  console.log(`║  Port    : ${PORT}                         ║`);
  console.log(`║  Env     : ${(process.env.NODE_ENV || "development").padEnd(24)}║`);
  console.log("╚══════════════════════════════════════╝");
});

// ── Export for integration testing (e.g. Jest + Supertest) ──
module.exports = app;