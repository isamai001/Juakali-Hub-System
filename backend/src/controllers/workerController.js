/**
 * ============================================================
 * Workers Controller
 * ============================================================
 * Handles worker-related operations and profiles.
 */

"use strict";

const db = require("../config/database");

// ── Get All Workers ──────────────────────────────────────────
exports.getAllWorkers = async (req, res) => {
  try {
    const { skill, location, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query =
      "SELECT u.id, u.first_name, u.last_name, u.profile_picture, u.location, u.rating, w.skills, w.hourly_rate, w.total_jobs_completed FROM users u JOIN workers w ON u.id = w.user_id WHERE w.is_active = true";
    const params = [];

    if (skill) {
      query += " AND JSON_CONTAINS(w.skills, JSON_QUOTE(?))";
      params.push(skill);
    }

    if (location) {
      query += " AND u.location LIKE ?";
      params.push(`%${location}%`);
    }

    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [workers] = await db.query(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM users u JOIN workers w ON u.id = w.user_id WHERE w.is_active = true";
    const countParams = [];

    if (skill) {
      countQuery += " AND JSON_CONTAINS(w.skills, JSON_QUOTE(?))";
      countParams.push(skill);
    }

    if (location) {
      countQuery += " AND u.location LIKE ?";
      countParams.push(`%${location}%`);
    }

    const [countResult] = await db.query(countQuery, countParams);

    res.status(200).json({
      success: true,
      workers: workers.map((w) => ({
        ...w,
        skills: JSON.parse(w.skills),
      })),
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        pages: Math.ceil(countResult[0].total / limit),
      },
    });
  } catch (error) {
    console.error("Get workers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workers",
      error: error.message,
    });
  }
};

// ── Get Single Worker ────────────────────────────────────────
exports.getWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      "SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.profile_picture, u.bio, u.location, u.rating FROM users u WHERE u.id = ? AND u.user_type = 'worker'",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    const [workerData] = await db.query(
      "SELECT skills, experience_years, hourly_rate, certifications, total_jobs_completed, average_rating FROM workers WHERE user_id = ?",
      [id]
    );

    if (workerData.length > 0) {
      users[0].worker_info = {
        ...workerData[0],
        skills: JSON.parse(workerData[0].skills),
      };
    }

    // Get reviews
    const [reviews] = await db.query(
      "SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.reviewer_id = u.id WHERE r.reviewee_id = ? ORDER BY r.created_at DESC LIMIT 5",
      [id]
    );

    res.status(200).json({
      success: true,
      worker: users[0],
      reviews,
    });
  } catch (error) {
    console.error("Get worker error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch worker",
      error: error.message,
    });
  }
};

// ── Update Worker Profile ────────────────────────────────────
exports.updateWorkerProfile = async (req, res) => {
  try {
    const workerId = req.params.id || req.user?.id;
    const { skills, experience_years, hourly_rate, certifications, bio } =
      req.body;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "Worker ID is required",
      });
    }

    // Update user bio
    if (bio) {
      await db.query("UPDATE users SET bio = ? WHERE id = ?", [bio, workerId]);
    }

    // Update worker profile
    const updateData = [];
    const updateParams = [];

    if (skills) {
      updateData.push("skills = ?");
      updateParams.push(JSON.stringify(skills));
    }
    if (experience_years !== undefined) {
      updateData.push("experience_years = ?");
      updateParams.push(experience_years);
    }
    if (hourly_rate) {
      updateData.push("hourly_rate = ?");
      updateParams.push(hourly_rate);
    }
    if (certifications) {
      updateData.push("certifications = ?");
      updateParams.push(certifications);
    }

    if (updateData.length > 0) {
      updateParams.push(workerId);
      await db.query(`UPDATE workers SET ${updateData.join(", ")} WHERE user_id = ?`, updateParams);
    }

    res.status(200).json({
      success: true,
      message: "Worker profile updated successfully",
    });
  } catch (error) {
    console.error("Update worker profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update worker profile",
      error: error.message,
    });
  }
};

// ── Search Workers ───────────────────────────────────────────
exports.searchWorkers = async (req, res) => {
  try {
    const { q, skill, location } = req.query;

    let query = "SELECT u.id, u.first_name, u.last_name, u.profile_picture, u.location, u.rating, w.skills, w.hourly_rate FROM users u JOIN workers w ON u.id = w.user_id WHERE w.is_active = true";
    const params = [];

    if (q) {
      query += " AND (u.first_name LIKE ? OR u.last_name LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    if (skill) {
      query += " AND JSON_CONTAINS(w.skills, JSON_QUOTE(?))";
      params.push(skill);
    }

    if (location) {
      query += " AND u.location LIKE ?";
      params.push(`%${location}%`);
    }

    query += " LIMIT 20";

    const [workers] = await db.query(query, params);

    res.status(200).json({
      success: true,
      workers: workers.map((w) => ({
        ...w,
        skills: JSON.parse(w.skills),
      })),
    });
  } catch (error) {
    console.error("Search workers error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};
