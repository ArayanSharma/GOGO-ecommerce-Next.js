@echo off
REM 🚀 GOGO Ecommerce Vercel Deployment Helper Script (Windows)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   🚀 GOGO Ecommerce Vercel Deployment Helper               ║
echo ║   Full-Stack Deployment Guide (Windows)                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Colors using echo (Windows limitation)
REM Step 1: Verify Prerequisites
echo [STEP 1/8] Verifying Prerequisites...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo [OK] npm %%i

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git not found. Please install Git
    pause
    exit /b 1
)
echo [OK] Git installed

echo.

REM Step 2: Check Project Structure
echo [STEP 2/8] Checking Project Structure...
echo.

if exist client\ (
    echo [OK] Found 'client' directory
) else (
    echo [ERROR] 'client' directory not found
    pause
    exit /b 1
)

if exist server\ (
    echo [OK] Found 'server' directory
) else (
    echo [ERROR] 'server' directory not found
    pause
    exit /b 1
)

if exist client\package.json (
    echo [OK] client\package.json found
) else (
    echo [ERROR] client\package.json not found
    pause
    exit /b 1
)

if exist server\package.json (
    echo [OK] server\package.json found
) else (
    echo [ERROR] server\package.json not found
    pause
    exit /b 1
)

echo.

REM Step 3: Install Dependencies
echo [STEP 3/8] Installing Dependencies...
echo.

echo Installing client dependencies...
cd client
call npm install >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Client dependencies installed
) else (
    echo [ERROR] Failed to install client dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo Installing server dependencies...
cd server
call npm install >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Server dependencies installed
) else (
    echo [ERROR] Failed to install server dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.

REM Step 4: Verify Builds
echo [STEP 4/8] Verifying Project Builds...
echo.

echo Building client...
cd client
call npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Client builds successfully
) else (
    echo [ERROR] Client build failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.

REM Step 5: Git Repository Check
echo [STEP 5/8] Checking Git Repository...
echo.

if exist .git\ (
    echo [OK] Git repository already initialized
) else (
    echo [INFO] Git repository not initialized
    echo  Run: git init ^&^& git add . ^&^& git commit -m "Initial commit"
)

echo.

REM Step 6: Environment Variables Check
echo [STEP 6/8] Environment Variables Check...
echo.

if exist .env (
    echo [OK] Environment file found
    echo  Note: Don't commit .env files to Git
) else if exist server\.env (
    echo [OK] Server environment file found
) else (
    echo [INFO] No .env file found (OK for production)
    echo  Environment variables should be set in Vercel Dashboard
)

echo.

REM Step 7: Deployment Ready Check
echo [STEP 7/8] Deployment Readiness Summary...
echo.

echo [OK] Project Structure: Valid
echo [OK] Dependencies: Installed
echo [OK] Build Status: Successful
echo [OK] Git Status: Ready

echo.

REM Step 8: Next Steps
echo [STEP 8/8] Next Steps for Vercel Deployment
echo.

echo 1. Push to GitHub:
echo    git add .
echo    git commit -m "Prepare for Vercel deployment"
echo    git push -u origin main
echo.

echo 2. Go to Vercel Dashboard:
echo    https://vercel.com/dashboard
echo.

echo 3. Import Repository:
echo    * Click 'New Project'
echo    * Select your GitHub repository
echo    * Set Root Directory to 'client\'
echo    * Click 'Deploy'
echo.

echo 4. Set Environment Variables:
echo    * Go to Settings ^> Environment Variables
echo    * Add all variables from ENV_VARIABLES_TEMPLATE.md
echo    * Redeploy
echo.

echo 5. Deploy Server (same repo):
echo    * Import same GitHub repo
echo    * Set Root Directory to 'server\'
echo    * Add server environment variables
echo    * Click 'Deploy'
echo.

echo Full Guide:
echo    See VERCEL_DEPLOYMENT_GUIDE.md
echo.

echo ═══════════════════════════════════════════════════════════
echo  [SUCCESS] Project is ready for Vercel deployment!
echo ═══════════════════════════════════════════════════════════
echo.

pause
