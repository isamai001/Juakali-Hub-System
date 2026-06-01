# JuaKaliHub Setup Guide

## Project Overview
JuaKaliHub is a digital platform that connects skilled Jua Kali workers with clients across Kenya. The system features a modern React-like frontend with a robust Node.js/Express backend powered by MySQL.

## Project Structure
```
JUAKALIHUB/
├── frontend/          # Client-side application
│   ├── pages/        # HTML pages (index, login, register, workers, etc.)
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript modules
│   └── images/       # Image assets
├── backend/          # Server-side application
│   ├── src/
│   │   ├── config/   # Database configuration
│   │   ├── controllers/  # Business logic
│   │   ├── routes/   # API endpoints
│   │   ├── middleware/   # Authentication, validation
│   │   └── utils/    # Helper functions
│   ├── server.js     # Main server file
│   ├── package.json  # Dependencies
│   └── .env         # Environment variables
└── database/        # Database schema and scripts
    └── schema.sql   # MySQL database schema
```

## Prerequisites
- Node.js (v14 or higher)
- MySQL 5.7+ or MySQL 8.0+
- npm (comes with Node.js)

## Step 1: Setup MySQL Database

### Option A: Using MySQL Command Line

1. Open MySQL:
```bash
mysql -u root -p
```

2. Copy and paste the entire contents of `database/schema.sql` into the MySQL prompt

3. Verify the database was created:
```bash
USE juakalihub_db;
SHOW TABLES;
```

### Option B: Using MySQL Workbench or phpMyAdmin

1. Create a new connection to your MySQL server
2. Open the query editor
3. Load and execute `database/schema.sql`

## Step 2: Setup Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Update `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=juakalihub_db
DB_PORT=3306
JWT_SECRET=your_secret_key
PORT=3000
```

4. Start the backend server:

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

You should see:
```
╔════════════════════════════════════════╗
║   JuaKaliHub API Server Started        ║
╠════════════════════════════════════════╣
║   Port: 3000                           ║
║   Environment: development             ║
║   Database: juakalihub_db              ║
╚════════════════════════════════════════╝
```

## Step 3: Setup Frontend

1. Navigate to the frontend directory (from project root):
```bash
cd frontend
```

2. Update API configuration in `js/api-config.js` if needed:
```javascript
const API_BASE_URL = "http://localhost:3000/api/v1";
```

3. Serve the frontend using a local web server:

**Option A: Using Python (Python 3):**
```bash
python -m http.server 8000
```

**Option B: Using Node.js (http-server package):**
```bash
npm install -g http-server
http-server
```

**Option C: Using VS Code Live Server extension**
- Right-click on `index.html` → Open with Live Server

Access the application at `http://localhost:8000` (or the port shown)

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile/:id` - Get user profile
- `PUT /api/v1/auth/profile/:id` - Update user profile

### Workers
- `GET /api/v1/workers` - List all workers (with pagination)
- `GET /api/v1/workers/search` - Search workers
- `GET /api/v1/workers/:id` - Get worker profile
- `PUT /api/v1/workers/:id` - Update worker profile

### Jobs
- `GET /api/v1/jobs` - List all jobs (with pagination)
- `GET /api/v1/jobs/:id` - Get job details
- `POST /api/v1/jobs` - Create new job
- `POST /api/v1/jobs/:jobId/apply` - Apply for job
- `PATCH /api/v1/jobs/:id/status` - Update job status

## Sample Test Data

### Register a Test Account
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+254712345678",
  "user_type": "worker"
}
```

### Post a Test Job
```json
{
  "title": "Plumbing Repair",
  "description": "Need to fix water leak in kitchen",
  "category": "Plumber",
  "budget": 5000,
  "location": "Nairobi",
  "due_date": "2026-06-30"
}
```

## Troubleshooting

### Database Connection Failed
- Verify MySQL is running: `mysql --version`
- Check connection details in `.env`
- Ensure database was created: `mysql -u root -p juakalihub_db`

### Port 3000 Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### CORS Errors
- Update `CLIENT_ORIGIN` in `.env` to match your frontend URL
- Ensure `.env` has correct frontend origin

### Missing Dependencies
```bash
cd backend
npm install
```

## Development Workflow

1. Make changes to backend code
2. Server auto-reloads with `npm run dev`
3. Frontend auto-reloads with Live Server
4. Check browser console for errors
5. Check backend terminal for server logs

## Key Features

✓ User authentication (register & login)
✓ Worker profiles with skills and ratings
✓ Job posting and management
✓ Worker search and filtering
✓ Application system
✓ Review system
✓ Real-time notifications
✓ Responsive design for all devices
✓ Dark theme with Kenya-inspired colors

## Database Schema

### Main Tables
- **users** - All user accounts
- **workers** - Extended worker profiles
- **jobs** - Job postings
- **applications** - Worker applications to jobs
- **bookings** - Confirmed job assignments
- **reviews** - Job reviews and ratings
- **messages** - Direct messaging
- **categories** - Job categories/trades

## Deployment

For production deployment:

1. Use a production-grade web server (Nginx/Apache)
2. Set `NODE_ENV=production`
3. Use a proper domain and SSL certificate
4. Update CORS origins
5. Use environment variables from hosting platform
6. Consider database backups and monitoring

## Support & Documentation

- Backend: Express.js
- Frontend: Vanilla JavaScript
- Database: MySQL
- Authentication: JWT tokens

## License

MIT License - See LICENSE file for details

---

**Happy coding! 🚀**
