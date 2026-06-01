/**
 * ============================================================
 * Jobs Controller
 * ============================================================
 * Handles job posting, applications, and job management.
 */

"use strict";

const db = require("../config/database");

// ── Create New Job ───────────────────────────────────────────
exports.createJob = async (req, res) => {
  try {
    const clientId = req.params.id || req.user?.id;
    const {
      title,
      description,
      category,
      budget,
      location,
      due_date,
    } = req.body;

    if (!clientId || !title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const [result] = await db.query(
      "INSERT INTO jobs (client_id, title, description, category, budget, location, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [clientId, title, description, category, budget || 0, location, due_date || null]
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job_id: result.insertId,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// ── Get All Jobs ─────────────────────────────────────────────
exports.getAllJobs = async (req, res) => {
  try {
    const { category, location, status = "open", page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT j.*, u.first_name, u.last_name FROM jobs j JOIN users u ON j.client_id = u.id WHERE 1=1";
    const params = [];

    if (status) {
      query += " AND j.status = ?";
      params.push(status);
    }

    if (category) {
      query += " AND j.category = ?";
      params.push(category);
    }

    if (location) {
      query += " AND j.location LIKE ?";
      params.push(`%${location}%`);
    }

    query += " ORDER BY j.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [jobs] = await db.query(query, params);

    // Count query
    let countQuery = "SELECT COUNT(*) as total FROM jobs j WHERE 1=1";
    const countParams = [];

    if (status) {
      countQuery += " AND status = ?";
      countParams.push(status);
    }

    if (category) {
      countQuery += " AND category = ?";
      countParams.push(category);
    }

    if (location) {
      countQuery += " AND location LIKE ?";
      countParams.push(`%${location}%`);
    }

    const [countResult] = await db.query(countQuery, countParams);

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        pages: Math.ceil(countResult[0].total / limit),
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// ── Get Single Job ───────────────────────────────────────────
exports.getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const [jobs] = await db.query(
      "SELECT j.*, u.first_name, u.last_name, u.email FROM jobs j JOIN users u ON j.client_id = u.id WHERE j.id = ?",
      [id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Get applications
    const [applications] = await db.query(
      "SELECT a.*, w.first_name, w.last_name, w.rating FROM applications a JOIN users w ON a.worker_id = w.id WHERE a.job_id = ? ORDER BY a.created_at DESC",
      [id]
    );

    res.status(200).json({
      success: true,
      job: jobs[0],
      applications,
    });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

// ── Apply for Job ────────────────────────────────────────────
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const workerId = req.user?.id;
    const { message, proposed_budget } = req.body;

    if (!workerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if already applied
    const [existing] = await db.query(
      "SELECT id FROM applications WHERE job_id = ? AND worker_id = ?",
      [jobId, workerId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const [result] = await db.query(
      "INSERT INTO applications (job_id, worker_id, message, proposed_budget) VALUES (?, ?, ?, ?)",
      [jobId, workerId, message || "", proposed_budget || 0]
    );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application_id: result.insertId,
    });
  } catch (error) {
    console.error("Apply for job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply for job",
      error: error.message,
    });
  }
};

// ── Update Job Status ────────────────────────────────────────
exports.updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "in_progress", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    await db.query("UPDATE jobs SET status = ? WHERE id = ?", [status, id]);

    res.status(200).json({
      success: true,
      message: "Job status updated",
    });
  } catch (error) {
    console.error("Update job status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update job status",
      error: error.message,
    });
  }
};
