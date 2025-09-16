const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files with appropriate cache headers
app.use(express.static(path.join(__dirname, 'docs'), {
  setHeaders: (res, filePath) => {
    // Cache hashed files (JS bundles) for 1 year since they have content hashes
    if (filePath.match(/\.[a-f0-9]{8,}\./)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache HTML files for a short time to allow for updates
    else if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=300');
    }
    // Default cache for other files
    else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
