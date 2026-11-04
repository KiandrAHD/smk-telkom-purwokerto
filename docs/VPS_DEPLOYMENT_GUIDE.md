# VPS Deployment Guide

Panduan deployment backend Express + Prisma + MySQL ke VPS sekolah.

## Prasyarat

- VPS Linux dengan akses root/sudo.
- Node.js 22 LTS.
- MySQL 8.x.
- Domain dan DNS mengarah ke VPS.
- TLS certificate (Let's Encrypt / Certbot).
- Reverse proxy (Nginx/Caddy).
- Process manager (PM2 atau systemd).

## 1. Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE smk_telkom_purwokerto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'smk_app'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON smk_telkom_purwokerto.* TO 'smk_app'@'localhost';
FLUSH PRIVILEGES;
```

## 2. Code

```bash
git clone https://github.com/flexbox-studiocode/smk-telkom-purwokerto.git
cd smk-telkom-purwokerto/backend
npm ci
npx prisma generate
npx prisma migrate deploy
```

## 3. Environment

Salin `.env.example` ke `.env` dan isi production credentials. Gunakan secret manager atau file dengan permission `0600`.

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://smk_app:STRONG_PASSWORD@127.0.0.1:3306/smk_telkom_purwokerto
FRONTEND_URL=https://smk-telkom-purwokerto.sch.id
SESSION_SECRET=generate-64-char-random-secret
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=no-reply@smktelkom-pwt.sch.id
PUBLIC_URL=https://smk-telkom-purwokerto.sch.id
CF_TURNSTILE_SECRET=...
UPLOAD_ROOT=/var/smk/uploads
PUBLIC_STORAGE_URL=https://storage.smktelkom-pwt.sch.id
STELA_AKTIF=true
STELA_API_KEY=...
```

Jangan hardcode credential. Jangan commit `.env`.

## 4. Process manager

PM2:

```bash
npm i -g pm2
pm2 start src/server.js --name smk-backend
pm2 save
pm2 startup
```

Systemd alternative: unit file `/etc/systemd/system/smk-backend.service`.

## 5. Reverse proxy (Nginx + TLS)

```nginx
server {
    listen 443 ssl http2;
    server_name api.smktelkom-pwt.sch.id;
    ssl_certificate /etc/letsencrypt/live/api.smktelkom-pwt.sch.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.smktelkom-pwt.sch.id/privkey.pem;

    client_max_body_size 12m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Certbot:

```bash
sudo certbot --nginx -d api.smktelkom-pwt.sch.id
```

## 6. Storage

Upload backend menggunakan filesystem lokal (`UPLOAD_ROOT`). Untuk production:

- Mount volume persistent untuk `UPLOAD_ROOT`.
- Atau migrasi ke object storage (S3-compatible) dan set `PUBLIC_STORAGE_URL`.
- Dokumen PPDB harus tetap private; hanya owner/admin yang berwenang (sudah dienforce oleh route `/api/uploads/ppdb-documents/:userId`).

## 7. Frontend (Vercel)

Frontend di-deploy terpisah di Vercel. Set `VITE_API_BASE_URL` ke `https://api.smktelkom-pwt.sch.id`. Lihat `docs/VERCEL_DEPLOYMENT_REPORT.md`.

## 8. Backup

- MySQL: `mysqldump` harian via cron.
- Uploads: rsync ke backup storage.
- Test restore secara berkala.

## 9. Monitoring

- PM2 monitoring / `pm2 monit`.
- Log rotation.
- Health check: `GET /health` harus return `ok: true, database: "up"`.

## Status

- Backend: siap untuk VPS deployment setelah credentials production tersedia.
- Vercel frontend: memerlukan `VITE_API_BASE_URL` production.
- Object storage production: blocker.
