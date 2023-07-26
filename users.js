const { hashPassword } = require('./auth');
const { tokens } = require('./tokens');
const { create } = require('./mysql');

function getUser(request, response) {
  const { id } = request.params;
  response.send(`id = ${id}`);
}

async function postUser(request, response) {
  const { username, password } = request.body;
  if (!username || !password) return response.sendStatus(400);
  try {
    const passwordHash = hashPassword(password, username);
    await create(
      'users',
      { username, passwordHash },
      { uniqueFields: ['username'] },
    );
    return tokens(
      {
        method: 'GET',
        query: { username, password },
      },
      response,
    );
  } catch ({ message }) {
    response.statusMessage = message;
    return response.sendStatus(500);
  }
}
function putUser(request, response) { response.sendStatus(501); }
function deleteUser(request, response) { response.sendStatus(501); }

exports.users = (request, response) => {
  const { method } = request;
  switch (method) {
    case 'GET': return getUser(request, response);
    case 'POST': return postUser(request, response);
    case 'PUT': return putUser(request, response);
    case 'DELETE': return deleteUser(request, response);
    default: return response.sendStatus(405);
  }
};
