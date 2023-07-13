const express = require('express');
const { validateToken } = require('./auth');
const { users } = require('./users');

const app = express();

const PORT = process.env.PORT || 8000;

app.use((request, response, next) => {
  if (!validateToken()) return response.sendStatus(401);

  return next();
});

app.get('/:resource/:id?', (request, response) => {
  const { resource } = request.params;
  switch (resource) {
    case 'users': return users(request, response);
    default: return response.sendStatus(404);
  }
});

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.listen(PORT);
