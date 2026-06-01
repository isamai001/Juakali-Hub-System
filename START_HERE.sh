#!/bin/bash
# JuaKaliHub - Complete Startup Script
# Run this script to get everything up and running

echo "╔════════════════════════════════════════════════════════╗"
echo "║     JuaKaliHub - System Startup Guide                 ║"
echo "║     Complete setup instructions                       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Verify Prerequisites${NC}"
echo "=================================="
echo "Checking for required software..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠ Node.js not found. Please install Node.js from https://nodejs.org/${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠ npm not found. Please install npm${NC}"
    exit 1
else
    echo -e "${GREEN}✓ npm $(npm --version)${NC}"
fi

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠ MySQL not found. Please install MySQL${NC}"
    exit 1
else
    echo -e "${GREEN}✓ MySQL installed${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Setup Database${NC}"
echo "=================================="
echo "You need to manually setup the database:"
echo ""
echo "1. Open MySQL:"
echo -e "   ${YELLOW}mysql -u root -p${NC}"
echo ""
echo "2. Run the schema file:"
echo -e "   ${YELLOW}source database/schema.sql;${NC}"
echo ""
echo "3. Verify database:"
echo -e "   ${YELLOW}USE juakalihub_db;${NC}"
echo -e "   ${YELLOW}SHOW TABLES;${NC}"
echo ""
echo -e "${GREEN}✓ Database setup complete${NC}"
echo ""

read -p "Press Enter once you've setup the database..."

echo ""
echo -e "${BLUE}Step 3: Setup Backend${NC}"
echo "=================================="
echo "Installing backend dependencies..."
echo ""

cd backend

if [ -f "package.json" ]; then
    npm install --quiet
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ package.json not found${NC}"
    exit 1
fi

echo ""
echo "Backend setup complete!"
echo ""

echo -e "${BLUE}Step 4: Start Services${NC}"
echo "=================================="
echo ""
echo "You now need to start two separate terminals:"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend Server:${NC}"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend Server:${NC}"
echo "  cd frontend"
echo "  python -m http.server 8000"
echo "  (or use VS Code Live Server)"
echo ""

echo -e "${BLUE}Step 5: Access Application${NC}"
echo "=================================="
echo ""
echo "Once both servers are running:"
echo -e "  ${YELLOW}Frontend: http://localhost:8000${NC}"
echo -e "  ${YELLOW}Backend:  http://localhost:3000${NC}"
echo ""

echo -e "${BLUE}Quick Test Checklist:${NC}"
echo "=================================="
echo "[ ] Database is running (mysql -u root juakalihub_db)"
echo "[ ] Backend is running (npm run dev on port 3000)"
echo "[ ] Frontend is running (python -m http.server on port 8000)"
echo "[ ] Can access http://localhost:8000"
echo "[ ] Can register a new account"
echo "[ ] Can login with registered account"
echo "[ ] Can browse workers"
echo "[ ] Can view job listings"
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Setup Complete! Follow the instructions above.${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
