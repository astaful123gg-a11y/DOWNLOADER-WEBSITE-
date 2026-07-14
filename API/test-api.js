const { checkAuth } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

  const { endpoint, method, headers, url_param, test_url } = req.body;
  try {
    let fetchUrl = endpoint;
    let opts = { method: method || 'GET', headers: headers || {} };
    if ((method || 'GET').toUpperCase() === 'GET') {
      const u = new URL(endpoint);
      u.searchParams.set(url_param || 'url', test_url);
      fetchUrl = u.toString();
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify({ [url_param || 'url']: test_url });
    }
    const r = await fetch(fetchUrl, opts);
    const data = await r.json();
    res.json({ success: true, sample: data });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
};
