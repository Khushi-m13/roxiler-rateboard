@echo off
cd /d "%~dp0.."
call npm --prefix backend run dev
pause
