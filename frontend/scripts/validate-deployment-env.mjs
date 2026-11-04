import { existsSync } from 'node:fs';

const isVercel = Boolean(process.env.VERCEL);
const isProductionBuild = isVercel || process.env.NODE_ENV === 'production';
const apiBaseUrl = process.env.VITE_API_BASE_URL?.trim();
const siteUrl = process.env.VITE_SITE_URL?.trim();
const errors = [];

const validHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

if (!isProductionBuild) process.exit(0);
if (!apiBaseUrl) errors.push('VITE_API_BASE_URL is required for production/Vercel builds.');
else if (!validHttpUrl(apiBaseUrl)) errors.push('VITE_API_BASE_URL must be an absolute http(s) URL.');
else if (/^https?:\/\/(localhost|127\.0\.0\.1|::1)(?::|\/|$)/i.test(apiBaseUrl)) errors.push('VITE_API_BASE_URL must not point to localhost in production.');

if (siteUrl && !validHttpUrl(siteUrl)) errors.push('VITE_SITE_URL must be an absolute http(s) URL when provided.');
if (existsSync('.env')) console.warn('Deployment env validation: local .env is ignored; Vercel Project Environment Variables are used.');

if (errors.length) {
  console.error(`Deployment environment validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Deployment environment validated for ${isVercel ? 'Vercel' : 'production'} build.`);
