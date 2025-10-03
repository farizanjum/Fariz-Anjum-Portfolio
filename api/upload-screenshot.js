const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (using environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Upload request received');
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
    });

    const { image, title, description } = req.body;

    if (!image) {
      console.log('No image provided in request');
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('Image data length:', image.length);
    console.log('Image starts with:', image.substring(0, 50));

    // Upload to Cloudinary
    console.log('Attempting Cloudinary upload...');
    const result = await cloudinary.uploader.upload(image, {
      folder: 'portfolio-screenshots',
      public_id: `screenshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      resource_type: 'image',
      // Allow data URLs and handle different formats
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      // Optimize for web
      quality: 'auto',
      format: 'auto',
    });
    console.log('Cloudinary upload successful:', result.public_id);

    // Store metadata (you could use a database here, but for now we'll use a simple approach)
    const screenshotData = {
      id: result.public_id,
      title: title || 'Untitled',
      description: description || '',
      url: result.secure_url,
      thumbnail: result.secure_url.replace('/upload/', '/upload/w_400,h_300,c_fill/'),
      date: new Date().toISOString(),
      cloudinary_id: result.public_id,
    };

    // For now, we'll store metadata in a simple JSON file approach
    // In production, you'd want to use a proper database
    const fs = require('fs');
    const path = require('path');

    const dataFile = path.join(process.cwd(), 'data', 'screenshots.json');

    // Ensure data directory exists
    if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
      fs.mkdirSync(path.join(process.cwd(), 'data'));
    }

    // Read existing data
    let screenshots = [];
    if (fs.existsSync(dataFile)) {
      try {
        screenshots = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      } catch (e) {
        // If file is corrupted, start fresh
        screenshots = [];
      }
    }

    // Add new screenshot
    screenshots.push(screenshotData);

    // Write back to file
    fs.writeFileSync(dataFile, JSON.stringify(screenshots, null, 2));

    res.status(200).json({
      success: true,
      screenshot: screenshotData,
    });

  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to upload image',
      details: error.message,
      code: error.http_code,
      type: error.name,
    });
  }
}
