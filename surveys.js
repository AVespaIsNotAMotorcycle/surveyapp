const { read } = require('./mysql');

async function getSurvey(request, response) {
  try {
    const surveys = await read('surveys');
    return response.send(surveys);
  } catch (error) {
    console.error(error);
    response.statusMessage = error.message;
    return response.sendStatus(500);
  }
}
function postSurvey(request, response) { response.sendStatus(501); }
function putSurvey(request, response) { response.sendStatus(501); }
function deleteSurvey(request, response) { response.sendStatus(501); }

exports.surveys = (request, response) => {
  const { method } = request;
  switch (method) {
    case 'GET': return getSurvey(request, response);
    case 'POST': return postSurvey(request, response);
    case 'PUT': return putSurvey(request, response);
    case 'DELETE': return deleteSurvey(request, response);
    default: return response.sendStatus(405);
  }
};
