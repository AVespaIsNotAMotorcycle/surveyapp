/* eslint no-undef: off */

const { tokens } = require('./tokens');
const { validateToken } = require('./auth');
const mysql = require('./mysql');

jest.mock('./auth', () => ({
  ...jest.requireActual('./auth'),
  validateCredentials: jest.fn(() => 1),
}));

describe('can create and delete tokens', () => {
  let token;
  it('create token', async () => {
    const getToken = () => new Promise((resolve) => {
      const request = {
        method: 'GET',
        query: {
          username: 'test',
          password: 'test',
        },
      };
      const response = {
        sendStatus: (code) => { resolve(code); },
        send: (newToken) => { resolve(newToken); },
      };
      tokens(request, response);
    });
    const { token: newToken } = await getToken();
    token = newToken;
    expect(typeof token).toBe('string');
    expect(token.length).toBe(16);
  });
  it('check that token was created', async () => {
    const request = { path: '' };
    const tokenExists = await validateToken(token, request);
    expect(tokenExists).toBeTruthy();
  });
  it('cleanup', async () => {
    await mysql.delete(
      'tokens',
      { params: `WHERE token="${token}"` },
    );
    const request = { path: '' };
    const tokenExists = await validateToken(token, request);
    expect(tokenExists).toBeFalsy();
  });
});
