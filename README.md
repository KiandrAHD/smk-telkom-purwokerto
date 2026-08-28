# 🏫 SMK Telkom Purwokerto — Digital Smart School Platform

<div align="center">
  <img src="./frontend/public/favicon.svg" alt="SMK Telkom Purwokerto" width="120" />
  <br /><br />
  <p><strong>Website REMAKE SMK Telkom Purwokerto</strong> — Dibangun dengan UI/UX modern, performa tinggi, dan asisten berbasis AI.</p>
  <p>Proyek ini dibuat untuk mengikuti <strong>Lomba Website Sekolah</strong>.</p>
</div>

<br />

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Teknologi](#-teknologi)
- [Struktur Proyek](#-struktur-proyek)
- [Cara Menjalankan](#-cara-menjalankan)
- [Daftar Halaman](#-daftar-halaman)
- [STELA — Asisten AI](#-stela--asisten-ai)
- [Status Fitur](#-status-fitur)
- [Panduan Git](#-panduan-git)
- [Aturan Proyek](#-aturan-proyek)
- [Kontak](#-kontak)

---

## 🎯 Tentang Proyek

**SMK Telkom Purwokerto — Digital Smart School Platform** adalah website sekolah modern yang dibangun dari awal dengan tujuan:

- ✅ Menghadirkan wajah baru SMK Telkom Purwokerto di era digital
- ✅ Memberikan pengalaman pengguna (UX) setara website perusahaan teknologi
- ✅ Menyediakan informasi sekolah secara lengkap dan profesional
- ✅ Mempermudah akses informasi PPDB, jurusan, prestasi, dan mitra industri
- ✅ Menghadirkan asisten AI (STELA) untuk membantu calon siswa dan orang tua
- ✅ Menyediakan dashboard admin untuk pengelolaan konten sekolah

### Konsep Utama

> **"Digital Smart School Platform"**
>
> Sebuah platform digital yang cerdas, modern, dan terintegrasi untuk mendukung kegiatan belajar mengajar, administrasi sekolah, dan branding institusi.

### Target User

| User | Kebutuhan |
|------|-----------|
| 👨‍🎓 Calon Siswa | Informasi jurusan, PPDB, fasilitas |
| 👪 Orang Tua | Profil sekolah, akreditasi, prestasi |
| 👨‍🏫 Guru | Informasi internal, pengumuman |
| 🏢 Admin Sekolah | Dashboard, kelola konten, data PPDB |

### Program Keahlian

Empat jurusan yang tersedia: **RPL** (Rekayasa Perangkat Lunak), **PG** (Pengembangan Game), **TKJ** (Teknik Komputer dan Jaringan), dan **TJAT** (Teknik Jaringan Akses Telekomunikasi).

---

## 🛠 Teknologi

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| [React](https://react.dev/) | 19 | Library UI |
| [Vite](https://vite.dev/) | 8 | Build tool dan dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Styling. Tanpa berkas config — token tema didefinisikan di blok `@theme` pada `src/index.css` |
| [React Router](https://reactrouter.com/) | 7 | Routing dan navigasi halaman |
| [Lucide React](https://lucide.dev/) | 1 | Icon set |
| [React Icons](https://react-icons.github.io/react-icons/) | 5 | Ikon tambahan (logo media sosial) |
| [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) | 2 | Klien Supabase untuk auth dan CRUD admin |

> **Catatan:** proyek ini **tidak** memakai pustaka animasi eksternal. Seluruh animasi memakai CSS dan `IntersectionObserver` bawaan browser (lihat `components/Reveal.jsx`). Permintaan HTTP memakai `fetch` bawaan, bukan Axios.

### Backend

| Teknologi | Kegunaan |
|-----------|----------|
| [Supabase](https://supabase.com/) | Backend-as-a-Service |
| Supabase Auth | Autentikasi admin |
| Supabase Database | PostgreSQL — tabel `admins`, `berita`, `pengumuman`, `prestasi`, `bkk`, `ppdb` |
| Supabase Storage | Penyimpanan gambar dan dokumen |
| Supabase Edge Functions | Menjalankan chatbot STELA (Deno) |
| Row Level Security | Keamanan data per peran |

### Design System

| Aspek | Detail |
|-------|--------|
| **Warna Primary** | `#C8102E` (Merah Telkom) |
| **Warna Secondary** | Putih |
| **Warna Accent** | Hitam |
| **Font Utama** | Inter (body), Poppins (heading) |
| **Style** | Minimalis, clean |
| **Animasi** | CSS transition + `IntersectionObserver` — fade/slide saat discroll, transisi antar halaman, zoom foto saat hover |
| **Aksesibilitas** | Animasi dimatikan otomatis saat `prefers-reduced-motion`, konten tetap utuh saat dicetak |

---

## 📁 Struktur Proyek

```
smk-telkom-purwokerto/
│
├── frontend/                             # Aplikasi React
│   ├── public/                           # favicon.svg, icons.svg
│   ├── scripts/
│   │   └── buat-konten-stela.mjs         # Menghasilkan basis pengetahuan STELA dari dummyData.js
│   │
│   ├── src/
│   │   ├── assets/                       # Gambar per halaman (landing, jurusan, tentang, bkk, pengumuman)
│   │   │
│   │   ├── components/                   # Komponen bersama
│   │   │   ├── Navbar.jsx                # Sticky, blur, drawer mobile, highlight menu aktif
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── HeroStatsBar.jsx          # Bilah statistik hero (dipakai Jurusan, Prestasi, BKK)
│   │   │   ├── DetailLayout.jsx          # Kerangka bersama semua halaman detail
│   │   │   ├── Reveal.jsx                # Animasi muncul saat discroll
│   │   │   ├── VideoEmbed.jsx            # Pemutar YouTube, iframe dimuat setelah diklik
│   │   │   ├── GaleriFoto.jsx            # Galeri + penampil layar penuh (elemen <dialog>)
│   │   │   ├── ScrollToTop.jsx
│   │   │   ├── ... (20 komponen tingkat atas)
│   │   │   │
│   │   │   ├── berita/                   # 5 komponen section
│   │   │   ├── bkk/                      # 5 komponen section
│   │   │   ├── jurusan/                  # 7 komponen section
│   │   │   ├── pengumuman/               # 10 komponen section
│   │   │   ├── prestasi/                 # 6 komponen section
│   │   │   ├── stela/                    # StelaChat.jsx, StelaWidget.jsx
│   │   │   └── tentang/                  # 7 komponen section
│   │   │
│   │   ├── pages/                        # Halaman publik + halaman detail
│   │   │   └── admin/                    # Dashboard dan CRUD
│   │   │       ├── berita/               # Page, Table, Modal, Form
│   │   │       ├── pengumuman/
│   │   │       └── prestasi/
│   │   │
│   │   ├── page/Login/Login.jsx          # Halaman login admin
│   │   ├── layouts/MainLayout.jsx        # Navbar + konten + Footer + widget STELA
│   │   ├── router/ProtectedRoute.jsx     # Penjaga rute admin
│   │   ├── context/AuthContext.jsx       # Sesi Supabase
│   │   │
│   │   ├── services/                     # Lapisan komunikasi data
│   │   │   ├── supabase.js               # Klien Supabase (aman saat env kosong)
│   │   │   ├── stela.js                  # Pemanggil Edge Function STELA
│   │   │   └── beritaService.js, pengumumanService.js, prestasiService.js
│   │   │
│   │   ├── data/dummyData.js             # 61 export — seluruh isi situs
│   │   ├── hooks/useScrollPosition.js
│   │   ├── utils/slug.js
│   │   ├── App.jsx                       # Definisi seluruh route
│   │   ├── main.jsx
│   │   └── index.css                     # Token tema Tailwind + animasi global
│   │
│   ├── .env                              # TIDAK ikut git — buat sendiri
│   ├── package.json
│   └── vite.config.js
│
├── supabase/
│   ├── migrations/001_initial_schema.sql # Tabel, index, trigger, RLS, bucket Storage
│   ├── functions/stela/                  # Edge Function chatbot
│   │   ├── index.ts
│   │   ├── konten-sekolah.ts             # DIHASILKAN OTOMATIS — jangan diedit manual
│   │   └── README.md                     # Panduan pemasangan STELA
│   └── README.md                         # Dokumentasi database
│
└── README.md                             # Berkas ini
```

### Penjelasan Folder

| Folder | Fungsi |
|--------|--------|
| `components/` | Komponen React reusable. Setiap section punya berkasnya sendiri, dikelompokkan per halaman. |
| `layouts/` | Pembungkus halaman. `MainLayout` memuat Navbar, Footer, dan widget STELA. |
| `pages/` | Halaman yang dirender router, termasuk halaman detail dinamis dan area admin. |
| `router/` | Penjaga rute — `ProtectedRoute` menahan halaman admin dari pengunjung yang belum login. |
| `context/` | State global. `AuthContext` menyimpan sesi Supabase. |
| `services/` | Lapisan komunikasi dengan Supabase dan Edge Function. |
| `data/` | Data dummy seluruh situs, dipisah dari komponen. |
| `hooks/` | Custom hooks. |
| `utils/` | Fungsi utility kecil. |
| `assets/` | Gambar dan aset statis. |

---

## 🚀 Cara Menjalankan

### Prasyarat

- **Node.js `^20.19.0` atau `>=22.12.0`** (persyaratan Vite 8)
- npm 9 atau lebih baru

### 1. Clone dan masuk ke folder frontend

```bash
git clone <url-repository>
```

```bash
cd smk-telkom-purwokerto/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat berkas `.env`

Buat `frontend/.env` dengan isi:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

> ⚠️ **Penting soal keamanan**
>
> - Ambil nilainya sendiri dari Supabase Dashboard → **Settings → API**. Jangan meminta berkas `.env` dikirimkan lewat chat, dan jangan pernah men-commit-nya.
> - Pakai **anon/publishable key**, **bukan** service key. Semua variabel berawalan `VITE_` ikut dibundel ke browser dan bisa dibaca siapa pun lewat DevTools — service key di sana berarti seluruh database terbuka.
> - Situs publik tetap berjalan normal tanpa `.env`; yang terkunci hanya area admin dan STELA.

### 4. Jalankan development server

```bash
npm run dev
```

Akses di **http://localhost:5173**

### 5. Build untuk production

```bash
npm run build
```

Hasilnya tersimpan di `frontend/dist/`.

### Perintah lain

| Perintah | Kegunaan |
|----------|----------|
| `npm run dev` | Menjalankan dev server |
| `npm run build` | Build production |
| `npm run preview` | Melihat hasil build secara lokal |
| `npm run lint` | Memeriksa kode dengan ESLint |
| `npm run stela:konten` | Memperbarui basis pengetahuan STELA dari `dummyData.js` |

### Menyiapkan database

Lihat [`supabase/README.md`](./supabase/README.md) untuk menjalankan migration.

---

## 🗺 Daftar Halaman

### Halaman publik

| Route | Halaman |
|-------|---------|
| `/` | Beranda |
| `/tentang` | Profil sekolah |
| `/jurusan` | Daftar jurusan |
| `/prestasi` | Prestasi dan galeri |
| `/bkk` | Bursa Kerja Khusus |
| `/berita` | Berita dan kegiatan |
| `/pengumuman` | Pengumuman resmi |
| `/stela` | Chatbot STELA |

### Halaman detail dinamis

| Route | Jumlah entri |
|-------|--------------|
| `/jurusan/:slug` | 4 |
| `/prestasi/:slug` | 6 |
| `/berita/:slug` | 12 |
| `/pengumuman/:slug` | 6 |

Isi setiap halaman detail diambil dari `dummyData.js` berdasarkan slug di URL — tidak ada teks yang ditulis langsung di komponen. Slug yang belum punya data akan mendarat di halaman **Segera Hadir**, sama seperti seluruh rute yang belum dibangun (`/ppdb`, `/galeri`, dan lain-lain).

### Area admin

| Route | Halaman |
|-------|---------|
| `/login` | Login admin |
| `/dashboard` | Ringkasan |
| `/dashboard/berita` | CRUD berita |
| `/dashboard/pengumuman` | CRUD pengumuman |
| `/dashboard/prestasi` | CRUD prestasi |
| `/dashboard/bkk` | Placeholder |
| `/dashboard/ppdb` | Placeholder |

---

## 🤖 STELA — Asisten AI

**STELA** (Stematel Learning Asistant) adalah chatbot yang menjawab pertanyaan pengunjung seputar sekolah. Tersedia sebagai halaman penuh di `/stela` dan gelembung mengambang di seluruh halaman publik.

### Cara kerjanya

```
Widget chat (React)  →  Supabase Edge Function  →  Claude API
                        ↑ API key hanya di sini
```

Frontend **tidak pernah** menyentuh API key. Kalau key ditaruh di React, ia ikut terbundel ke browser dan bisa dipakai orang lain.

Basis pengetahuannya adalah seluruh isi `dummyData.js` (~19.000 token) yang dikirim sebagai instruksi. Karena muat dalam satu prompt, proyek ini **tidak memerlukan vector database atau RAG**.

### Setelah mengubah isi situs

```bash
cd frontend
```

```bash
npm run stela:konten
```

Lalu deploy ulang Edge Function-nya. Tanpa langkah ini, STELA masih menjawab memakai data lama.

📖 Panduan pemasangan lengkap: [`supabase/functions/stela/README.md`](./supabase/functions/stela/README.md)

---

## ✅ Status Fitur

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Landing Page | ✅ Selesai | Seluruh section |
| Halaman Tentang | ✅ Selesai | Termasuk video profil dan galeri fasilitas |
| Halaman Jurusan | ✅ Selesai | Daftar + 4 halaman detail |
| Halaman Prestasi | ✅ Selesai | Unggulan, galeri, perjalanan + 6 halaman detail |
| Halaman BKK | ✅ Selesai | Lowongan, PKL, jalur karier, alumni |
| Halaman Berita | ✅ Selesai | Sorotan, kategori, agenda + 12 halaman detail |
| Halaman Pengumuman | ✅ Selesai | PPDB, statistik, daftar + 6 halaman detail |
| Navigasi | ✅ Selesai | Seluruh tombol dan kartu mengarah ke tujuan nyata |
| Animasi & interaksi | ✅ Selesai | Scroll reveal, transisi halaman, zoom foto |
| Galeri & video | ✅ Selesai | Galeri layar penuh, pemutar video |
| Login admin | ✅ Selesai | Supabase Auth |
| Dashboard admin | ✅ Selesai | Ringkasan + sidebar |
| CRUD Berita | ✅ Selesai | Terhubung Supabase |
| CRUD Pengumuman | ✅ Selesai | Terhubung Supabase |
| CRUD Prestasi | ✅ Selesai | Terhubung Supabase |
| STELA AI | ✅ Selesai | Perlu API key untuk aktif |
| CRUD BKK | ⬜ Belum | Masih placeholder |
| PPDB Online | ⬜ Belum | Route mendarat di Segera Hadir |
| Halaman Ekskul | ⬜ Belum | Belum ada desain maupun datanya |
| Responsive | ✅ Selesai | Seluruh halaman |

### Catatan teknis yang perlu diketahui

- **Data situs masih dari `dummyData.js`.** CRUD admin sudah menulis ke Supabase, tetapi halaman publik belum membacanya. Memindahkannya adalah pekerjaan berikutnya.
- **Sebagian foto masih memakai aset pengganti.** Ditandai komentar `ponytail:` di `dummyData.js`.
- **Video highlight prestasi** sementara memakai video profil sekolah karena reel khususnya belum ada.

---

## 🔄 Panduan Git

### Setiap kali memulai coding

```bash
git pull
```

### Setelah selesai coding

```bash
git status
```

```bash
git add .
```

```bash
git commit -m "feat: menambahkan halaman dashboard admin"
```

```bash
git push
```

### Format pesan commit

| Prefix | Keterangan |
|--------|------------|
| `feat:` | Menambahkan fitur baru |
| `fix:` | Memperbaiki bug |
| `style:` | Perubahan styling (CSS, Tailwind) |
| `refactor:` | Perubahan kode tanpa mengubah fungsionalitas |
| `docs:` | Perubahan dokumentasi |
| `chore:` | Tugas rutin (setup, config) |

---

## 📝 Aturan Proyek

### 1. Coding style

- ✅ **React Functional Component** dengan arrow function
- ✅ Penamaan berkas **PascalCase** (contoh: `Sidebar.jsx`)
- ✅ **Pisahkan setiap section** menjadi komponen tersendiri
- ✅ **Tailwind CSS** untuk seluruh styling
- ❌ Jangan gunakan **inline CSS**
- ❌ Jangan gunakan **Bootstrap, jQuery, Material UI**

### 2. Struktur folder

- ✅ Ikuti struktur yang sudah ada
- ❌ Jangan mengubah struktur folder sembarangan
- ✅ Diskusikan dulu kalau perlu menambah folder baru

### 3. Data

- ✅ Simpan data di `src/data/dummyData.js`, terpisah dari komponen
- ❌ Jangan menulis teks konten langsung di dalam komponen
- ✅ Setiap item yang punya halaman detail wajib memiliki `slug` unik

### 4. Navigasi

- ✅ Gunakan **React Router** (`<Link>`), bukan `<a href="#">`
- ❌ Jangan ada tombol yang hanya dekorasi tanpa fungsi
- ✅ Tujuan yang belum dibangun diarahkan ke halaman **Segera Hadir**

### 5. Keamanan

- ❌ **Jangan pernah** menaruh secret key di variabel `VITE_*` — semuanya terbaca di browser
- ❌ **Jangan commit** berkas `.env`
- ✅ Kunci rahasia disimpan sebagai secret Supabase, dipakai dari Edge Function

### 6. Git

- ✅ Commit berkala dengan pesan yang jelas
- ✅ Pull sebelum mulai coding

### 7. Komunikasi

- ✅ Kalau ada yang tidak jelas, tanya ke tim
- ✅ Diskusikan dulu sebelum mengubah bagian yang sudah jadi

---

## 📞 Kontak

| Nama | Role | Kontak |
|------|------|--------|
| [Nama Ketua Tim] | Project Lead / Frontend | [Email/Discord] |
| Rainer | Frontend Developer | [Email/Discord] |

---

<div align="center">
  <br />
  <p>
    <strong>SMK Telkom Purwokerto</strong> — Digital Smart School Platform
  </p>
  <p>
    Dibuat dengan ❤️ untuk <strong>Lomba Website Sekolah</strong>
  </p>
  <p>
    &copy; 2026 SMK Telkom Purwokerto. All rights reserved.
  </p>
</div>
