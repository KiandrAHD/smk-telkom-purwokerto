import express from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, conflict, notFound } from '../utils/http.js';

export const ppdbRouter = express.Router();
ppdbRouter.use(requireAuth);

const draftSchema = z.object({ biodata: z.record(z.string(), z.unknown()).default({}), nilai: z.record(z.string(), z.unknown()).default({}) });
const applicationSchema = z.object({
  nama_lengkap: z.string().trim().min(1).max(255), nisn: z.string().max(30).nullable().optional(), nik: z.string().max(30).nullable().optional(),
  asal_sekolah: z.string().trim().min(1).max(255), tempat_lahir: z.string().max(120).nullable().optional(), tanggal_lahir: z.coerce.date().nullable().optional(),
  jenis_kelamin: z.string().max(30).nullable().optional(), agama: z.string().max(50).nullable().optional(), tahun_lulus: z.string().max(10).nullable().optional(),
  alamat: z.string().max(10000).nullable().optional(), no_hp: z.string().max(30).nullable().optional(), email: z.string().email().max(254).nullable().optional(),
  pilihan_jurusan: z.string().trim().min(1).max(120), nilai_rapor: z.record(z.string(), z.unknown()).nullable().optional(), dokumen_url: z.string().max(2048).nullable().optional(),
});

const mapApplication = (input) => ({
  userId: input.userId,
  namaLengkap: input.nama_lengkap,
  nisn: input.nisn,
  nik: input.nik,
  asalSekolah: input.asal_sekolah,
  tempatLahir: input.tempat_lahir,
  tanggalLahir: input.tanggal_lahir,
  jenisKelamin: input.jenis_kelamin,
  agama: input.agama,
  tahunLulus: input.tahun_lulus,
  alamat: input.alamat,
  noHp: input.no_hp,
  email: input.email,
  pilihanJurusan: input.pilihan_jurusan,
  nilaiRapor: input.nilai_rapor,
  dokumenUrl: input.dokumen_url,
});

ppdbRouter.get('/draft', asyncHandler(async (req, res) => {
  const data = await prisma.ppdbDraft.findUnique({ where: { userId: req.user.id } });
  res.json({ data });
}));
ppdbRouter.put('/draft', asyncHandler(async (req, res) => {
  const input = draftSchema.parse(req.body);
  const data = await prisma.ppdbDraft.upsert({ where: { userId: req.user.id }, create: { userId: req.user.id, ...input }, update: input });
  res.json({ data });
}));
ppdbRouter.delete('/draft', asyncHandler(async (req, res) => { await prisma.ppdbDraft.deleteMany({ where: { userId: req.user.id } }); res.status(204).end(); }));
ppdbRouter.get('/mine', asyncHandler(async (req, res) => {
  const data = await prisma.ppdb.findUnique({ where: { userId: req.user.id } });
  res.json({ data });
}));
ppdbRouter.post('/', asyncHandler(async (req, res) => {
  const existing = await prisma.ppdb.findUnique({ where: { userId: req.user.id } });
  if (existing) throw conflict('Anda sudah memiliki pendaftaran.', 'duplicate_submission');
  const input = applicationSchema.parse(req.body);
  const data = await prisma.$transaction(async (tx) => {
    const created = await tx.ppdb.create({ data: mapApplication({ ...input, userId: req.user.id }) });
    await tx.ppdbDraft.deleteMany({ where: { userId: req.user.id } });
    return created;
  });
  res.status(201).json({ data });
}));
