# Dokumentasi AI — STELA dan NextTel

Dokumen ini menjelaskan penggunaan, struktur, keamanan, dan cara pengembangan fitur AI pada platform Digital Smart School SMK Telkom Purwokerto.

## 1. Pembagian Peran

### STELA AI

STELA (Stematel Learning Asistant) adalah chatbot umum untuk membantu pengunjung memahami informasi tentang SMK Telkom Purwokerto, meliputi:

- Profil sekolah dan fasilitas.
- Program keahlian.
- Kegiatan sekolah.
- Prestasi.
- BKK dan informasi lowongan.
- PPDB.
- Berita, pengumuman, dan kontak sekolah.

STELA hanya menjawab berdasarkan knowledge sekolah. Jika informasi tidak tersedia, STELA harus menyatakan bahwa informasi tersebut belum tersedia dan mengarahkan pengguna untuk menghubungi Tata Usaha.

### NextTel AI

NextTel adalah fitur terpisah untuk rekomendasi jurusan berdasarkan minat dan kebutuhan pengguna. NextTel bukan chatbot informasi umum dan tidak boleh dicampur dengan prompt, state, knowledge, endpoint, atau hasil STELA.

Implementasi NextTel belum tersedia di repository ini. Ketika dikembangkan, module, endpoint, prompt, dan state-nya harus dibuat terpisah.

## 2. Arsitektur STELA

```text
Pengunjung
   ↓
StelaChat / StelaWidget
   ↓
frontend/src/services/stela.js
   ↓
Supabase Edge Function: /functions/v1/stela
   ├─ validasi request
   ├─ context publik Supabase sesuai RLS
   ├─ knowledge statis fallback
   └─ Anthropic API
   ↓
Response aman { reply }
   ↓
Chat UI
```

STELA tidak memanggil Anthropic langsung dari browser. API key model hanya boleh tersedia di environment server-side Edge Function.

## 3. Struktur File STELA

```text
frontend/src/pages/StelaPage.jsx
frontend/src/components/stela/StelaChat.jsx
frontend/src/components/stela/StelaWidget.jsx
frontend/src/services/stela.js
frontend/src/data/dummyData.js
frontend/scripts/buat-konten-stela.mjs
supabase/functions/stela/index.ts
supabase/functions/stela/konten-sekolah.ts
supabase/functions/stela/README.md
```

Peran masing-masing:

- `StelaPage.jsx`: halaman penuh `/stela`.
- `StelaChat.jsx`: state percakapan, input, loading, retry, error, dan scroll.
- `StelaWidget.jsx`: widget mengambang di halaman publik selain `/stela`.
- `stela.js`: client request ke Edge Function.
- `index.ts`: validasi, keamanan, context, rate limit, dan request ke Anthropic.
- `konten-sekolah.ts`: snapshot knowledge statis/fallback.
- `buat-konten-stela.mjs`: generator snapshot dari `dummyData.js`.

## 4. Cara Menggunakan STELA

