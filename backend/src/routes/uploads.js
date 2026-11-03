import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { storage } from '../utils/storage.js';
import { badRequest, forbidden, notFound, asyncHandler } from '../utils/http.js';
import { prisma } from '../db.js';

export const uploadsRouter = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 }, storage: multer.memoryStorage() });
const images = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const pdf = 'application/pdf';

uploadsRouter.post('/content', requireAuth, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.isAdmin) throw forbidden();
  if (!req.file || !images.includes(req.file.mimetype)) throw badRequest('Hanya gambar yang diizinkan.');
  const key = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
  const url = await storage.put('content-images', key, req.file.buffer);
  res.status(201).json({ url });
}));

uploadsRouter.post('/ppdb-documents', requireAuth, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file || req.file.mimetype !== pdf || req.file.buffer.subarray(0, 5).toString() !== '%PDF-') throw badRequest('Dokumen harus berupa PDF valid.');
  const key = `submissions/${req.user.id}/document.pdf`;
  await storage.put('ppdb-documents', key.replace('/', '__'), req.file.buffer);
  res.status(201).json({ path: key });
}));

uploadsRouter.get('/ppdb-documents/me', requireAuth, asyncHandler(async (req, res) => {
  const key = `submissions__${req.user.id}__document.pdf`;
  if (!(await storage.exists('ppdb-documents', key))) throw notFound('Dokumen belum diunggah.');
  res.type('application/pdf').send(await storage.get('ppdb-documents', key));
}));

uploadsRouter.get('/ppdb-documents/:userId', requireAuth, asyncHandler(async (req, res) => {
  const owner = req.user.id === req.params.userId;
  if (!owner && !req.isAdmin) throw forbidden();
  const application = await prisma.ppdb.findUnique({ where: { userId: req.params.userId } });
  if (!application) throw notFound();
  const key = `submissions__${req.params.userId}__document.pdf`;
  if (!(await storage.exists('ppdb-documents', key))) throw notFound('Dokumen belum diunggah.');
  res.type('application/pdf').send(await storage.get('ppdb-documents', key));
}));
