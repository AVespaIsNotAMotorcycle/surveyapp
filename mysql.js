const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

exports.create = () => {};
exports.read = (table) => new Promise((resolve, reject) => {
  const query = `SELECT * FROM ${table}`;
  connection.query(query, (error, results) => {
    if (error) reject(error);
    else resolve(results);
  });
});
exports.update = () => {};
exports.delete = () => {};
