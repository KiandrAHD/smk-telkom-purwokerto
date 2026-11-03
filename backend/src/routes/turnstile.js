import express from 'express';
import { asyncHandler, badRequest } from '../utils/http.js';

export const turnstileRouter = express.Router();
const SECRET = process.env.CF_TURNSTILE_SECRET;
const ALLOWED_ORIGINS = (process.env.TURNSTILE_ALLOWED_ORIGINS || '').split(',').filter(Boolean);

turnstileRouter.post('/verify', asyncHandler(async (req, res) => {
  const token = String(req.body?.token || '');
  if (!token) throw badRequest('Token Turnstile diperlukan.');
  if (!SECRET) return res.json({ success: true, message: 'Turnstile belum dikonfigurasi; bypass untuk development.' });
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: SECRET, response: token, remoteip: req.ip }),
  });
  const result = await verify.json();
  if (!result.success) return res.status(400).json({ success: false, error: 'Verifikasi keamanan gagal.' });
  res.json({ success: true });
}));
