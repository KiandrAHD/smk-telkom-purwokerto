# 🏫 SMK Telkom Purwokerto — Digital Smart School Platform

<div align="center">
  <img src="./public/favicon.svg" alt="SMK Telkom Purwokerto" width="120" />
  <br /><br />
  <p><strong>Website resmi SMK Telkom Purwokerto</strong> — Dibangun dengan UI/UX modern, performa tinggi, dan berbasis Artificial Intelligence.</p>
  <p>Proyek ini dibuat untuk mengikuti <strong>Lomba Website Sekolah</strong>.</p>
</div>

<br />

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Teknologi](#-teknologi)
- [Struktur Proyek](#-struktur-proyek)
- [Cara Menjalankan](#-cara-menjalankan)
- [Progress Saat Ini](#-progress-saat-ini)
- [Yang Belum Dibuat](#-yang-belum-dibuat)
- [Panduan Git](#-panduan-git)
- [Tugas Reiner](#-tugas-reiner)
- [Aturan Proyek](#-aturan-proyek)
- [Target Akhir](#-target-akhir)
- [Kontak](#-kontak)

---

## 🎯 Tentang Proyek

**SMK Telkom Purwokerto — Digital Smart School Platform** adalah website sekolah modern yang dibangun dari awal (rebuild total) dengan tujuan:

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

---

## 🛠 Teknologi

### Frontend (Saat Ini)

| Teknologi | Kegunaan |
|-----------|----------|
| [React 19](https://react.dev/) | Library JavaScript untuk membangun user interface |
| [Vite](https://vitejs.dev/) | Build tool cepat untuk pengembangan React |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework untuk styling cepat |
| [React Router v7](https://reactrouter.com/) | Routing dan navigasi halaman |
| [Framer Motion](https://www.framer.com/motion/) | Library animasi React yang powerful |
| [Lucide React](https://lucide.dev/) | Icon set modern dan konsisten |
| [Axios](https://axios-http.com/) | HTTP client untuk request ke API/Supabase |

### Backend (Rencana)

| Teknologi | Kegunaan |
|-----------|----------|
| [Supabase](https://supabase.com/) | Backend-as-a-Service (BaaS) open-source |
| Supabase Auth | Autentikasi pengguna (admin, guru, siswa) |
| Supabase Database | PostgreSQL untuk menyimpan data |
| Supabase Storage | Penyimpanan file (gambar, dokumen) |
| Row Level Security | Keamanan data level baris |

### Design System

| Aspek | Detail |
|-------|--------|
| **Warna Primary** | `#C8102E` (Merah Telkom) |
| **Warna Secondary** | Putih |
| **Warna Accent** | Hitam |
| **Font Utama** | Inter (body), Poppins (heading) |
| **Style** | Minimalis, clean, Apple/Google style |
| **Animasi** | Framer Motion — smooth, fade, slide, scroll reveal |

---

## 📁 Struktur Proyek

```
frontend/
│
├── public/                          # File statis (favicon, dll)
│
├── src/
│   ├── assets/                      # Gambar, ikon, dan file statis
│   │   └── hero.png                 # Hero section image
│   │
│   ├── components/                  # Komponen reusable (specific)
│   │   ├── Navbar.jsx               # Navigasi utama
│   │   ├── HeroSection.jsx          # Hero section landing page
│   │   ├── FeatureCard.jsx          # Card fitur reusable
│   │   ├── FeatureSection.jsx       # Section fitur layanan
│   │   ├── SectionHeading.jsx       # Heading section reusable
│   │   ├── AboutSection.jsx         # Tentang sekolah
│   │   ├── DepartmentCard.jsx       # Card jurusan reusable
│   │   ├── DepartmentsSection.jsx   # Section jurusan
│   │   ├── PartnersSection.jsx      # Partner industri (auto slider)
│   │   ├── AchievementCard.jsx      # Card prestasi reusable
│   │   ├── AchievementsSection.jsx  # Section prestasi
│   │   ├── StelaAISection.jsx       # AI Assistant STELA
│   │   ├── CTASection.jsx           # Call to action PPDB
│   │   └── Footer.jsx               # Footer utama
│   │
│   ├── layouts/                     # Layout wrapper
│   │   └── MainLayout.jsx           # Layout utama (Navbar + content + Footer)
│   │
│   ├── pages/                       # Halaman aplikasi
│   │   └── LandingPage.jsx          # Halaman utama landing page
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── useScrollPosition.js     # Hook untuk deteksi scroll
│   │
│   ├── services/                    # Service layer (API, Supabase)
│   │   └── supabase.js              # Konfigurasi dan client Supabase
│   │
│   ├── data/                        # Data statis / dummy data
│   │
│   ├── utils/                       # Fungsi utility
│   │
│   ├── App.jsx                      # Entry point aplikasi
│   ├── main.jsx                     # Root render
│   └── index.css                    # Global styles + Tailwind config
│
├── .env                             # Environment variables
├── .gitignore                       # File yang diabaikan Git
├── index.html                       # HTML template
├── package.json                     # Dependencies dan scripts
├── vite.config.js                   # Konfigurasi Vite
└── README.md                        # Dokumentasi project (file ini)
```

### Penjelasan Folder

| Folder | Fungsi |
|--------|--------|
| `components/` | Berisi komponen React yang spesifik dan reusable. Setiap komponen memiliki file sendiri. |
| `layouts/` | Layout wrapper yang membungkus halaman. `MainLayout` berisi Navbar dan Footer. |
| `pages/` | Halaman utama aplikasi. Setiap halaman di-render oleh router. |
| `hooks/` | Custom React hooks untuk logic yang reusable (contoh: scroll detection). |
| `services/` | Layer komunikasi dengan backend/Supabase. |
| `data/` | Data statis atau dummy data untuk pengembangan. |
| `utils/` | Fungsi utility kecil yang bisa digunakan di banyak tempat. |
| `assets/` | Gambar, ikon, dan file aset lainnya. |

---

## 🚀 Cara Menjalankan

### Prasyarat

- Node.js versi 18 atau lebih baru
- npm versi 9 atau lebih baru

### Langkah-langkah

#### 1. Clone Repository

```bash
git clone <url-repository>
cd smk_project/frontend
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Setup Environment Variables

Buat file `.env` di folder `frontend/`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Catatan:** Untuk development awal, file `.env` sudah tersedia. Jika belum ada, minta ke ketua tim.

#### 4. Jalankan Development Server

```bash
npm run dev
```

Akses website di **http://localhost:5173**

#### 5. Build untuk Production

```bash
npm run build
```

Hasil build akan tersimpan di folder `dist/`.

---

## ✅ Progress Saat Ini

### Sudah Selesai

| Bagian | Status | Keterangan |
|--------|--------|------------|
| Setup React + Vite | ✅ Selesai | Project scaffold dengan React 19 |
| Setup Tailwind CSS | ✅ Selesai | Tailwind CSS v4 dengan custom theme |
| Setup Supabase | ✅ Selesai | Client Supabase siap digunakan |
| Setup GitHub Repository | ✅ Selesai | Repository sudah terhubung |
| **Landing Page** | ✅ **Selesai** | **Semua section sudah jadi** |

### Landing Page — Detail Section

| Section | Status | Komponen |
|---------|--------|----------|
| Navbar | ✅ Selesai | `Navbar.jsx` — Sticky, blur, mobile drawer, active highlight |
| Hero | ✅ Selesai | `HeroSection.jsx` — Dua kolom, stats, animasi |
| Feature | ✅ Selesai | `FeatureSection.jsx` — 4 card layanan |
| Tentang | ✅ Selesai | `AboutSection.jsx` — Profil sekolah, highlights |
| Jurusan | ✅ Selesai | `DepartmentsSection.jsx` — 4 jurusan (RPL, TKJ, MM, SI) |
| Partner Industri | ✅ Selesai | `PartnersSection.jsx` — Auto slider infinite |
| Prestasi | ✅ Selesai | `AchievementsSection.jsx` — 4 card prestasi |
| STELA AI | ✅ Selesai | `StelaAISection.jsx` — Chat preview, dark theme |
| CTA | ✅ Selesai | `CTASection.jsx` — Background merah, call to action |
| Footer | ✅ Selesai | `Footer.jsx` — Dark theme, links, kontak, maps |

---

## 📋 Yang Belum Dibuat

### Halaman Frontend

| Halaman | Prioritas | Keterangan |
|---------|-----------|------------|
| Profil Sekolah | 🔴 Tinggi | Informasi detail tentang sekolah |
| Jurusan Detail | 🔴 Tinggi | Halaman detail masing-masing jurusan |
| Prestasi | 🔴 Tinggi | Galeri prestasi lengkap |
| Berita | 🔴 Tinggi | Daftar berita dan artikel |
| Pengumuman | 🔴 Tinggi | Pengumuman resmi sekolah |
| BKK | 🔴 Tinggi | Bursa Kerja Khusus |
| PPDB | 🔴 Tinggi | Pendaftaran Peserta Didik Baru |

### Dashboard Admin

| Fitur | Prioritas | Keterangan |
|-------|-----------|------------|
| Login Admin | 🔴 Tinggi | Autentikasi admin |
| Dashboard | 🔴 Tinggi | Overview data sekolah |
| Sidebar Navigation | 🔴 Tinggi | Navigasi sidebar dashboard |
| Header | 🔴 Tinggi | Header dashboard dengan user info |
| CRUD Berita | 🔴 Tinggi | Create, Read, Update, Delete berita |
| CRUD Pengumuman | 🔴 Tinggi | Create, Read, Update, Delete pengumuman |
| CRUD Prestasi | 🔴 Tinggi | Create, Read, Update, Delete prestasi |
| CRUD BKK | 🔴 Tinggi | Create, Read, Update, Delete lowongan BKK |
| Data PPDB | 🔴 Tinggi | Melihat dan mengelola data pendaftar |

### Supabase Integration

| Fitur | Prioritas | Keterangan |
|-------|-----------|------------|
| Database Schema | 🟡 Sedang | Rancangan tabel dan relasi |
| Authentication | 🟡 Sedang | Login admin, guru, siswa |
| Storage | 🟡 Sedang | Upload gambar dan dokumen |
| Row Level Security | 🟡 Sedang | Keamanan data per role |

---

## 🔄 Panduan Git

### Setiap Kali Memulai Coding

```bash
git pull
```

> **Penting:** Selalu `git pull` sebelum mulai coding untuk mendapatkan update terbaru dari tim.

### Setelah Selesai Coding

```bash
# Cek file yang berubah
git status

# Tambahkan semua perubahan
git add .

# Commit dengan pesan yang jelas
git commit -m "feat: menambahkan halaman dashboard admin"

# Push ke repository
git push
```

### Format Pesan Commit

Gunakan format berikut agar pesan commit rapi dan konsisten:

| Prefix | Keterangan |
|--------|------------|
| `feat:` | Menambahkan fitur baru |
| `fix:` | Memperbaiki bug |
| `style:` | Perubahan styling (CSS, Tailwind) |
| `refactor:` | Perubahan kode tanpa mengubah fungsionalitas |
| `docs:` | Perubahan dokumentasi |
| `chore:` | Tugas rutin (setup, config) |

**Contoh:**

```bash
git commit -m "feat: membuat komponen sidebar dashboard"
git commit -m "fix: memperbaiki navbar tidak sticky di mobile"
git commit -m "style: menyesuaikan warna button PPDB"
```

---

## 👨‍💻 Tugas Reiner

Halo Reiner! 👋

Selamat bergabung di tim! Berikut adalah tugas yang perlu kamu kerjakan:

### 📌 Yang Perlu Kamu Tahu

1. **Landing Page sudah selesai** 🎉 — Kamu tidak perlu mengubahnya, kecuali jika menemukan bug atau ada diskusi terlebih dahulu dengan tim.

2. **Fokus utama kamu adalah Dashboard Admin**.

### 🎯 Prioritas Utama: Dashboard Admin

Dashboard Admin adalah halaman yang digunakan oleh admin sekolah untuk mengelola konten website. Dashboard ini **belum perlu dihubungkan ke database** — fokus dulu pada UI/UX menggunakan React.

#### Yang Harus Dibuat:

#### 1. Login Page
- Form login dengan email dan password
- Desain modern dengan ilustrasi
- Validasi form sederhana
- **File:** `src/pages/Login.jsx`

#### 2. Dashboard Layout
- Sidebar navigasi
- Header dengan user info
- Konten utama
- **File:** `src/layouts/DashboardLayout.jsx`

#### 3. Sidebar Navigation
- Menu: Dashboard, Berita, Pengumuman, Prestasi, BKK, PPDB
- Icon untuk setiap menu
- Active menu highlight
- Collapsible di mobile

#### 4. Dashboard Page
- Cards: Total Berita, Total Pengumuman, Total Prestasi, Pendaftar PPDB
- Grafik atau statistik sederhana
- Welcome message

#### 5. CRUD Berita
- Tabel daftar berita
- Tombol Tambah, Edit, Hapus
- Modal/Form untuk tambah/edit berita
- Kolom: Judul, Konten, Gambar, Tanggal, Status

#### 6. CRUD Pengumuman
- Sama seperti CRUD Berita
- Kolom: Judul, Konten, Tanggal, Status

#### 7. CRUD Prestasi
- Tabel daftar prestasi
- Tombol Tambah, Edit, Hapus
- Kolom: Judul, Kategori, Deskripsi, Gambar, Tanggal

#### 8. CRUD BKK
- Tabel lowongan kerja
- Tombol Tambah, Edit, Hapus
- Kolom: Perusahaan, Posisi, Deskripsi, Deadline, Status

#### 9. Data PPDB
- Tabel daftar pendaftar
- Filter status (diterima, ditunda, ditolak)
- Detail pendaftar

### 📁 Struktur Dashboard yang Disarankan

```
src/
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── StatCard.jsx
│   │   ├── DataTable.jsx
│   │   ├── Modal.jsx
│   │   └── FormInput.jsx
│   │
│   └── ... (komponen landing page yang sudah ada)
│
├── pages/
│   ├── dashboard/
│   │   ├── DashboardPage.jsx
│   │   ├── BeritaPage.jsx
│   │   ├── PengumumanPage.jsx
│   │   ├── PrestasiPage.jsx
│   │   ├── BKKPage.jsx
│   │   └── PPDBPage.jsx
│   │
│   ├── LandingPage.jsx
│   └── Login.jsx
│
├── layouts/
│   ├── MainLayout.jsx
│   └── DashboardLayout.jsx
│
├── data/
│   └── dummyData.js      # Data dummy untuk development
```

### 💡 Tips untuk Reiner

- Gunakan komponen yang **reusable** (contoh: `DataTable`, `Modal`, `FormInput`)
- Gunakan **Tailwind CSS** untuk styling, jangan inline CSS
- Gunakan **penamaan file PascalCase** (contoh: `Sidebar.jsx`, `DataTable.jsx`)
- Gunakan **React Functional Component** dengan arrow function
- Simpan **data dummy** di file `data/dummyData.js` untuk sementara
- **Commit secara berkala** dengan pesan commit yang jelas
- Jika ada yang tidak jelas, **tanya ke tim** — jangan diam saja!

---

## 📝 Aturan Proyek

Agar project tetap rapi dan konsisten, ikuti aturan berikut:

### 1. Landing Page
- ❌ **Jangan mengubah** Landing Page tanpa diskusi dengan tim terlebih dahulu
- ❌ **Jangan menghapus** komponen yang sudah dibuat
- ❌ **Jangan mengubah** struktur Landing Page tanpa persetujuan
- ✅ Jika menemukan **bug**, laporkan dan diskusikan sebelum memperbaiki

### 2. Struktur Folder
- ❌ **Jangan mengubah** struktur folder sembarangan
- ✅ Tambahkan folder baru jika diperlukan, tapi diskusikan dulu
- ✅ Ikuti struktur folder yang sudah ditentukan

### 3. Coding Style
- ✅ Gunakan **React Functional Component**
- ✅ Gunakan **penamaan file PascalCase** (contoh: `Sidebar.jsx`)
- ✅ **Pisahkan setiap section** menjadi komponen tersendiri
- ✅ Gunakan **Tailwind CSS** untuk semua styling
- ❌ **Jangan gunakan inline CSS**
- ❌ **Jangan gunakan Bootstrap, jQuery, Material UI**

### 4. Data
- ✅ Gunakan **data dummy** di folder `data/` untuk development
- ❌ **Jangan hardcode data** yang nantinya akan menggunakan Supabase
- ✅ Simpan data dummy di file terpisah agar mudah diganti nanti

### 5. Git
- ✅ **Commit secara berkala** — jangan menumpuk banyak perubahan
- ✅ Gunakan **pesan commit yang jelas** (lihat format di atas)
- ✅ **Push setiap hari** agar tim bisa melihat progress
- ✅ **Pull sebelum mulai coding** untuk mendapatkan update terbaru

### 6. Komunikasi
- ✅ Jika ada yang tidak jelas, **tanya ke tim**
- ✅ Jika ingin mengubah sesuatu yang sudah jadi, **diskusikan dulu**
- ✅ Laporkan **progress** secara rutin

---

## 🎯 Target Akhir

Fitur yang harus selesai:

| Fitur | Status Target |
|-------|---------------|
| ✅ Landing Page Modern | ✅ Selesai |
| ✅ Navbar + Footer | ✅ Selesai |
| 🔄 Dashboard Admin | 🟡 Dalam Pengerjaan |
| ⏳ PPDB Online | ⬜ Belum |
| ⏳ STELA AI | ⬜ Belum (Frontend sudah) |
| ⏳ NextTel AI | ⬜ Belum |
| ⏳ Responsive | ✅ Selesai (Landing Page) |
| ⏳ Mudah Dikembangkan | ✅ Arsitektur sudah modular |

---

## 📞 Kontak

Jika ada pertanyaan atau butuh bantuan, hubungi:

| Nama | Role | Kontak |
|------|------|--------|
| [Nama Ketua Tim] | Project Lead / Frontend | [Email/Discord] |
| Reiner | Frontend Developer | [Email/Discord] |

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