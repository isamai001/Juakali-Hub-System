/**
 * ============================================================
 * Workers Routes
 * ============================================================
 */

"use strict";

const express = require("express");
const workerController = require("../controllers/workerController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", workerController.getAllWorkers);
router.get("/search", workerController.searchWorkers);
router.get("/:id", workerController.getWorker);

// Protected routes
router.put("/:id", verifyToken, workerController.updateWorkerProfile);

module.exports = router;
