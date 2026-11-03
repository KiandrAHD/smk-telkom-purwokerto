import { randomToken } from '../utils/crypto.js';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || 'no-reply@smktelkom-pwt.sch.id';
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:5173';

export function emailEnabled() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

// Token verifikasi/reset disimpan di DB sehingga tidak perlu layanan mail eksternal
// untuk menyimpan state. Tanpa SMTP, token tetap dibuat dan/log untuk development.
export async function sendVerificationEmail(user, token) {
  const link = `${PUBLIC_URL}/auth/confirm?token=${token}`;
  if (!emailEnabled()) {
    console.log(JSON.stringify({ level: 'info', event: 'email_verification_skipped', email: user.email, link }));
    return { delivered: false, link };
  }
  const { sendMail } = await import('nodemailer');
  const transporter = (await import('nodemailer')).createTransport({ host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  await transporter.sendMail({ from: MAIL_FROM, to: user.email, subject: 'Verifikasi email pendaftaran SPMB', text: `Klik tautan berikut untuk memverifikasi email Anda: ${link}` });
  return { delivered: true, link };
}

export async function sendResetEmail(user, token) {
  const link = `${PUBLIC_URL}/ppdb/atur-sandi?token=${token}`;
  if (!emailEnabled()) {
    console.log(JSON.stringify({ level: 'info', event: 'password_reset_skipped', email: user.email, link }));
    return { delivered: false, link };
  }
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  await transporter.sendMail({ from: MAIL_FROM, to: user.email, subject: 'Atur ulang kata sandi SPMB', text: `Klik tautan berikut untuk mengatur ulang kata sandi: ${link}` });
  return { delivered: true, link };
}

export { randomToken };
