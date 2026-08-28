@echo off
cd /d "%~dp0.."
call npm --prefix frontend run dev
pause
