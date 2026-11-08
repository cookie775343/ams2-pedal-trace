@echo off
echo Starting AMS2 Trace (Trace + Infill)...
for /f "tokens=5" %%p in ('netstat -ano ^| find "15608" ^| find "LISTENING"') do taskkill /F /pid %%p >nul 2>&1
ping -n 2 127.0.0.1 >nul 2>&1
start "AMS2 Relay" cmd /k "node "%~dp0..\ams2-relay.js""
echo Waiting for relay...
ping -n 6 127.0.0.1 >nul 2>&1
netstat -ano | find "15608" | find "LISTENING" >nul 2>&1
if errorlevel 1 (echo Relay did not start. pause & exit /b 1)
start "" chrome --app="http://localhost:15608/?mode=5"
