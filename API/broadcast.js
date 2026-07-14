const data = require('../broadcast.json');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.json({ broadcast: data.active ? data : null });
};
