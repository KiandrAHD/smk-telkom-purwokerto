import express from 'express';
import { prisma } from '../db.js';
import { requireAdmin, requireAuth, optionalAuth } from '../middleware/auth.js';
import { asyncHandler, notFound, parsePagination } from '../utils/http.js';
import { beritaSchema, pengumumanSchema, prestasiSchema, bkkSchema } from '../validators/content.js';

const definitions = {
  berita: { model: 'berita', schema: beritaSchema, publicWhere: { status: 'published' }, orderBy: { createdAt: 'desc' } },
  pengumuman: { model: 'pengumuman', schema: pengumumanSchema, publicWhere: { status: 'published' }, orderBy: { createdAt: 'desc' } },
  prestasi: { model: 'prestasi', schema: prestasiSchema, publicWhere: {}, orderBy: { tanggal: 'desc' } },
  bkk: { model: 'bkk', schema: bkkSchema, publicWhere: { status: 'aktif' }, orderBy: { createdAt: 'desc' } },
};

export function createContentRouter(type) {
  const def = definitions[type];
  const router = express.Router();
  router.get('/', optionalAuth, asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const where = req.isAdmin ? {} : def.publicWhere;
    const [data, total] = await prisma.$transaction([
      prisma[def.model].findMany({ where, orderBy: def.orderBy, skip, take: limit }),
      prisma[def.model].count({ where }),
    ]);
    res.json({ data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  }));
  router.get('/:idOrSlug', optionalAuth, asyncHandler(async (req, res) => {
    const identifier = req.params.idOrSlug;
    const where = req.isAdmin
      ? { OR: [{ id: identifier }, { slug: identifier }] }
      : { OR: [{ id: identifier }, { slug: identifier }], ...def.publicWhere };
    const data = await prisma[def.model].findFirst({ where });
    if (!data) throw notFound();
    res.json({ data });
  }));
  router.use(requireAuth, requireAdmin);
  router.post('/', asyncHandler(async (req, res) => res.status(201).json({ data: await prisma[def.model].create({ data: def.schema.parse(req.body) }) })));
  router.patch('/:id', asyncHandler(async (req, res) => res.json({ data: await prisma[def.model].update({ where: { id: req.params.id }, data: def.schema.partial().parse(req.body) }) })));
  router.delete('/:id', asyncHandler(async (req, res) => { await prisma[def.model].delete({ where: { id: req.params.id } }); res.status(204).end(); }));
  return router;
}
