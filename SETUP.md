# Setup

1. `pnpm install`
2. `pnpm set-password` (choose a password, min 10 characters; stored as a salted hash in `data/auth.json`)
3. `pnpm dev` (or `pnpm start` for the built version)
4. Open `https://localhost:3443`, or `https://<laptop-ip>:3443` from another device on your network.

On each device, the first visit shows a certificate warning (self-signed). Choose "proceed anyway" once.

## Where things live
- `data/techtree.json`: your logs and custom nodes (daily backups `data/techtree-backup-*.json`, last 7 kept)
- `data/auth.json`: password hash. `data/cert.json`: the self-signed certificate.
- The `data/` folder is git-ignored. Back it up yourself.

## Security notes
- Login is checked on the server; every data request needs the session cookie.
- 8 wrong passwords per 15 minutes per device, then locked out for the rest of the window.
- The server refuses requests from outside private/LAN addresses. Do not port-forward it on your router.
- Change the password in Settings > Security (other signed-in devices are signed out), or with `pnpm set-password` if you forget it.

## Pages
- `/` tree, `/roadmap`, `/settings` (theme, backup/restore, reset, password, sign out).
