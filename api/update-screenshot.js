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

    console.log('Updating screenshot metadata in Cloudinary:', id);

    // First, get the current resource to preserve existing context
    const currentResource = await cloudinary.api.resource(id, {
      context: true,
    });

    console.log('Current context:', currentResource.context);

    // Build merged context object
    const currentContext = currentResource.context || {};
    const contextUpdates = {
      ...currentContext,
    };

    if (title !== undefined) contextUpdates.title = title;
    if (description !== undefined) contextUpdates.description = description;
    if (pinned !== undefined) contextUpdates.pinned = pinned.toString();

    console.log('New context:', contextUpdates);

    // Update the resource context in Cloudinary using explicit method
    await cloudinary.uploader.explicit(id, {
      type: 'upload',
      context: contextUpdates,
    });

    console.log('Screenshot metadata updated successfully');

    res.status(200).json({
      success: true,
      screenshot: {
        id,
        title,
        description,
        pinned,
      },
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      error: 'Failed to update screenshot',
      details: error.message,
    });
  }
}
