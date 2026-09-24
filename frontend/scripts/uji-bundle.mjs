import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const entry = html.match(/<script[^>]+src="\/assets\/([^"]+\.js)"/)?.[1];
assert.ok(entry, 'Berkas JavaScript utama tidak ditemukan');

const bytes = statSync(join(dist, 'assets', entry)).size;
const chunks = readdirSync(join(dist, 'assets')).filter((name) => name.endsWith('.js'));
assert.ok(chunks.length > 1, 'Halaman belum dipisah menjadi beberapa chunk');
assert.ok(bytes < 650_000, `Bundle utama masih ${bytes} byte`);
console.log(`Bundle utama ${bytes} byte dalam ${chunks.length} chunk JavaScript`);
