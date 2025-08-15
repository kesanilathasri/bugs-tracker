 #!/bin/bash

# Azure App Service Deployment Script
echo "Starting Azure deployment..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Create deployment directory
echo "Preparing deployment files..."
mkdir -p azure-deploy
cp -r dist/* azure-deploy/
cp web.config azure-deploy/

echo "Deployment files ready in azure-deploy/ folder"
echo "Upload these files to your Azure App Service root directory"