const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const rssUrl = 'https://rss.beehiiv.com/feeds/DbPIw9AbTv.xml';

  try {
    console.log('Fetching RSS from:', rssUrl);

    const xml = await new Promise((resolve, reject) => {
      const request = https.get(rssUrl, (r) => {
        console.log('RSS response status:', r.statusCode);
        console.log('RSS response headers:', r.headers);

        if (r.statusCode !== 200) {
          reject(new Error('Upstream status ' + r.statusCode));
          return;
        }

        let data = '';
        r.setEncoding('utf8');
        r.on('data', (chunk) => {
          data += chunk;
        });
        r.on('end', () => {
          console.log('RSS data length:', data.length);
          resolve(data);
        });
      });

      request.on('error', (err) => {
        console.error('HTTPS request error:', err);
        reject(err);
      });

      request.setTimeout(10000, () => {
        console.error('RSS request timeout');
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.status(200).send(xml);
  } catch (err) {
    console.error('RSS fetch error:', err);
    res.status(502).json({
      error: 'Failed to fetch RSS',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};


