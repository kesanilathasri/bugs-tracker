const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;
const dist = path.join(__dirname, 'dist');

app.use(express.static(dist));

// For SPA: serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});