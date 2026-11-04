#!/usr/bin/env node
import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.env.BACKUP_DIR || 'backups');
const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY || '', 'base64');
if (key.length !== 32) throw new Error('BACKUP_ENCRYPTION_KEY harus base64 dari 32 byte (AES-256).');
const manifestArg = process.argv[2];
const manifests = manifestArg ? [path.resolve(manifestArg)] : (await fs.readdir(path.join(root, 'manifests'))).filter((f) => f.endsWith('.json')).sort().slice(-1).map((f) => path.join(root, 'manifests', f));
if (!manifests.length) throw new Error('Manifest backup tidak ditemukan.');
const manifest = JSON.parse(await fs.readFile(manifests[0], 'utf8'));
for (const object of Object.values(manifest.objects || {})) {
  const file = path.join(root, object.key);
  const data = await fs.readFile(file);
  const digest = crypto.createHash('sha256').update(data).digest('hex');
  if (data.length !== object.size || digest !== object.sha256) throw new Error(`Checksum tidak cocok: ${object.key}`);
  if (data.subarray(0, 8).toString() !== 'SMKBACK1') throw new Error(`Header enkripsi tidak valid: ${object.key}`);
}
console.log(JSON.stringify({ event: 'backup_verify_complete', manifest: path.relative(root, manifests[0]), objects: Object.keys(manifest.objects || {}) }));
