@echo off
cd /d "%~dp0backend"
where node >nul 2>nul
if errorlevel 1 goto bundled
node server.js
goto finished
:bundled
if not exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" goto missing
"%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
goto finished
:missing
echo Install Node.js 24 or newer, then run this file again.
:finished
pause