Jalankan frontend dari folder `frontend`:

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:5173/stela
```

STELA juga tersedia sebagai widget di halaman publik. Gunakan Enter untuk mengirim pesan dan Shift+Enter untuk membuat baris baru. Selama request berlangsung, tombol kirim dinonaktifkan. Jika request gagal, gunakan tombol **Coba lagi**.

Contoh pertanyaan yang sesuai:

- Apa jurusan yang ada di SMK Telkom Purwokerto?
- Apa itu BKK?
- Bagaimana cara daftar PPDB?
- Prestasi apa yang pernah diraih sekolah?

Pertanyaan di luar informasi sekolah harus ditolak dengan sopan. STELA tidak boleh mengarang biaya, kuota, tanggal, persyaratan, atau status resmi.

## 5. Konfigurasi Environment

### Frontend

Simpan di `frontend/.env` dan jangan commit file tersebut:

```env
VITE_SUPABASE_URL=https://project-id.supabase.co
VITE_SUPABASE_ANON_KEY=publishable-or-anon-key
```

Key frontend adalah key publik untuk Supabase, bukan `service_role` key.

### Supabase Edge Function

Set secret melalui Supabase CLI atau dashboard:

```bash
supabase secrets set ANTHROPIC_API_KEY=...
supabase secrets set STELA_MODEL=...
supabase secrets set STELA_ALLOWED_ORIGINS=https://domain-website-anda.example,http://localhost:5173
```

Environment `SUPABASE_URL` dan `SUPABASE_ANON_KEY` digunakan Edge Function untuk membaca context publik. Keduanya harus memakai akses yang tunduk pada RLS. Jangan menggantinya dengan `service_role` key.

Deploy function dari root repository:

```bash
supabase functions deploy stela
```

`STELA_ALLOWED_ORIGINS` wajib berisi origin frontend yang sah, dipisahkan koma. Jangan memakai wildcard pada production.

## 6. Knowledge dan Context

STELA menggunakan dua sumber informasi:

1. Knowledge statis pada `konten-sekolah.ts` sebagai fallback.
2. Context dinamis dari data publik Supabase yang diambil Edge Function dan di-cache singkat.

Context dinamis hanya mencakup:

- Berita dengan status `published`.
- Pengumuman dengan status `published`.
- Prestasi publik.
- BKK dengan status `aktif`.

STELA tidak membaca:

- Data PPDB.
- Tabel `admins`.
- Berita atau pengumuman draft.
- Dokumen private Storage.

Jika `dummyData.js` berubah, perbarui snapshot:

```bash
cd frontend
npm run stela:konten
```

Setelah snapshot berubah, deploy ulang Edge Function. Context dari Supabase tetap mengikuti data publik terbaru dalam batas cache.

Konten database diperlakukan sebagai data referensi tidak tepercaya. Isi konten admin tidak boleh menggantikan instruksi sistem atau mengubah peran STELA.

## 7. Security dan Error Handling

- API key Anthropic hanya dibaca dari `Deno.env` di Edge Function.
- Tidak ada API key model di React, `.env` frontend, localStorage, atau response.
- Request dibatasi maksimal 20 pesan.
- Panjang setiap pesan maksimal 1.000 karakter.
- Total percakapan maksimal 8.000 karakter.
- Pesan harus diawali user dan bergantian dengan assistant.
- Pesan terakhir harus berasal dari user.
- Rate limit diberlakukan per alamat IP pada memory isolate.
- CORS dibatasi melalui `STELA_ALLOWED_ORIGINS`.
- Tidak ada riwayat percakapan yang disimpan ke database atau localStorage.
- Error internal tidak diteruskan ke browser.

Pesan error frontend yang digunakan:

```text
STELA sedang mengalami kendala. Silakan coba lagi.
```

## 8. Cara Mengembangkan STELA

### Perubahan UI

Edit komponen di `frontend/src/components/stela/` atau halaman `StelaPage.jsx`. Pertahankan:

- Welcome message.
- Input keyboard Enter/Shift+Enter.
- Loading indicator.
- Retry.
- Auto-scroll.
- Responsive layout.

### Perubahan request frontend

Edit `frontend/src/services/stela.js`. Pertahankan endpoint existing, anon key Supabase, dukungan `AbortSignal`, dan normalisasi error.

### Perubahan prompt dan context

Edit `supabase/functions/stela/index.ts`. Setiap perubahan harus mempertahankan:

- Scope informasi sekolah.
- Larangan mengarang informasi.
- Perlindungan terhadap prompt injection.
- Filter status publik.
- Batas panjang context dan request.

### Perubahan knowledge statis

Ubah sumber data yang relevan, jalankan generator `npm run stela:konten`, review hasil `konten-sekolah.ts`, lalu deploy ulang Edge Function.

Jangan membuat database, tabel, bucket, atau authentication baru hanya untuk STELA jika data existing masih cukup.

## 9. NextTel

NextTel adalah sistem rekomendasi jurusan, bukan chatbot informasi umum. STELA tetap
menjawab profil sekolah, berita, pengumuman, BKK, PPDB, dan fasilitas; NextTel hanya
membantu calon siswa membaca kecenderungan minat terhadap jurusan.

### Struktur

- `frontend/src/pages/NextTelPage.jsx`: state questionnaire, scoring, dan alur hasil.
- `frontend/src/components/nexttel/`: intro, progress, pertanyaan, dan hasil.
- `frontend/src/services/nexttel.js`: satu-satunya pemanggil Edge Function NextTel.
- `supabase/functions/nexttel/index.ts`: validasi request dan penjelasan AI server-side.

NextTel tidak menggunakan service, endpoint, state, atau system prompt STELA.

### Cara menggunakan

Buka `/nexttel`, tekan “Mulai sekarang”, lalu jawab 8 pertanyaan. Setelah selesai,
halaman menampilkan jurusan utama, skor semua jurusan, alternatif, penjelasan AI, dan
tips belajar. Tombol kembali, mulai ulang, retry, dan state loading/error tersedia.

Jurusan resmi yang digunakan hanya:

- Rekayasa Perangkat Lunak (RPL)
- Pengembangan Game (PG)
- Teknik Komputer dan Jaringan (TKJ)
- Teknik Jaringan Akses Telekomunikasi (TJAT)

### Scoring deterministic

Scoring dilakukan di browser dan tidak diserahkan kepada model AI. Setiap jawaban
memiliki satu jurusan utama dengan bobot `+3` dan satu jurusan yang beririsan dengan
bobot `+1`:

| Jawaban | Skor |
| --- | --- |
| A | RPL +3, PG +1 |
| B | PG +3, RPL +1 |
| C | TKJ +3, TJAT +1 |
| D | TJAT +3, TKJ +1 |

Jika skor seri, urutan prioritas tetap adalah RPL, PG, TKJ, lalu TJAT. Input yang
sama selalu menghasilkan rekomendasi yang sama.

### Edge Function dan kontrak

Frontend mengirim `answers`, `scores`, dan `topRecommendation` ke
`/functions/v1/nexttel`. Edge Function hanya meminta model membuat:

- `explanation`
- `strengths`
- `learningSuggestions`

Model tidak boleh menghitung ulang skor, mengubah rekomendasi, menambah jurusan,
menjanjikan penerimaan, atau mengaku sebagai panitia PPDB. Response hanya berupa JSON
yang sudah divalidasi dan dipangkas ukurannya.

Konfigurasi Supabase Edge Function:

- `NEXTTEL_ANTHROPIC_API_KEY`: secret API Anthropic khusus NextTel.
- `NEXTTEL_MODEL`: model ID yang tersedia pada akun Anthropic.
- `NEXTTEL_ALLOWED_ORIGINS`: daftar origin frontend dipisahkan koma.

Frontend hanya memakai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` untuk memanggil
function. API key Anthropic tidak boleh berada di React, `.env` frontend,
localStorage, response, atau log.

