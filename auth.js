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
  console.log(`validateToken(${username}) => ${id}`);
  return id;
};

exports.validateToken = async (token) => {
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
