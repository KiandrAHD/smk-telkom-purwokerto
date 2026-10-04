// Run: node scripts/uji-stela-layout-server.mjs, then open localhost:5176.
// Uses real chat components with local answers; never calls an AI provider.
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const answer = [
  'Penjelasan panjang tentang kegiatan siswa. '.repeat(25),
  'Tanpa spasi: ' + 'abcdefghij'.repeat(70),
  '**' + 'tebal'.repeat(100) + '**',
  '`' + 'kode'.repeat(100) + '`',
  '/jurusan/' + 'proyek-siswa-'.repeat(35),
  'Baris terakhir tetap terbaca.',
].join('\n\n');
const entry = `
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import LanguageProvider from '/src/context/LanguageProvider.jsx';
import { useLanguage } from '/src/context/LanguageContext';
import StelaChat from '/src/components/stela/StelaChat.jsx';
import StelaWidget from '/src/components/stela/StelaWidget.jsx';
import '/src/index.css';
function LayoutTest() {
  const [mode, setMode] = useState('widget');
  const [result, setResult] = useState('Belum diperiksa');
  const { setLanguage } = useLanguage();
  const check = () => {
    const chats = [...document.querySelectorAll('[aria-live="polite"]')].filter(el => el.getBoundingClientRect().width > 0);
    const failures = [];
    if (!chats.length) failures.push('Buka chat terlebih dahulu');
    for (const chat of chats) {
      if (chat.scrollWidth > chat.clientWidth + 1) failures.push('Area chat meluber horizontal');
      for (const bubble of chat.querySelectorAll('p')) {
        if (bubble.scrollWidth > bubble.clientWidth + 1) failures.push('Isi pesan meluber');
        const box = bubble.getBoundingClientRect(), area = chat.getBoundingClientRect();
        if (box.left < area.left - 1 || box.right > area.right + 1) failures.push('Pesan keluar area chat');
      }
    }
    if (document.documentElement.scrollWidth > window.innerWidth) failures.push('Halaman meluber');
    setResult(failures.length ? 'GAGAL: ' + [...new Set(failures)].join(', ') : 'LULUS: semua pesan membungkus di dalam area chat');
  };
  return <main className="min-h-screen bg-white p-4">
    <h1 className="text-lg font-bold">QA layout STELA — jawaban lokal</h1>
    <p>Kirim teks biasa atau tanpa spasi. Jawaban menguji paragraf, kode, teks tebal, dan path panjang.</p>
    <div className="my-4 flex flex-wrap gap-3">
      <button onClick={() => setMode(mode === 'widget' ? 'page' : 'widget')}>Mode: {mode}</button>
      <button onClick={() => setLanguage('id')}>ID</button><button onClick={() => setLanguage('en')}>EN</button>
      <button onClick={check}>Periksa layout</button>
    </div>
    <output role="status">{result}</output>
    {mode === 'widget' ? <StelaWidget /> : <div className="mx-auto max-w-4xl"><StelaChat className="mt-6 h-[32rem]" /></div>}
  </main>;
}
createRoot(document.getElementById('root')).render(<MemoryRouter><LanguageProvider><LayoutTest /></LanguageProvider></MemoryRouter>);
`;
const server = await createServer({
  configFile: false,
  cacheDir: 'node_modules/.vite-stela-layout-qa',
  optimizeDeps: { noDiscovery: true, include: ['react', 'react-dom/client', 'react-router-dom', 'lucide-react', 'react/jsx-runtime', 'react/jsx-dev-runtime'] },
  appType: 'custom',
  server: { host: '127.0.0.1', port: 5176, strictPort: true, hmr: false },
  plugins: [react(), tailwindcss(), {
    name: 'stela-layout-qa', enforce: 'pre',
    resolveId(source) {
      if (source.endsWith('services/stela')) return '\0stela-layout-service';
      if (source === '/__stela-layout.jsx') return source;
    },
    load(id) {
      if (id === '\0stela-layout-service') return 'export const PESAN_STELA_GAGAL = "QA error"; export async function tanyaStela() { return ' + JSON.stringify(answer) + '; }';
      if (id === '/__stela-layout.jsx') return entry;
    },
    configureServer(vite) {
      return () => vite.middlewares.use(async (req, res, next) => {
        if (!req.headers.accept?.includes('text/html')) return next();
        res.setHeader('Content-Type', 'text/html');
        res.end(await vite.transformIndexHtml(req.url, '<!doctype html><html lang="id"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>QA STELA layout</title></head><body><div id="root"></div><script type="module" src="/__stela-layout.jsx"></script></body></html>'));
      });
    },
  }],
});
await server.listen();
server.printUrls();
