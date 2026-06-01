/**
 * ============================================================
 * Authentication Controller
 * ============================================================
 * Handles user registration, login, and profile management.
 */

"use strict";

const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ── User Registration ────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      user_type,
      location,
    } = req.body;

    // Validation
    if (!first_name || !last_name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if user already exists
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email or phone already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      "INSERT INTO users (first_name, last_name, email, password, phone, user_type, location) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        phone,
        user_type || "client",
        location || "",
      ]
    );

    // If registering as worker, create worker profile
    if (user_type === "worker") {
      await db.query(
        "INSERT INTO workers (user_id, skills, experience_years) VALUES (?, ?, ?)",
        [result.insertId, JSON.stringify([]), 0]
      );
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user_id: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ── User Login ───────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET || "your_secret_key_here",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        user_type: user.user_type,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ── Get User Profile ─────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const [users] = await db.query(
      "SELECT id, first_name, last_name, email, phone, user_type, profile_picture, bio, location, rating, is_verified FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // If worker, get worker details
    if (user.user_type === "worker") {
      const [workerData] = await db.query(
        "SELECT * FROM workers WHERE user_id = ?",
        [userId]
      );
      if (workerData.length > 0) {
        user.worker_profile = workerData[0];
      }
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// ── Update User Profile ──────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user?.id;
    const { first_name, last_name, bio, location, phone } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, bio = ?, location = ? WHERE id = ?",
      [first_name, last_name, bio, location, userId]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
