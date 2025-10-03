const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const rssUrl = 'https://rss.beehiiv.com/feeds/DbPIw9AbTv.xml';

  try {
    const xml = await new Promise((resolve, reject) => {
      https
        .get(rssUrl, (r) => {
          if (r.statusCode !== 200) {
            reject(new Error('Upstream status ' + r.statusCode));
            return;
          }
          let data = '';
          r.on('data', (chunk) => (data += chunk));
          r.on('end', () => resolve(data));
        })
        .on('error', reject);
    });

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xml);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch RSS' });
  }
};


