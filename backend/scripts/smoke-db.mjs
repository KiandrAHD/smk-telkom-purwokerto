import { prisma, closeDatabase } from '../src/db.js';

const log = (label, value) => console.log(`${label}:`, value);

// Connection
await prisma.$queryRaw`SELECT 1`;
log('connection', 'ok');

// Transaction + CRUD + FK (scoped to a throwaway admin/user, cleaned up)
const suffix = Date.now();
const slug = `smoke-${suffix}`;
let created;

try {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { email: `smoke-${suffix}@example.invalid`, passwordHash: 'x' } });
    await tx.admin.create({ data: { userId: user.id, nama: 'Smoke Admin' } });
    created = await tx.berita.create({ data: { judul: 'Smoke', slug, konten: 'isi', status: 'draft' } });
  });
  log('transaction+crud', 'ok');
} catch (e) {
  log('transaction+crud', `FAILED ${e.message}`);
}

// Foreign key enforcement: creating admin with unknown user must fail
try {
  await prisma.admin.create({ data: { userId: '00000000-0000-0000-0000-000000000000', nama: 'x' } });
  log('fk-enforcement', 'FAILED (orphan allowed)');
} catch {
  log('fk-enforcement', 'ok (orphan rejected)');
}

// Cleanup
if (created) await prisma.berita.delete({ where: { id: created.id } });
await prisma.user.deleteMany({ where: { email: `smoke-${suffix}@example.invalid` } });
await closeDatabase();
