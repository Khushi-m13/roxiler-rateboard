@echo off
setlocal
cd /d "%~dp0.."

echo =============================================
echo RateBoard - Windows setup helper
echo =============================================
echo.

if not exist "backend\.env" (
  copy "backend\.env.example" "backend\.env" >nul
  echo Created backend\.env from backend\.env.example
  echo Please open backend\.env and enter your MySQL password.
) else (
  echo backend\.env already exists. Keeping it unchanged.
)

echo.
echo Installing backend packages...
call npm --prefix backend install
if errorlevel 1 goto :failed

echo.
echo Installing frontend packages...
call npm --prefix frontend install
if errorlevel 1 goto :failed

echo.
echo Setup complete.
echo Next:
echo   1. Run database\schema.sql in MySQL Workbench.
echo   2. Run: npm --prefix backend run db:seed
echo   3. Run: npm --prefix backend run dev
echo   4. In a second terminal run: npm --prefix frontend run dev
exit /b 0

:failed
echo.
echo Setup failed. Check the error above.
exit /b 1
