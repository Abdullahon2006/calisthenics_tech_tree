// Personal server: HTTPS (self-signed), password login with session cookies,
// and a JSON file for data. `node server/index.mjs` = dev (Vite inside),
// `node server/index.mjs --prod` = serves the built app from dist/.
import https from 'node:https';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import express from 'express';
import rateLimit from 'express-rate-limit';
import selfsigned from 'selfsigned';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'techtree.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const CERT_FILE = path.join(DATA_DIR, 'cert.json');
const PORT = Number(process.env.PORT) || 3443;
const HOST = process.env.HOST || '0.0.0.0';
const PROD = process.argv.includes('--prod');
const COOKIE = 'tt_session';
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

fs.mkdirSync(DATA_DIR, { recursive: true });

const readJson = (file) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } };
const writeJsonAtomic = (file, value) => {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value), { mode: 0o600 });
  fs.renameSync(tmp, file);
};

// ---------- password + sessions ----------
function verifyPassword(password) {
  const auth = readJson(AUTH_FILE);
  if (!auth?.salt || !auth?.hash) return null; // null = not configured
  const expected = Buffer.from(auth.hash, 'hex');
  const actual = crypto.scryptSync(String(password), Buffer.from(auth.salt, 'hex'), expected.length);
  return crypto.timingSafeEqual(expected, actual);
}
const sessions = new Map();
const parseCookies = (header = '') => Object.fromEntries(header.split(';').map((p) => p.trim().split('=')).filter((p) => p[0]));
function hasSession(req) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  const expires = token && sessions.get(token);
  if (!expires) return false;
  if (expires < Date.now()) { sessions.delete(token); return false; }
  return true;
}
const requireAuth = (req, res, next) => (hasSession(req) ? next() : res.status(401).json({ error: 'Not signed in.' }));

// ---------- LAN-only guard ----------
function isPrivateIp(raw = '') {
  const ip = raw.replace(/^::ffff:/, '');
  if (ip === '::1' || ip === '127.0.0.1') return true;
  if (/^(10\.|192\.168\.|169\.254\.)/.test(ip)) return true;
  const m = ip.match(/^172\.(\d+)\./);
  if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) return true;
  if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip)) return true; // Tailscale / CGNAT
  return /^(fe80|fc|fd)/i.test(ip);
}

// ---------- self-signed certificate ----------
const lanIps = () => Object.values(os.networkInterfaces()).flat().filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
async function loadCert() {
  const ips = lanIps().sort();
  const saved = readJson(CERT_FILE);
  if (saved && saved.expires > Date.now() + 30 * 864e5 && JSON.stringify(saved.ips) === JSON.stringify(ips)) return saved;
  const altNames = [
    { type: 2, value: 'localhost' }, { type: 2, value: os.hostname() },
    { type: 7, ip: '127.0.0.1' }, ...ips.map((ip) => ({ type: 7, ip })),
  ];
  const pems = await selfsigned.generate([{ name: 'commonName', value: 'tech-tree.local' }], {
    days: 365, keySize: 2048, extensions: [{ name: 'subjectAltName', altNames }],
  });
  const cert = { key: pems.private, cert: pems.cert, ips, expires: Date.now() + 365 * 864e5 };
  fs.writeFileSync(CERT_FILE, JSON.stringify(cert), { mode: 0o600 });
  return cert;
}

// ---------- app ----------
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', false);
app.use((req, res, next) => {
  if (!isPrivateIp(req.socket.remoteAddress)) return res.status(403).send('Local network only.');
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer', 'Cache-Control': req.path.startsWith('/api') ? 'no-store' : 'no-cache' });
  next();
});
app.use('/api', express.json({ limit: '25mb' }));

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, skipSuccessfulRequests: true, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts. Wait 15 minutes and try again.' } });

app.get('/api/session', (req, res) => res.json({ authenticated: hasSession(req), configured: Boolean(readJson(AUTH_FILE)) }));

app.post('/api/login', loginLimiter, (req, res) => {
  const ok = verifyPassword(req.body?.password ?? '');
  if (ok === null) return res.status(503).json({ error: 'No password set yet. Run "pnpm set-password" on the laptop.' });
  if (!ok) return res.status(401).json({ error: 'Wrong password.' });
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + SESSION_MS);
  res.cookie(COOKIE, token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: SESSION_MS, path: '/' });
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (token) sessions.delete(token);
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

const passwordLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, skipSuccessfulRequests: true, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts. Wait 15 minutes and try again.' } });

app.post('/api/password', requireAuth, passwordLimiter, (req, res) => {
  const { current, next } = req.body ?? {};
  if (verifyPassword(current ?? '') !== true) return res.status(401).json({ error: 'Current password is wrong.' });
  if (typeof next !== 'string' || next.length < 10) return res.status(400).json({ error: 'New password must be at least 10 characters.' });
  const salt = crypto.randomBytes(16);
  writeJsonAtomic(AUTH_FILE, { salt: salt.toString('hex'), hash: crypto.scryptSync(next, salt, 64).toString('hex') });
  const keep = parseCookies(req.headers.cookie)[COOKIE];
  for (const token of [...sessions.keys()]) if (token !== keep) sessions.delete(token);
  res.json({ ok: true });
});

app.get('/api/data', requireAuth, (_req, res) => {
  const data = readJson(DATA_FILE);
  res.json({ exercises: data?.exercises ?? null, archived: data?.archived ?? [] });
});

function dailyBackup() {
  if (!fs.existsSync(DATA_FILE)) return;
  const stamp = new Date().toISOString().slice(0, 10);
  const target = path.join(DATA_DIR, `techtree-backup-${stamp}.json`);
  if (!fs.existsSync(target)) fs.copyFileSync(DATA_FILE, target);
  const backups = fs.readdirSync(DATA_DIR).filter((f) => f.startsWith('techtree-backup-')).sort();
  backups.slice(0, Math.max(0, backups.length - 7)).forEach((f) => fs.unlinkSync(path.join(DATA_DIR, f)));
}

app.put('/api/data', requireAuth, (req, res) => {
  const { exercises, archived } = req.body ?? {};
  if (!Array.isArray(exercises) || !Array.isArray(archived)) return res.status(400).json({ error: 'Invalid data.' });
  dailyBackup();
  writeJsonAtomic(DATA_FILE, { exercises, archived, savedAt: new Date().toISOString() });
  res.json({ ok: true });
});
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

const { key, cert } = await loadCert();
const server = https.createServer({ key, cert }, app);

if (PROD) {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) { console.error('No dist/ folder. Run "pnpm start" (it builds first).'); process.exit(1); }
  app.use(express.static(dist));
  app.use((_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  const { createServer: createVite } = await import('vite');
  const vite = await createVite({ root: ROOT, appType: 'spa', server: { middlewareMode: true, hmr: { server } } });
  app.use(vite.middlewares);
}

server.listen(PORT, HOST, () => {
  console.log(`\nTech Tree running (${PROD ? 'production' : 'dev'}):`);
  console.log(`  https://localhost:${PORT}`);
  lanIps().forEach((ip) => console.log(`  https://${ip}:${PORT}`));
  if (!readJson(AUTH_FILE)) console.log('\nNo password set yet. Run: pnpm set-password');
  console.log('First visit on each device: accept the certificate warning once.\n');
});
