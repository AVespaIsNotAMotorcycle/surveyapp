const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

exports.create = (
  table,
  data,
) => new Promise((resolve, reject) => {
  const createdAt = new Date();
  const row = { ...data, createdAt, updatedAt: createdAt };
  const query = `INSERT INTO ${table} SET ?`;
  connection.query(query, row, (error, results) => {
    if (error) reject(error);
    else resolve(results);
  });
});

exports.read = (
  table,
  options,
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
exports.delete = () => {};
