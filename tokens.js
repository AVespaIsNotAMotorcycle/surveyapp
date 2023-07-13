const { validateCredentials } = require('./auth');

function getToken(request, response) {
  const { username, password } = request.query;
  if (!validateCredentials(username, password)) {
    return response.sendStatus(401);
  }
  return response.send('token');
}

exports.tokens = (request, response) => {
  const { method } = request;
  switch (method) {
    case 'GET': return getToken(request, response);
    default: return response.sendStatus(405);
  }
};
