@echo off
echo Starting Omni Gym Chat Automation System...
echo.

echo 1. Starting backend server...
start "Backend Server" cmd /k "node openaitomanychat.js"

echo.
echo 2. Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo 3. Starting localtunnel to expose server to internet...
start "Localtunnel" cmd /k "npx localtunnel --port 3000"

echo.
echo System startup complete!
echo.
echo Your server will be available at http://localhost:3000
echo The public URL will appear in the localtunnel window
echo.
echo Keep both windows running for the system to work properly.
echo.
pause