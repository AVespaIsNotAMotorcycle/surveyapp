const express = require('express');

const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.listen(PORT);
