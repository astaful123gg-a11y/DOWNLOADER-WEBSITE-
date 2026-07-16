const config = require('../config');

function checkAuth(req) {
  const pwd = req.headers['x-admin-password'];
  return pwd === config.ADMIN_PASSWORD;
}

module.exports = { checkAuth };
