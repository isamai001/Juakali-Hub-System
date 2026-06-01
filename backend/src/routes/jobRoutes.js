/**
 * ============================================================
 * Jobs Routes
 * ============================================================
 */

"use strict";

const express = require("express");
const jobController = require("../controllers/jobController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJob);

// Protected routes
router.post("/", verifyToken, jobController.createJob);
router.post("/:jobId/apply", verifyToken, jobController.applyForJob);
router.patch("/:id/status", verifyToken, jobController.updateJobStatus);

module.exports = router;
