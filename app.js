const express = require('express');
const { validateToken } = require('./auth');

const app = express();

const PORT = process.env.PORT || 8000;

app.use((request, response, next) => {
  if (!validateToken()) return response.sendStatus(401);

  return next();
});

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.listen(PORT);
