const path = require('node:path');
const readline = require('node:readline');
const { stdin, stdout } = require('node:process');
const bcrypt = require('bcrypt');
const { openDatabase } = require('../src/db');

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const username = (await ask(rl, 'Gebruikersnaam (3-50 tekens): ')).trim();
    stdout.write('Wachtwoord (minimaal 8 tekens, invoer blijft verborgen): ');
    const originalWrite = rl._writeToOutput.bind(rl);
    rl._writeToOutput = function writeHidden(stringToWrite) {
      if (!this.passwordInput) originalWrite(stringToWrite);
    };
    rl.passwordInput = true;
    const password = await ask(rl, '');
    rl.passwordInput = false;
    stdout.write('\n');
    if (!/^[a-zA-Z0-9._-]{3,50}$/.test(username)) throw new Error('Ongeldige gebruikersnaam. Gebruik letters, cijfers, punt, streepje of underscore.');
    if (password.length < 8 || password.length > 200) throw new Error('Het wachtwoord moet 8 tot en met 200 tekens bevatten.');

    const databasePath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'voorraad.db');
    const db = openDatabase(databasePath);
    try {
      const passwordHash = await bcrypt.hash(password, 12);
      db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash);
      console.log(`Medewerker '${username}' is aangemaakt.`);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') throw new Error('Deze gebruikersnaam bestaat al.');
      throw error;
    } finally {
      db.close();
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
