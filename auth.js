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

exports.validateToken = () => {
  console.log('validateToken()');
  return true;
};
