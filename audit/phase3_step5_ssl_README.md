# PHASE 3 STEP 5: SSL CERTIFICATE CONFIGURATION & ENFORCEMENT

- **Status**: COMPLETED (2026-09-21)
- **Target Server**: vortex (2.28.120.85)
- **Task ID**: VPS-REG-55
- **Domains Configured**: `vortexsdo.com`, `www.vortexsdo.com`

---

## 1. Overview & Architecture
Let's Encrypt SSL/TLS certificates were issued and configured via Certbot for Vortex Studios. HTTPS redirection is strictly enforced, and complete domain isolation is maintained relative to the existing portfolio deployment (`johnpaulescuadra.com`).

| Domain | Port | Symlink | SSL Provider | Redirect |
|---|---|---|---|---|
| `johnpaulescuadra.com` | 3000 / 3001 | `001-johnpaulescuadra.com` | Let's Encrypt | HTTP -> HTTPS (301) |
| `vortexsdo.com` | 3002 / 3003 | `002-vortexsdo.com` | Let's Encrypt | HTTP -> HTTPS (301) |

---

## 2. Certbot Execution Parameters
Certbot was executed with the Nginx plugin in non-interactive mode:

```bash
certbot --nginx -d vortexsdo.com -d www.vortexsdo.com --non-interactive --agree-tos -m vortex.studios.1999@gmail.com --redirect
```

Certificate paths on VPS:
- Certificate: `/etc/letsencrypt/live/vortexsdo.com/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/vortexsdo.com/privkey.pem`

---

## 3. Security Headers Maintained
The following HTTP security headers are enforced in `/etc/nginx/sites-available/vortexsdo.com`:
- `add_header X-Frame-Options "SAMEORIGIN" always;`
- `add_header X-XSS-Protection "1; mode=block" always;`
- `add_header X-Content-Type-Options "nosniff" always;`

---

## 4. Zero-Touch Portfolio Verification
The live portfolio filesystem `/var/www/jp_escuadra` was protected during execution:
- Pre-execution MD5 snapshot hash: `3037f813c43f5fec600030267a3e361a`
- Post-execution MD5 snapshot hash: `3037f813c43f5fec600030267a3e361a`
- Status: **100% UNTOUCHED**
- Live portfolio endpoint `https://johnpaulescuadra.com` returned **HTTP 200 OK**.

---

## 5. Verified Runtime Behavior
- `curl -sS -D - -o /dev/null -H 'Host: vortexsdo.com' http://127.0.0.1` returned **HTTP 301 Moved Permanently** with redirect to `https://vortexsdo.com/`.
- `curl -ksS -D - -o /dev/null https://vortexsdo.com` returned **HTTP 200 OK**.
- `curl -sS -D - -o /dev/null https://johnpaulescuadra.com` returned **HTTP 200 OK**.
