import assert from 'node:assert/strict';
import { isValidInstagramUrl } from '../src/utils/instagramUrl.js';

for (const url of [
  'https://instagram.com/p/ABC123/',
  'https://www.instagram.com/reel/ABC123/',
  'https://sub.instagram.com/p/ABC123?utm_source=school',
]) assert.equal(isValidInstagramUrl(url), true, url);

for (const url of [
  'http://instagram.com/p/ABC123/',
  'https://evilinstagram.com/p/ABC123/',
  'https://instagram.com.evil.test/p/ABC123/',
  'https://user:pass@instagram.com/p/ABC123/',
]) assert.equal(isValidInstagramUrl(url), false, url);

console.log('Prestasi Instagram URL regression passed.');
