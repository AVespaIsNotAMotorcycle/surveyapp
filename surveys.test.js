/* eslint no-undef: off */

const { surveys } = require('./surveys');
const { validateToken } = require('./auth');
const mysql = require('./mysql');

jest.mock('./auth', () => ({
  ...jest.requireActual('./auth'),
  validateToken: jest.fn(() => 1),
}));

describe('can create and delete surveys', () => {
  let survey;
  it('create survey', async () => {
    const testQuestions = '{ "testID": { "name": "Test Name" } }';
    const postSurvey = () => new Promise((resolve) => {
      const request = {
        method: 'POST',
        body: {
          name: 'test',
          questions: testQuestions,
        },
        headers: { authorization: '1' },
      };
      const response = {
        sendStatus: (code) => { resolve(code); },
        send: (newToken) => { resolve(newToken); },
      };
      surveys(request, response);
    });
    const newSurvey = await postSurvey();
    survey = newSurvey;
    expect(typeof survey).toBe('object');
    expect(survey.affectedRows).toBe(1);
    expect(survey.insertId).toBeTruthy();
  });
  /*
  it('check that survey was created', async () => {
    const request = { path: '' };
    const tokenExists = await validateToken(token, request);
    expect(tokenExists).toBeTruthy();
  });
  */
  it('cleanup', async () => {
    await mysql.delete(
      'surveys',
      { params: `WHERE id=${survey.insertId}` },
    );
    const request = { path: '' };
    const surveyExists = await mysql.read('surveys');
    expect(surveyExists).toStrictEqual([]);
  });
});
