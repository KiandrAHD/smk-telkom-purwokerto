import express from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { optionalAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler, notFound } from '../utils/http.js';

export const spmbRouter = express.Router();
const schema = z.object({
  jenis: z.enum(['jadwal', 'timeline', 'skema', 'persyaratan', 'syarat', 'statistik']), judul: z.string().trim().min(1).max(180), deskripsi: z.string().max(5000).default(''), urutan: z.number().int().min(0).max(9999).default(1),
  tanggal_mulai: z.coerce.date().nullable().optional(), tanggal_selesai: z.coerce.date().nullable().optional(), tanggal_seleksi: z.coerce.date().nullable().optional(), tanggal_pengumuman: z.coerce.date().nullable().optional(), ikon: z.string().max(30).nullable().optional(), tautan_url: z.string().max(2048).nullable().optional(), sumber_url: z.string().max(2048).nullable().optional(), status: z.enum(['draft', 'published']).default('draft'), kuota_total: z.number().int().min(0).max(100000).nullable().optional(),
});
const mapInput = (x) => ({ ...x, tanggalMulai: x.tanggal_mulai, tanggalSelesai: x.tanggal_selesai, tanggalSeleksi: x.tanggal_seleksi, tanggalPengumuman: x.tanggal_pengumuman, tautanUrl: x.tautan_url, sumberUrl: x.sumber_url, kuotaTotal: x.kuota_total, tanggal_mulai: undefined, tanggal_selesai: undefined, tanggal_seleksi: undefined, tanggal_pengumuman: undefined, tautan_url: undefined, sumber_url: undefined, kuota_total: undefined });
spmbRouter.get('/', optionalAuth, asyncHandler(async (req, res) => { const data = await prisma.spmbInformation.findMany({ where: req.isAdmin ? {} : { status: 'published' }, orderBy: [{ jenis: 'asc' }, { urutan: 'asc' }] }); res.json({ data }); }));
spmbRouter.get('/:id', optionalAuth, asyncHandler(async (req, res) => { const data = await prisma.spmbInformation.findFirst({ where: { id: req.params.id, ...(req.isAdmin ? {} : { status: 'published' }) } }); if (!data) throw notFound(); res.json({ data }); }));
spmbRouter.use(requireAdmin);
spmbRouter.post('/', asyncHandler(async (req, res) => res.status(201).json({ data: await prisma.spmbInformation.create({ data: mapInput(schema.parse(req.body)) }) })));
spmbRouter.patch('/:id', asyncHandler(async (req, res) => res.json({ data: await prisma.spmbInformation.update({ where: { id: req.params.id }, data: mapInput(schema.partial().parse(req.body)) }) })));
spmbRouter.delete('/:id', asyncHandler(async (req, res) => { await prisma.spmbInformation.delete({ where: { id: req.params.id } }); res.status(204).end(); }));
