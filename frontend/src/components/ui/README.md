Komponen UI TypeScript

Komponen reusable ditempatkan di src/components/ui agar terpisah dari komponen section di src/components. Folder ini mengikuti konvensi shadcn, bukan persyaratan React. Style global project ada di src/index.css; style layout Beranda ada di src/components/HomeMotion.css. Komponen text-reveal.tsx memakai utility Tailwind secara mandiri.

Project sudah memakai React dan Tailwind v4. Framer Motion dan TypeScript telah ditambahkan. Jalankan npm install, lalu npm run typecheck untuk memeriksa komponen TSX baru; kode JSX existing tidak perlu dimigrasikan sekaligus.

Untuk memasang seluruh sistem shadcn di masa depan, jalankan npx shadcn@latest init dan sesuaikan alias Vite/tsconfig serta components.json saat konfigurasi. Inisialisasi tersebut tidak diperlukan oleh text reveal ini karena tidak menggunakan komponen Radix/shadcn atau alias @. Import lokal dipakai sesuai konvensi project.

TextRevealByWord menerima text dan className. targetRef opsional memilih section sebagai target scroll; render opsional mempertahankan markup rich text dan kotak merah. TextRevealWord memetakan progres ke opacity per rentang kata. Render default dapat langsung digunakan dengan text biasa.

Contoh yang diberikan diadaptasi dengan satu target ref yang valid, dukungan reduced motion, dan ukuran layout existing. Demo fixed serta tinggi 200vh tidak dipasang ke Beranda. Rentang scroll dari start 88% sampai end 48% membuat reveal lebih bertahap tanpa menutupi section lain. trackContentSize menangani perubahan tinggi konten lazy. GSAP hanya mengatur loop horizontal; opacity kata dikendalikan Framer Motion.

Verifikasi 2 November 2026: typecheck, lint, tes integrasi posisi section, dan production build/prerender 146 route lulus. Browser menunjukkan progres parsial (kata awal opacity 1, kata berikutnya 0,55 lalu 0), scroll mundur menurunkan opacity, dan scroll maju menampilkan seluruh kata. Mobile 390px tidak overflow, reduced motion menampilkan semua kata, dan tidak ada console error. Perangkat fisik belum diuji.

Referensi: https://motion.dev/docs/react-use-scroll
