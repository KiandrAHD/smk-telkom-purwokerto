import express from 'express';
import rateLimit from 'express-rate-limit';
import { loginSchema, registerSchema } from '../validators/auth.js';
import { asyncHandler } from '../utils/http.js';
import { login, logout, publicUser, register } from '../services/authService.js';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../db.js';
import argon2 from 'argon2';
import { hashToken, randomToken } from '../utils/crypto.js';
import { sendResetEmail } from '../services/emailService.js';

export const authRouter = express.Router();
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
const cookieOptions = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' };

authRouter.post('/register', loginLimit, asyncHandler(async (req, res) => {
  const user = await register(registerSchema.parse(req.body));
  res.status(201).json({ user: publicUser(user), message: 'Registrasi berhasil. Verifikasi email diperlukan.' });
}));

authRouter.post('/login', loginLimit, asyncHandler(async (req, res) => {
  const result = await login(loginSchema.parse(req.body));
  res.cookie('session_token', result.token, { ...cookieOptions, expires: result.expiresAt });
  res.json({ user: publicUser(result.user), expiresAt: result.expiresAt });
}));

authRouter.post('/logout', requireAuth, asyncHandler(async (req, res) => {
  await logout(req.cookies.session_token);
  res.clearCookie('session_token', cookieOptions);
  res.status(204).end();
}));

authRouter.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

authRouter.post('/verify-email', asyncHandler(async (req, res) => {
  const token = String(req.body?.token || '');
  const record = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.purpose !== 'verify_email' || record.expiresAt < new Date()) return res.status(400).json({ error: 'Token verifikasi tidak valid atau kedaluwarsa.' });
  await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }), prisma.authToken.delete({ where: { id: record.id } })]);
  res.json({ message: 'Email berhasil diverifikasi.' });
}));

authRouter.post('/password-reset/request', loginLimit, asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) { const token = randomToken(); await prisma.authToken.create({ data: { userId: user.id, tokenHash: hashToken(token), purpose: 'password_reset', expiresAt: new Date(Date.now() + 60 * 60 * 1000) } }); await sendResetEmail(user, token); }
  res.json({ message: 'Jika email terdaftar, instruksi reset telah dikirim.' });
}));

authRouter.post('/password-reset/confirm', asyncHandler(async (req, res) => {
  const token = String(req.body?.token || '');
  const password = String(req.body?.password || '');
  if (password.length < 8) return res.status(400).json({ error: 'Password minimal 8 karakter.' });
  const record = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.purpose !== 'password_reset' || record.expiresAt < new Date()) return res.status(400).json({ error: 'Token reset tidak valid atau kedaluwarsa.' });
  await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { passwordHash: await argon2.hash(password, { type: argon2.argon2id }) } }), prisma.authToken.delete({ where: { id: record.id } }), prisma.session.deleteMany({ where: { userId: record.userId } })]);
  res.json({ message: 'Password berhasil diubah.' });
}));
