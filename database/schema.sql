-- ============================================================
-- JuaKaliHub Database Schema
-- ============================================================
-- This SQL script creates all necessary tables for the platform.
-- Connect to MySQL and run this script to initialize the database.
-- ============================================================

-- Create the database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS juakalihub_db;
USE juakalihub_db;

-- ============================================================
-- USERS TABLE
-- ============================================================
-- Stores all user accounts (both workers and clients)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  user_type ENUM('worker', 'client', 'admin') DEFAULT 'client',
  profile_picture VARCHAR(255),
  bio TEXT,
  location VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0.00,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_user_type (user_type),
  INDEX idx_phone (phone)
);

-- ============================================================
-- WORKERS TABLE
-- ============================================================
-- Extended profile for users who are registered as workers
CREATE TABLE IF NOT EXISTS workers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  skills JSON NOT NULL,
  experience_years INT DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  bio TEXT,
  certifications VARCHAR(255),
  total_jobs_completed INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_skills (skills(100)),
  INDEX idx_is_active (is_active)
);

-- ============================================================
-- JOBS TABLE
-- ============================================================
-- Lists all job postings created by clients
CREATE TABLE IF NOT EXISTS jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  budget DECIMAL(10,2),
  location VARCHAR(255) NOT NULL,
  status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  start_date DATE,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_client_id (client_id)
);

-- ============================================================
-- APPLICATIONS TABLE
-- ============================================================
-- Workers apply to jobs through this table
CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  job_id INT NOT NULL,
  worker_id INT NOT NULL,
  message TEXT,
  proposed_budget DECIMAL(10,2),
  status ENUM('pending', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (job_id, worker_id),
  INDEX idx_status (status),
  INDEX idx_worker_id (worker_id)
);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
-- Records accepted job bookings (worker-client assignments)
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  job_id INT NOT NULL,
  worker_id INT NOT NULL,
  client_id INT NOT NULL,
  agreed_budget DECIMAL(10,2),
  agreed_start_date DATE,
  agreed_end_date DATE,
  status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_worker_id (worker_id),
  INDEX idx_client_id (client_id)
);

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
-- Client and worker reviews for completed jobs
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  reviewee_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_reviewee_id (reviewee_id),
  INDEX idx_reviewer_id (reviewer_id)
);

-- ============================================================
-- MESSAGES TABLE
-- ============================================================
-- Direct messaging between users
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  job_id INT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
  INDEX idx_receiver_id (receiver_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_is_read (is_read)
);

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
-- Job categories / trades
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  worker_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- ============================================================
-- Insert default categories
-- ============================================================
INSERT INTO categories (name, description, icon, worker_count) VALUES
('Electrician', 'Electrical wiring, installation, and repair', '⚡', 320),
('Plumber', 'Plumbing installation and repair services', '🔧', 210),
('Welder', 'Metal welding and fabrication work', '🔨', 180),
('Tailor', 'Tailoring and sewing services', '✂️', 240),
('Carpenter', 'Carpentry and woodwork services', '🏠', 160),
('Painter', 'Interior and exterior painting', '🎨', 195),
('Electronics Repair', 'Phone, TV, and electronics repair', '📱', 140),
('Mechanic', 'Vehicle repair and maintenance', '🚗', 270)
ON DUPLICATE KEY UPDATE worker_count=VALUES(worker_count);

-- ============================================================
-- INDEXES for performance optimization
-- ============================================================
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
