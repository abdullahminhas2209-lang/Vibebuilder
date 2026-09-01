@echo off
rem Starts the VibeBuilder production server on http://localhost:3000
rem (run "npm run build" first if you changed the code)
cd /d "%~dp0"
call npm run start
