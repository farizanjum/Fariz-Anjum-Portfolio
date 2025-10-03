const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dataFile = path.join(process.cwd(), 'data', 'screenshots.json');

    let screenshots = [];

    // Check if data file exists
    if (fs.existsSync(dataFile)) {
      try {
        screenshots = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      } catch (e) {
        console.error('Error reading screenshots data:', e);
        screenshots = [];
      }
    }

    // Sort screenshots: pinned first, then by date (newest first)
    screenshots.sort((a, b) => {
      // Pinned items first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Then by date
      return new Date(b.date) - new Date(a.date);
    });

    res.status(200).json({
      success: true,
      screenshots,
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch screenshots',
      details: error.message,
    });
  }
}
