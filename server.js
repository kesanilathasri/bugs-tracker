 
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist folder (after build)
app.use(express.static(path.join(__dirname, 'dist')));

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`App accessible at: http://localhost:${PORT}`);
});