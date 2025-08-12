@echo off
echo Setting up Node.js environment...

REM Add Node.js to PATH for this session
set PATH=%PATH%;C:\Program Files\nodejs

echo.
echo Node.js version:
node --version
echo npm version:
npm --version

echo.
echo Starting development server...
echo Your JSX application will be available at: http://localhost:5173/
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev

pause 