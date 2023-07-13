const { read } = require('./mysql');

exports.validateCredentials = async (username, password) => {
  if (username !== 'admin') return false;
  if (password !== 'admin') return false;
  const { id } = await read(
    'users',
    {
      exactlyOne: true,
      params: `WHERE username="${username}"`,
    },
  );
  return id;
};

exports.validateToken = async (token, request) => {
  const { path } = request;
  if (path === '/tokens') return true;
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
