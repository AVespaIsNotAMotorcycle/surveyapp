const express = require('express');
const { validateToken } = require('./auth');

const { users } = require('./users');
const { tokens } = require('./tokens');

const app = express();

const PORT = process.env.PORT || 8000;

app.use(async (request, response, next) => {
  const token = request.headers.authorization;
  const tokenValid = await validateToken(token, request);
  if (!tokenValid) return response.sendStatus(401);

  return next();
});

app.get('/:resource/:id?', (request, response) => {
  const { resource } = request.params;
  switch (resource) {
    case 'tokens': return tokens(request, response);
    case 'users': return users(request, response);
    default: return response.sendStatus(404);
  }
});

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.listen(PORT);
