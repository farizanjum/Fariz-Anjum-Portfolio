const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, title, description, pinned } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Screenshot ID is required' });
    }

    const dataFile = path.join(process.cwd(), 'data', 'screenshots.json');

    let screenshots = [];

    // Read existing data
    if (fs.existsSync(dataFile)) {
      try {
        screenshots = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      } catch (e) {
        return res.status(500).json({ error: 'Failed to read data file' });
      }
    }

    // Find and update the screenshot
    const index = screenshots.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }

    // Update fields
    if (title !== undefined) screenshots[index].title = title;
    if (description !== undefined) screenshots[index].description = description;
    if (pinned !== undefined) screenshots[index].pinned = pinned;

    // Write back to file
    fs.writeFileSync(dataFile, JSON.stringify(screenshots, null, 2));

    res.status(200).json({
      success: true,
      screenshot: screenshots[index],
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      error: 'Failed to update screenshot',
      details: error.message,
    });
  }
}
