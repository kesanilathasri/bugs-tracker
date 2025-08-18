# PowerShell script to set up Node.js PATH
# Run this each time you open a new PowerShell session

$env:PATH += ";C:\Program Files\nodejs"

Write-Host "Node.js and npm are now available in this session!" -ForegroundColor Green
Write-Host "Node.js version: " -NoNewline
node --version
Write-Host "npm version: " -NoNewline  
npm --version

# Navigate to your project
cd bug-dashboard-app

Write-Host "`nYou can now run:" -ForegroundColor Yellow
Write-Host "  npm run dev    - Start development server" -ForegroundColor Cyan
Write-Host "  npm run build  - Build for production" -ForegroundColor Cyan
Write-Host "  npm install    - Install dependencies" -ForegroundColor Cyan 