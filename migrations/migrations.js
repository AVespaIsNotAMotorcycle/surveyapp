const { execSync } = require('child_process');

const migrations = [
  `
CREATE TABLE tokens (
  token CHAR(16) NOT NULL,
  userID INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (token)
);
  `,
  `
CREATE TABLE users (
  id INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
  `,
];

function constructCommand(username, password, database, migration) {
  return `mysql --user=${username} -p${password} ${database} -Bse "${migration}"`;
}

function runMigrations() {
  const username = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD;

  const mainDB = process.env.DATABASE_NAME;
  const testDB = process.env.TEST_DATABASE_NAME;

  for (let i = 0; i < migrations.length; i += 1) {
    console.log('========');
    const migration = migrations[i];
    try {
      execSync(constructCommand(
        username,
        password,
        mainDB,
        migration,
      ));
    } catch {}
    try {
      execSync(constructCommand(
        username,
        password,
        testDB,
        migration,
      ));
    } catch {}
  }
}

runMigrations();
