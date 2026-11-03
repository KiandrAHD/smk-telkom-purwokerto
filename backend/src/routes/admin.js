import express from 'express';
import { prisma } from '../db.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { asyncHandler, parsePagination } from '../utils/http.js';

export const adminRouter = express.Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/dashboard', asyncHandler(async (_req, res) => {
  const [berita, pengumuman, prestasi, bkk, ppdb, recentPpdb] = await prisma.$transaction([
    prisma.berita.count(), prisma.pengumuman.count(), prisma.prestasi.count(), prisma.bkk.count(), prisma.ppdb.count(),
    prisma.ppdb.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);
  res.json({ counts: { berita, pengumuman, prestasi, bkk, ppdb }, recentPpdb });
}));

adminRouter.get('/ppdb', asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const where = req.query.status ? { status: req.query.status } : {};
  const [data, total] = await prisma.$transaction([
    prisma.ppdb.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.ppdb.count({ where }),
  ]);
  res.json({ data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

adminRouter.patch('/ppdb/:id/status', asyncHandler(async (req, res) => {
  const allowed = ['menunggu', 'diproses', 'diterima', 'ditolak'];
  const { status, catatanAdmin } = req.body;
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Status tidak valid.' });
  const data = await prisma.ppdb.update({ where: { id: req.params.id }, data: { status, catatanAdmin: catatanAdmin ?? undefined } });
  res.json({ data });
}));
