@echo off
:menu
cls
echo.
echo  ===================================
echo     AMS2 Trace Launcher
echo  ===================================
echo.
echo  [1] Full (Trace + Stats + Controls)  800x300
echo  [2] No Stats (Trace + Controls)     800x240
echo  [3] Trace Only                      800x180
echo  [4] Stats + Trace                   800x200
echo  [5] Trace + Infill                  800x180
echo  [6] Stats + Trace + Infill          800x200
echo.
echo  Press 1-6 to choose, or Q to quit
echo.
set /p choice=Select:
if /i "%choice%"=="1" goto start1
if /i "%choice%"=="2" goto start2
if /i "%choice%"=="3" goto start3
if /i "%choice%"=="4" goto start4
if /i "%choice%"=="5" goto start5
if /i "%choice%"=="6" goto start6
if /i "%choice%"=="Q" exit /b
cls
echo Invalid choice.
ping -n 2 127.0.0.1 >nul 2>&1
goto menu

:start1
echo Launching Full...
goto launch

:start2
echo Launching No Stats...
goto launch

:start3
echo Launching Trace Only...
goto launch

:start4
echo Launching Stats + Trace...
goto launch

:start5
echo Launching Trace + Infill...
goto launch

:start6
echo Launching Stats + Trace + Infill...
goto launch

:launch
set mode=%choice%
for /f "tokens=5" %%p in ('netstat -ano ^| find "15608" ^| find "LISTENING"') do taskkill /F /pid %%p >nul 2>&1
ping -n 2 127.0.0.1 >nul 2>&1
start "AMS2 Relay" cmd /k "node "%~dp0ams2-relay.js""
echo Waiting for relay...
ping -n 6 127.0.0.1 >nul 2>&1
netstat -ano | find "15608" | find "LISTENING" >nul 2>&1
if errorlevel 1 (echo Relay did not start. pause & exit /b 1)
start "" chrome --app="http://localhost:15608/?mode=%mode%"
