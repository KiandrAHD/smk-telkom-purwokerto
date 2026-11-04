import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';
import { env } from './config/env.js';

const databaseUrl = new URL(env.DATABASE_URL);
const pool = mariadb.createPool({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.replace(/^\//, ''),
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
});

const adapter = new PrismaMariaDb(pool);

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function closeDatabase() {
  await prisma.$disconnect();
  await pool.end();
}
