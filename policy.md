# Server Deployment Policy & Multi-Repo Registry

- **Target Server**: vortex (`2.28.120.85`)
- **Operating System**: Ubuntu 24.04 LTS
- **Web Server**: Nginx (reverse proxy with priority symlinks)
- **Process Manager**: PM2 (systemd managed)
- **Last Updated**: 2026-09-22 (VPS-REG-56)

---

## 1. Multi-Repo Service Registry Table

| Domain / Service Name | Server Path | Repository URL | Upstream Ports | PM2 Process Names | SSL Provider / Status | Nginx Symlink Priority |
|---|---|---|---|---|---|---|
| `johnpaulescuadra.com`<br>`www.johnpaulescuadra.com` | `/var/www/jp_escuadra` | `https://github.com/Janpolescuadra25/John-Paul-Escuadra.git` | Frontend: `3000`<br>Backend: `3001` | `jp-frontend`<br>`jp-backend` | Let's Encrypt / Active | `001-johnpaulescuadra.com` |
| `vortexsdo.com`<br>`www.vortexsdo.com` | `/var/www/vortex_studios` | `https://github.com/Janpolescuadra25/Vortex.Studios.git` | Frontend: `3002`<br>Backend: `3003` | `vortex-frontend`<br>`vortex-backend` | Let's Encrypt / Active | `002-vortexsdo.com` |

---

## 2. Core Operational Policies

1. **Strict Domain & Port Isolation**:
   - Each project must operate on distinct upstream ports bound to loopback `127.0.0.1`.
   - Port allocations must never overlap. Portfolio holds `3000/3001`; Vortex holds `3002/3003`.
   - New repositories must be allocated ascending port pairs starting at `3004/3005`.

2. **Nginx Priority Symlinking**:
   - Primary portfolio routing maintains priority via `001-johnpaulescuadra.com`.
   - Subsequent virtual hosts use numbered prefixes (`002-vortexsdo.com`, `003-...`) to avoid wildcard/default-server takeover.

3. **Zero-Touch Portfolio Guarantee**:
   - Any deployment, maintenance, or configuration for secondary repositories must not modify `/var/www/jp_escuadra` or `/etc/nginx/sites-available/johnpaulescuadra.com`.
   - Verification via directory MD5 snapshot hashes before and after execution is mandatory.

4. **HTTPS Enforcement**:
   - All domains must enforce HTTP-to-HTTPS 301 redirection via dedicated port 80 server blocks.
   - SSL certificates are managed independently via Let's Encrypt (Certbot).
