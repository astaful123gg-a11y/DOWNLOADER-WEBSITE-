const data = require('../downloaders.json');

function getField(obj, path) {
  if (!path) return null;
  return path.split('.').reduce((o, k) => (o == null ? null : o[k]), obj);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { url: targetUrl } = req.body;
  if (!targetUrl) return res.status(400).json({ error: 'Missing url' });

  const downloaders = (data.downloaders || []).filter(d => d.active !== false);
  const match = downloaders.find(d => {
    try { return new RegExp(d.url_pattern, 'i').test(targetUrl); }
    catch { return false; }
  });
  if (!match) return res.status(400).json({ error: 'Platform not supported' });

  try {
    let fetchUrl = match.api_endpoint;
    let opts = { method: match.api_method || 'GET', headers: match.api_headers || {} };
    if ((match.api_method || 'GET').toUpperCase() === 'GET') {
      const u = new URL(match.api_endpoint);
      u.searchParams.set(match.api_url_param || 'url', targetUrl);
      fetchUrl = u.toString();
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify({ [match.api_url_param || 'url']: targetUrl });
    }
    const r = await fetch(fetchUrl, opts);
    const respData = await r.json();

    res.json({
      platform: match.name,
      downloadUrl: getField(respData, match.link_field),
      title: getField(respData, match.title_field),
      thumbnail: getField(respData, match.thumb_field),
      fileName: `${match.name}_${Date.now()}.mp4`,
    });
  } catch (e) {
    res.status(500).json({ error: 'Fetch failed: ' + e.message });
  }
};
