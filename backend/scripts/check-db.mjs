import { prisma, closeDatabase } from '../src/db.js';
await prisma.$queryRaw`SELECT 1`;
console.log('Prisma connection OK');
await closeDatabase();
