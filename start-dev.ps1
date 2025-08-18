# Start Development Server for JSX Application
# This script sets up Node.js PATH and starts the Vite dev server

Write-Host "Setting up Node.js environment..." -ForegroundColor Green

# Add Node.js to PATH for this session
$env:PATH += ";C:\Program Files\nodejs"

# Verify Node.js and npm are available
Write-Host "Node.js version: " -NoNewline -ForegroundColor Cyan
node --version
Write-Host "npm version: " -NoNewline -ForegroundColor Cyan
npm --version

Write-Host "`nStarting development server..." -ForegroundColor Green
Write-Host "Your JSX application will be available at: http://localhost:5173/" -ForegroundColor Yellow

# Start the development server
npm run dev 