### Keamanan dan batasan

Request divalidasi sebagai JSON, dibatasi 8 jawaban dan ukuran body, hanya menerima
empat kode jurusan, dan dilindungi allowlist CORS serta rate limit in-memory. Tidak
ada database atau penyimpanan hasil rekomendasi. Error internal selalu dinormalisasi
menjadi:

```text
NextTel sedang mengalami kendala. Silakan coba lagi.
```

Rekomendasi NextTel adalah panduan berdasarkan minat, bukan keputusan resmi
penerimaan siswa.

### Pengembangan dan testing

Perubahan pertanyaan atau bobot dilakukan di `NextTelPage.jsx`; pertahankan kode
jurusan, matriks scoring, dan tie-break agar hasil tetap deterministic. Perubahan
request dilakukan di `frontend/src/services/nexttel.js`, sedangkan prompt dan validasi
server dilakukan di Edge Function.

Uji minimal: empat skenario mayoritas RPL/PG/TKJ/TJAT, jawaban campuran, input yang
sama menghasilkan skor yang sama, retry, restart, request malformed, origin tidak
terdaftar, model/API key tidak tersedia, dan static scan agar secret tidak masuk
frontend. Jalankan `npm run lint` dan `npm run build` dari folder `frontend`.

## 10. Testing dan Troubleshooting

### Checklist frontend

- Buka `/stela`.
- Kirim pertanyaan sederhana.
- Kirim beberapa pesan berurutan.
- Uji Enter dan Shift+Enter.
- Uji loading dan tombol retry.
- Tutup halaman saat request berjalan dan pastikan request di-abort.
- Uji viewport mobile.
- Uji input maksimal 1.000 karakter.
- Reload halaman dan pastikan chat tidak disimpan permanen.

### Checklist Edge Function

- Context hanya berisi data publik.
- Draft tidak masuk context.
- PPDB dan data admin tidak masuk context.
- Prompt injection tidak mengubah aturan sistem.
- Origin tidak terdaftar ditolak.
- Rate limit bekerja.
- API key atau model yang belum dikonfigurasi menghasilkan error aman.
- Anthropic unavailable menghasilkan error aman.

### Validasi lokal

```bash
cd frontend
npm run lint
npm run build
```

Deno dan Supabase CLI diperlukan untuk validasi/deploy Edge Function. Jika tool tersebut tidak tersedia secara lokal, lakukan review statis dan validasi function melalui environment Supabase.

## 11. Aturan Perubahan

- Jangan memasukkan secret ke repository.
- Jangan memakai `service_role` key di frontend.
- Jangan mematikan RLS.
- Jangan mencampur STELA dan NextTel.
- Jangan mengubah CRUD, PPDB, migration, atau halaman publik lain tanpa kebutuhan langsung.
- Setelah perubahan, jalankan lint, build, static security scan, dan uji Edge Function sebelum deployment.
