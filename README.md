# Apeiron Tech Tree

Private, local-first calisthenics progression tracker. It runs a React/Vite
client behind a small Express server with password-protected sessions and
local JSON persistence.

## Quick start

```bash
pnpm install
pnpm set-password
pnpm dev
```

Open `https://localhost:3443`. The local HTTPS certificate is self-signed, so
your browser will ask you to trust it on first visit.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the local HTTPS server with the Vite client. |
| `pnpm build` | Create a production client build. |
| `pnpm start` | Build, then run the production server. |
| `pnpm set-password` | Set or replace the local password. |

## Local data and safety

All user-specific files are stored in `data/` and intentionally excluded from
Git:

- `auth.json` contains a salted password hash.
- `cert.json` contains the private key for the local HTTPS certificate.
- `techtree.json` contains workout data, custom nodes, and archived nodes.

Back up `data/` separately. Do not commit it or port-forward this app to the
public internet.

See [SETUP.md](SETUP.md) for operational notes and [ARCHITECTURE.md](ARCHITECTURE.md)
for failure-handling details.
