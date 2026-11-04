#!/usr/bin/env node
import 'dotenv/config';
import { prisma, closeDatabase } from '../src/db.js';
import argon2 from 'argon2';

async function seedSiteSettings() {
  const existing = await prisma.siteSettings.findUnique({ where: { id: true } });
  if (!existing) {
    await prisma.siteSettings.create({
      data: {
        schoolName: 'SMK Telkom Purwokerto',
        npsn: '20303020',
        address: 'Jl. DI Panjaitan No.128, Purwokerto',
        phone: '(0281) 632138',
        email: 'info@smktelkom-pwt.sch.id',
        website: 'https://smk-telkom-purwokerto.vercel.app/',
        academicYear: '2027/2028',
        spmbOpen: true,
        newsPageSize: 5,
      },
    });
    console.log('Seed site_settings dibuat.');
  } else {
    console.log('Seed dilewati: site_settings sudah ada.');
  }
}

async function ensureAdmin() {
  const email = process.env.ADMIN_RECOVERY_EMAIL;
  const password = process.env.ADMIN_RECOVERY_PASSWORD;
  const name = process.env.ADMIN_RECOVERY_NAME || 'Administrator Pemulihan';
  if (!email || !password) {
    console.log('Admin recovery dilewati: ADMIN_RECOVERY_EMAIL/ADMIN_RECOVERY_PASSWORD tidak di-set di .env');
    return;
  }
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin recovery dilewati: admin ${email} sudah ada.`);
    return;
  }
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  await prisma.admin.create({ data: { name, email, passwordHash } });
  console.log(`Admin recovery dibuat: ${email}`);
  console.log('PENTING: Hapus ADMIN_RECOVERY_* dari .env dan ganti password segera setelah login pertama.');
}

try {
  await seedSiteSettings();
  await ensureAdmin();
} finally {
  await closeDatabase();
}
