const mysql = require('mysql');

const errors = require('./errors');

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.JEST_WORKER_ID
    ? process.env.TEST_DATABASE_NAME
    : process.env.DATABASE_NAME,
});

const ensureUniqueFields = (
  options,
  table,
  data,
) => new Promise((resolve, reject) => {
  const uniqueFields = options ? options.uniqueFields : null;
  if (!uniqueFields) { resolve(true); return; }
  if (!Array.isArray) { resolve(true); return; }
  const queryPreface = `SELECT * FROM ${table}`;
  const values = uniqueFields.map((key) => data[key]);
  const conditions = uniqueFields
    .map((key) => `WHERE ${key} = ?`).join(' AND ');
  const query = `${queryPreface} ${conditions}`;
  connection.query(query, values, (error, results) => {
    if (error) return reject(error);
    if (results && results.length > 0) {
      return reject(Error(errors.rowAlreadyExists));
    }
    return resolve(true);
  });
});

exports.create = async (
  table,
  data,
  options = {},
) => {
  await ensureUniqueFields(options, table, data);

  return new Promise((resolve, reject) => {
    const createdAt = new Date();
    const row = { ...data, createdAt, updatedAt: createdAt };
    const query = `INSERT INTO ${table} SET ?`;
    connection.query(query, row, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

exports.read = (
  table,
  options = {},
) => new Promise((resolve, reject) => {
  const params = options.params || '';
  const query = `SELECT * FROM ${table} ${params}`;
  connection.query(query, (error, results) => {
    if (error) return reject(error);
    if (options.exactlyOne) {
      if (results.length !== 1) {
        reject(Error(`More than 1 result in ${table} ${params}`));
      }
      return resolve(results[0]);
    }
    return resolve(results);
  });
});
exports.update = () => {};
exports.delete = (
  table,
  options,
) => new Promise((resolve, reject) => {
  const params = options.params || '';
  const query = `DELETE FROM ${table} ${params}`;
  connection.query(query, (error, results) => {
    if (error) return reject(error);
    return resolve(results);
  });
});
