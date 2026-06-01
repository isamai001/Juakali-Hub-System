/**
 * ============================================================
 * Authentication Routes
 * ============================================================
 */

"use strict";

const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/profile/:id", authController.getProfile);
router.put("/profile/:id", verifyToken, authController.updateProfile);

module.exports = router;
