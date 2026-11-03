import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || path.resolve('uploads');

function localPath(...segments) {
  const safe = segments.map((s) => s.replace(/[^a-zA-Z0-9_.-]/g, '_'));
  return path.join(UPLOAD_ROOT, ...safe);
}

export const storage = {
  async put(bucket, key, buffer, options = {}) {
    const filePath = localPath(bucket, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer, { mode: 0o640 });
    return `${env.NODE_ENV === 'production' ? process.env.PUBLIC_STORAGE_URL || '/storage' : '/uploads'}/${bucket}/${key}`;
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
