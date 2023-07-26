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
  `
ALTER TABLE users ADD COLUMN passwordHash VARCHAR(255) NOT NULL;
  `,
  `
CREATE TABLE surveys (
  id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  questions JSON NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
  `,
  `ALTER TABLE users MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT;`,
  `ALTER TABLE surveys MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT;`,
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
