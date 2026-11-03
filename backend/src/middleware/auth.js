import { prisma } from '../db.js';
import { unauthorized, forbidden } from '../utils/http.js';
import { hashToken } from '../utils/crypto.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.session_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next(unauthorized('Login diperlukan.'));
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return next(unauthorized('Sesi tidak valid atau sudah berakhir.'));
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { admin: true },
  });
  if (!user) return next(unauthorized());
  req.user = user;
  req.isAdmin = Boolean(user.admin);
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.isAdmin) return next(forbidden('Halaman admin.'));
  next();
}

export async function optionalAuth(req, _res, next) {
  const token = req.cookies?.session_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next();
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) } });
  if (session && session.expiresAt >= new Date()) {
    const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { admin: true } });
    if (user) { req.user = user; req.isAdmin = Boolean(user.admin); }
  }
  next();
}
