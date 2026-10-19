# Architecture

React + Vite frontend, served by a small Express server (`server/index.mjs`) over HTTPS with a self-signed certificate.

- **Data:** the browser loads and saves the whole tree through `GET/PUT /api/data`; the server writes `data/techtree.json` atomically and keeps 7 daily backups.
- **Auth:** `POST /api/login` checks a scrypt-hashed password, then sets an httpOnly, Secure, SameSite=Strict session cookie. All `/api/data` routes require it. Login attempts are rate limited.
- **Network:** requests from non-private IP addresses are rejected.
- **Dev vs prod:** `pnpm dev` runs Vite inside the server; `pnpm start` builds and serves `dist/`.
- **No locking:** every node can be logged at any time. Prerequisites only draw the connecting lines.
- Imported and saved JSON is normalised before it reaches the UI (`src/utils/storage.ts`).
