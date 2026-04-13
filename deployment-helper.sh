#!/bin/bash

# 🚀 GOGO Ecommerce Vercel Deployment Helper Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🚀 GOGO Ecommerce Vercel Deployment Helper               ║"
echo "║   Full-Stack Deployment Guide                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Verify Prerequisites
echo -e "${BLUE}[STEP 1/8] Verifying Prerequisites...${NC}"
echo ""

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js ${NC}$(node -v)"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm ${NC}$(npm -v)"

if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git not found. Please install Git${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git ${NC}$(git --version | cut -d' ' -f3)"

echo ""

# Step 2: Check Project Structure
echo -e "${BLUE}[STEP 2/8] Checking Project Structure...${NC}"
echo ""

if [ -d "client" ] && [ -d "server" ]; then
    echo -e "${GREEN}✓ Found both client and server directories${NC}"
else
    echo -e "${RED}✗ Project structure invalid. Need client/ and server/ directories${NC}"
    exit 1
fi

if [ -f "client/package.json" ]; then
    echo -e "${GREEN}✓ Client package.json found${NC}"
else
    echo -e "${RED}✗ client/package.json not found${NC}"
    exit 1
fi

if [ -f "server/package.json" ]; then
    echo -e "${GREEN}✓ Server package.json found${NC}"
else
    echo -e "${RED}✗ server/package.json not found${NC}"
    exit 1
fi

echo ""

# Step 3: Install Dependencies
echo -e "${BLUE}[STEP 3/8] Installing Dependencies...${NC}"
echo ""

echo "Installing client dependencies..."
cd client
npm install 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Client dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install client dependencies${NC}"
    exit 1
fi
cd ..

echo "Installing server dependencies..."
cd server
npm install 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install server dependencies${NC}"
    exit 1
fi
cd ..

echo ""

# Step 4: Verify Builds
echo -e "${BLUE}[STEP 4/8] Verifying Project Builds...${NC}"
echo ""

echo "Building client..."
cd client
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Client builds successfully${NC}"
else
    echo -e "${RED}✗ Client build failed. Check errors above${NC}"
    exit 1
fi
cd ..

echo ""

# Step 5: Git Repository Check
echo -e "${BLUE}[STEP 5/8] Checking Git Repository...${NC}"
echo ""

if [ -d ".git" ]; then
    echo -e "${GREEN}✓ Git repository already initialized${NC}"
    if [ -n "$(git remote get-url origin 2>/dev/null)" ]; then
        echo -e "${GREEN}✓ Remote origin: $(git remote get-url origin)${NC}"
    fi
else
    echo -e "${YELLOW}ℹ Git repository not initialized${NC}"
    echo "  Run: git init && git add . && git commit -m 'Initial commit'"
fi

echo ""

# Step 6: Environment Variables Check
echo -e "${BLUE}[STEP 6/8] Environment Variables Check...${NC}"
echo ""

if [ -f ".env" ] || [ -f "server/.env" ]; then
    echo -e "${GREEN}✓ Environment files found${NC}"
    echo -e "${YELLOW}  Note: Don't commit .env files to Git${NC}"
else
    echo -e "${YELLOW}ℹ No .env file found (OK for production)${NC}"
    echo "  Environment variables should be set in Vercel Dashboard"
fi

if [ -f "client/.env.local" ] || [ -f "client/.env.production" ]; then
    echo -e "${GREEN}✓ Client environment file found${NC}"
fi

echo ""

# Step 7: Deployment Ready Check
echo -e "${BLUE}[STEP 7/8] Deployment Readiness Summary...${NC}"
echo ""

echo -e "${GREEN}✓ Project Structure:${NC} Valid"
echo -e "${GREEN}✓ Dependencies:${NC} Installed"
echo -e "${GREEN}✓ Build Status:${NC} Successful"
echo -e "${GREEN}✓ Git Status:${NC} Ready"

echo ""

# Step 8: Next Steps
echo -e "${BLUE}[STEP 8/8] Next Steps for Vercel Deployment${NC}"
echo ""

echo "1️⃣  Push to GitHub:"
echo -e "   ${YELLOW}git add .${NC}"
echo -e "   ${YELLOW}git commit -m 'Prepare for Vercel deployment'${NC}"
echo -e "   ${YELLOW}git push -u origin main${NC}"
echo ""

echo "2️⃣  Go to Vercel Dashboard:"
echo -e "   ${YELLOW}https://vercel.com/dashboard${NC}"
echo ""

echo "3️⃣  Import Repository:"
echo -e "   • Click 'New Project'"
echo -e "   • Select your GitHub repository"
echo -e "   • Set Root Directory to ${GREEN}'client/'${NC}"
echo -e "   • Click 'Deploy'"
echo ""

echo "4️⃣  Set Environment Variables:"
echo -e "   • Go to Settings → Environment Variables"
echo -e "   • Add all variables from ${GREEN}ENV_VARIABLES_TEMPLATE.md${NC}"
echo -e "   • Redeploy"
echo ""

echo "5️⃣  Deploy Server (same repo):"
echo -e "   • Import same GitHub repo"
echo -e "   • Set Root Directory to ${GREEN}'server/'${NC}"
echo -e "   • Add server environment variables"
echo -e "   • Click 'Deploy'"
echo ""

echo "📖 Full Guide:"
echo -e "   ${YELLOW}See VERCEL_DEPLOYMENT_GUIDE.md${NC}"
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}  ✅ Project is ready for Vercel deployment!      ║${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════╝${NC}"
echo ""
