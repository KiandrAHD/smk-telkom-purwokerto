import { spawn } from 'node:child_process';

// Validasi daftar file tar sebelum ekstraksi. Tar archive yang mengandung path
// absolut atau .. ditolak agar restore tidak menulis di luar destination.
export async function assertSafeTarArchive(file) {
  const entries = await new Promise((resolve, reject) => {
    const child = spawn('tar', ['-tzf', file], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve(stdout.split(/\r?\n/).filter(Boolean)) : reject(new Error(`Validasi tar gagal (${code}): ${stderr.slice(0, 500)}`)));
  });
  for (const entry of entries) {
    const normalized = entry.replaceAll('\\', '/');
    if (normalized.startsWith('/') || /^[A-Za-z]:\//.test(normalized) || normalized.split('/').includes('..')) {
      throw new Error(`Archive mengandung path traversal: ${entry}`);
    }
  }
  return entries.length;
}
