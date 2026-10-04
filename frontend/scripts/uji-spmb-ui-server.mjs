import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { ppdbMataPelajaran, ppdbSemester } from '../src/data/ppdbFormOptions.js';

function qaPdf() {
  const content = 'BT /F1 18 Tf 30 420 Td (DOKUMEN QA - BUKAN DATA PENDAFTAR) Tj ET';
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 500] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${content.length} >>\nstream\n${content}\nendstream`];
  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += 'xref\n0 6\n0000000000 65535 f \n' + offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return pdf;
}

// In-memory test data, discarded when this process stops. No real identities.
let draft = { biodata: { namaLengkap: 'Siswa QA', nisn: '1234567890', whatsapp: '081234567890', jurusan: 'Rekayasa Perangkat Lunak (RPL)', nik: '1234567890123456', agama: 'Islam', tempatLahir: 'Purwokerto', tanggalLahir: '2010-01-01', jenisKelamin: 'Laki-laki', alamat: 'Alamat QA', namaSmp: 'SMP QA', tahunLulus: '2027' }, nilai: Object.fromEntries(ppdbMataPelajaran.flatMap(({ nama }) => ppdbSemester.map((s) => [`${nama}|${s}`, '85.5']))) };
let submission = null;
let draftFailure = false;
let draftWrites = 0;
const server = await createServer({
  configFile: false,
  cacheDir: 'node_modules/.vite-spmb-qa',
  appType: 'custom',
  server: { host: '127.0.0.1', port: 5175, strictPort: true, hmr: false },
  plugins: [react(), tailwindcss(), {
    name: 'spmb-isolated-qa', enforce: 'pre',
    resolveId(source) {
      for (const [suffix, mock] of [['services/ppdbService', 'spmb-service.js'], ['services/supabase', 'spmb-auth.js']]) {
        if (source.endsWith(suffix) || source.endsWith(`${suffix}.js`)) return fileURLToPath(new URL(`./fixtures/${mock}`, import.meta.url));
      }
    },
    configureServer(vite) {
      vite.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/__spmb-qa/')) return next();
        if (req.url.endsWith('/pdf-fixture')) {
          res.setHeader('Content-Type', 'application/pdf');
          res.end(qaPdf()); return;
        }
        if (req.url.endsWith('/toggle-failure')) { draftFailure = !draftFailure; res.end('{}'); return; }
        if (req.url.endsWith('/metrics')) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ draftWrites, draftExists: Boolean(draft), submissions: submission ? 1 : 0 })); return; }
        let body = '';
        for await (const part of req) body += part;
        if (req.method === 'POST') {
          const data = JSON.parse(body);
          if (req.url.endsWith('/draft')) {
            if (draftFailure) { res.statusCode = 503; res.end('{}'); return; }
            draftWrites += 1; draft = { ...data, updated_at: new Date().toISOString() };
          }
          else { submission = { ...data, id: 'QA-REG-0001', status: 'menunggu', created_at: new Date().toISOString() }; draft = null; }
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(req.url.endsWith('/draft') ? draft : req.method === 'POST' ? submission : submission ? [submission] : []));
      });
      return () => vite.middlewares.use(async (req, res, next) => {
        if (!req.headers.accept?.includes('text/html')) return next();
        const html = await vite.transformIndexHtml(req.url, '<!doctype html><html lang="id"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>SPMB QA lokal</title></head><body><div id="root"></div><script type="module" src="/scripts/fixtures/spmb-ui.jsx"></script></body></html>');
        res.setHeader('Content-Type', 'text/html'); res.end(html);
      });
    },
  }],
});
await server.listen();
console.log('Isolated SPMB QA: http://127.0.0.1:5175/spmb/formulir');
