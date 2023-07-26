const crypto = require('crypto');

const { read } = require('./mysql');

exports.hashPassword = (password, salt) => crypto
  .createHash('sha256')
  .update(`${password}${salt}`)
  .digest('hex');

exports.validateCredentials = async (username, password) => {
  try {
    const { id } = await read(
      'users',
      {
        exactlyOne: true,
        params: `WHERE username="${username}"
          AND passwordHash="${exports.hashPassword(password, username)}"`,
      },
    );
    return id;
  } catch { return 0; }
};

exports.validateToken = async (token, request) => {
  const { path, method } = request;
  if (path === '/tokens' && method === 'GET') return true;
  if (path === '/users' && method === 'POST') return true;
  try {
    await read(
      'tokens',
      { exactlyOne: true, params: `WHERE token="${token}"` },
    );
    return true;
  } catch {
    return false;
  }
};
