const data = require('../downloaders.json');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const active = (data.downloaders || []).filter(d => d.active !== false);
  res.json({ downloaders: active });
};
