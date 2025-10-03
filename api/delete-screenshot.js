const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

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

    // Find the screenshot
    const index = screenshots.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }

    const screenshot = screenshots[index];

    // Delete from Cloudinary
    try {
      if (screenshot.cloudinary_id) {
        await cloudinary.uploader.destroy(screenshot.cloudinary_id);
      }
    } catch (cloudinaryError) {
      console.warn('Failed to delete from Cloudinary:', cloudinaryError);
      // Continue with local deletion even if Cloudinary fails
    }

    // Remove from array
    screenshots.splice(index, 1);

    // Write back to file
    fs.writeFileSync(dataFile, JSON.stringify(screenshots, null, 2));

    res.status(200).json({
      success: true,
      message: 'Screenshot deleted successfully',
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Failed to delete screenshot',
      details: error.message,
    });
  }
}
