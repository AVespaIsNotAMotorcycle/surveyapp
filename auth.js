exports.validateCredentials = (username, password) => {
  if (username !== 'admin') return false;
  if (password !== 'admin') return false;
  return true;
};

exports.validateToken = () => {
  console.log('validateToken()');
  return true;
};
