const jwt = require('jsonwebtoken');
module.exports = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'stayfinder_secret_key', { expiresIn: '7d' });
