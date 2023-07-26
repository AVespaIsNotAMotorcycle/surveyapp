const { validateCredentials } = require('./auth');
const { create } = require('./mysql');

async function getToken(request, response) {
  const { username, password } = request.query;
  const userID = await validateCredentials(username, password);
  if (!userID) return response.sendStatus(401);
  const token = String(Date.now()).padStart(16, '0');
  await create('tokens', { token, userID });
  return response.send({ token });
}

exports.tokens = (request, response) => {
  const { method } = request;
  switch (method) {
    case 'GET': return getToken(request, response);
    default: return response.sendStatus(405);
  }
};
