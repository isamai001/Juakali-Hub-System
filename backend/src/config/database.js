/**
 * ============================================================
 * Database Connection Module
 * ============================================================
 * Establishes and manages MySQL connection pool.
 * Uses connection pooling for better performance.
 */

"use strict";

const mysql = require("mysql2/promise");
require("dotenv").config();

// ── Connection Pool Configuration ────────────────────────────
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "juakalihub_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

/**
 * Test database connection
 * Call this on server startup to verify connectivity
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✓ Database connection successful!");
    const result = await connection.query("SELECT 1 as test");
    connection.release();
    return true;
  } catch (error) {
    console.error("✗ Database connection failed:", error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  query: (sql, values) => pool.query(sql, values),
};
