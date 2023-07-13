function getUser(request, response) {
  const { id } = request.params;
  response.send(`id = ${id}`);
}

function postUser(request, response) { response.sendStatus(501); }
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
