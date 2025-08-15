 
import express from 'express';
import path, { dirname } from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';


// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist folder (after build)
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint for Azure
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Bug Dashboard is running!',
        timestamp: new Date().toISOString(),
        port: port,
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes (for future backend functionality)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Bug Dashboard API is running!',
        timestamp: new Date().toISOString()
    });
});

// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});