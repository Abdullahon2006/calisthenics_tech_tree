// Sets (or changes) the login password. Stored as a salted scrypt hash in data/auth.json.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => { if (text.includes(question)) rl.output.write(text); };
    rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
  });
}

const first = await ask('New password (min 10 characters): ');
if (first.length < 10) { console.error('Too short. Nothing changed.'); process.exit(1); }
if (first !== await ask('Repeat password: ')) { console.error('Passwords differ. Nothing changed.'); process.exit(1); }

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(first, salt, 64);
fs.writeFileSync(path.join(DATA_DIR, 'auth.json'), JSON.stringify({ salt: salt.toString('hex'), hash: hash.toString('hex') }), { mode: 0o600 });
console.log('Password saved. Restart is not needed.');
