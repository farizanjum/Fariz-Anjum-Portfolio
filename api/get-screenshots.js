const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    console.log('Fetching screenshots from Cloudinary...');

    // Get all resources from the portfolio-screenshots folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'portfolio-screenshots/',
      max_results: 100,
    });

    console.log('Found Cloudinary resources:', result.resources.length);

    // Convert Cloudinary resources to our screenshot format
    const screenshots = result.resources.map(resource => ({
      id: resource.public_id,
      title: resource.context?.custom?.title || 'Untitled',
      description: resource.context?.custom?.description || '',
      url: resource.secure_url,
      thumbnail: resource.secure_url.replace('/upload/', '/upload/w_400,h_300,c_fill/'),
      date: resource.created_at,
      cloudinary_id: resource.public_id,
      pinned: resource.context?.custom?.pinned === 'true' || false,
    }));

    // Sort screenshots: pinned first, then by date (newest first)
    screenshots.sort((a, b) => {
      // Pinned items first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Then by date
      return new Date(b.date) - new Date(a.date);
    });

    console.log('Returning screenshots:', screenshots.length);

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
