 # Azure App Service Deployment Guide

## Prerequisites
- Azure App Service (Windows or Linux)
- Git repository connected to Azure

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)
1. Connect your Git repository to Azure App Service
2. Push your code changes
3. Azure will automatically build and deploy

### Option 2: Manual Deployment
1. Run locally: `npm run build`
2. Upload contents of `dist/` folder to Azure App Service root
3. Upload `web.config` to Azure App Service root

## Configuration Files
- `web.config` - Configures IIS to serve static files and handle React routing
- `.deployment` - Tells Azure to only build, not start a server

## Important Notes
- This is a **frontend-only** application using Local Storage
- No backend server is needed
- All data is stored in the user's browser
- The app will work offline once loaded

## Troubleshooting
- If you see "Container didn't respond" errors, ensure you're not trying to run a Node.js server
- Make sure `web.config` is in the root directory of your Azure App Service
- Verify that `dist/` folder contains your built React application