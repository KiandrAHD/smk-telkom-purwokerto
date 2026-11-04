import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';

export const UPLOAD_ROOT = path.resolve(env.UPLOAD_ROOT || 'uploads');

const mediaBaseUrl = (env.MEDIA_BASE_URL || env.PUBLIC_STORAGE_URL || `http://localhost:${env.PORT}`).replace(/\/$/, '');

function safeSegment(segment) {
  return segment.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

// Key boleh bersarang ("berita/foto.webp"); setiap segmen dibersihkan agar
// tidak bisa keluar dari UPLOAD_ROOT (path traversal).
function localPath(bucket, key) {
  const parts = [bucket, ...String(key).split('/')].filter(Boolean).map(safeSegment);
  return path.join(UPLOAD_ROOT, ...parts);
}

export const storage = {
  async put(bucket, key, buffer) {
    const filePath = localPath(bucket, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer, { mode: 0o640 });
    return `${mediaBaseUrl}/uploads/${bucket}/${String(key).split('/').map(encodeURIComponent).join('/')}`;
  },
  async get(bucket, key) {
    return fs.readFile(localPath(bucket, key));
  },
  async delete(bucket, key) {
    try {
      await fs.unlink(localPath(bucket, key));
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  },
  async exists(bucket, key) {
    try {
      await fs.access(localPath(bucket, key));
      return true;
    } catch {
      return false;
    }
  },
};