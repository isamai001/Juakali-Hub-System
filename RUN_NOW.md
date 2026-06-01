# 🚀 JuaKaliHub - Complete Startup Instructions

## ✅ What's Done
- Backend dependencies installed
- Database schema ready
- All API endpoints configured
- Frontend modules integrated

## 📋 Complete Startup Steps

### STEP 1: Setup MySQL Database (Do This First!)

Open a **new terminal/PowerShell** and run:

```powershell
mysql -u root -p
```

Then paste this entire SQL command:

```sql
CREATE DATABASE IF NOT EXISTS juakalihub_db;
USE juakalihub_db;

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
  INDEX idx_is_active (is_active)
);

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

CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  worker_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

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

SHOW TABLES;
```

After pasting, verify: You should see 8 tables displayed.

Then type: `exit`

---

### STEP 2: Start Backend Server (Terminal 1)

Open **new PowerShell** window and run:

```powershell
cd C:\Users\isaya\OneDrive\Desktop\JUAKALIHUB
cd backend
npm run dev
```

✅ **You should see:**
```
╔════════════════════════════════════════╗
║   JuaKaliHub API Server Started        ║
╠════════════════════════════════════════╣
║   Port: 3000                           ║
║   Environment: development             ║
║   Database: juakalihub_db              ║
╚════════════════════════════════════════╝
```

**Leave this window running!**

---

### STEP 3: Start Frontend Server (Terminal 2)

Open **another new PowerShell** window and run:

```powershell
cd C:\Users\isaya\OneDrive\Desktop\JUAKALIHUB
cd frontend
python -m http.server 8000
```

✅ **You should see:**
```
Serving HTTP on 0.0.0.0 port 8000
```

**Leave this window running!**

---

### STEP 4: Open in Browser

Open your web browser and go to:

```
http://localhost:8000
```

---

## 🎯 Test the System

### Test 1: Register Account
1. Click "Register" button
2. Fill in form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Phone: +254712345678
   - User Type: Worker
3. Click Register
4. Go to Login page

### Test 2: Login
1. Email: john@example.com
2. Password: password123
3. Click Login
4. Should see notification and redirect to dashboard

### Test 3: Browse Workers
1. Click "Workers" in nav
2. Should see worker listings
3. Try searching or filtering

### Test 4: Create Job
1. From dashboard, click "Post Job"
2. Fill form:
   - Title: "Fix my plumbing"
   - Description: "Water leak in kitchen"
   - Category: "Plumber"
   - Budget: 5000
   - Location: "Nairobi"
3. Submit

---

## 📞 Troubleshooting

### Database Error
```
If you get: "Cannot connect to database"

1. Verify MySQL is running:
   mysql -u root -p

2. Check you created the database:
   USE juakalihub_db; SHOW TABLES;

3. Verify .env file in backend/ has correct credentials
```

### Port Already in Use
```powershell
# Find what's using port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill it
Stop-Process -Id <PID> -Force

# Then try npm run dev again
```

### Frontend Not Connecting
- Check backend is running (Terminal 1)
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console (F12) for errors
- Verify API_BASE_URL in frontend/js/api-config.js is "http://localhost:3000/api/v1"

---

## 🔗 Important URLs

| Page | URL |
|------|-----|
| Home | http://localhost:8000 |
| Workers | http://localhost:8000/pages/workers.html |
| Register | http://localhost:8000/pages/register.html |
| Login | http://localhost:8000/pages/login.html |
| API Root | http://localhost:3000/ |
| API Docs | http://localhost:3000/api/v1/ (404 expected) |

---

## 📁 File Structure
```
JUAKALIHUB/
├── backend/
│   ├── src/
│   ├── server.js
│   ├── package.json ✓ Dependencies installed
│   └── .env
├── frontend/
│   ├── pages/
│   ├── css/
│   ├── js/
│   └── images/
└── database/
    └── schema.sql
```

---

## ✅ Checklist

- [ ] Database created (8 tables)
- [ ] Backend dependencies installed
- [ ] Backend server running on 3000
- [ ] Frontend server running on 8000
- [ ] Can access http://localhost:8000
- [ ] Can register account
- [ ] Can login
- [ ] Can view workers
- [ ] Can view jobs

---

## 🎓 Next Steps After Running

1. **Test the API directly** using Postman:
   - POST to http://localhost:3000/api/v1/auth/login
   - GET http://localhost:3000/api/v1/workers

2. **Add test data:**
   - Register 3-4 test accounts
   - Post 5-6 test jobs
   - Try applying for jobs

3. **Check mobile view:**
   - Press F12 in browser
   - Click device toggle (phone icon)
   - Test responsive design

4. **Review logs:**
   - Backend terminal: See API requests
   - Browser console (F12): See frontend logs

---

**Ready to run? Follow the 4 steps above! 🚀**
