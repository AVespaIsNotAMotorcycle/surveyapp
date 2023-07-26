const express = require('express');
const cors = require('cors');
const { validateToken } = require('./auth');

const { users } = require('./users');
const { tokens } = require('./tokens');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const PORT = process.env.PORT || 8000;

app.use(async (request, response, next) => {
  const token = request.headers.authorization;
  const tokenValid = await validateToken(token, request);
  if (!tokenValid) return response.sendStatus(401);

  return next();
});

async function handleRequest(request, response) {
  const { resource } = request.params;
  switch (resource) {
    case 'tokens': return tokens(request, response);
    case 'users': return users(request, response);
    default: return response.sendStatus(404);
  }
}
app.get('/:resource/:id?', handleRequest);
app.post('/:resource/:id?', handleRequest);
app.put('/:resource/:id?', handleRequest);
app.delete('/:resource/:id?', handleRequest);

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.listen(PORT);
