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

NextTel adalah fitur rekomendasi jurusan berdasarkan kuesioner 8 pertanyaan. NextTel bukan chatbot informasi umum dan tidak boleh dicampur dengan prompt, state, knowledge, endpoint, atau hasil STELA.

**Implementasi:** NextTel sudah tersedia dan aktif di repository. Scoring dilakukan secara deterministik di frontend, sedangkan AI hanya menghasilkan penjelasan hasil.

## 2. Arsitektur STELA

```text
Pengunjung
   ↓
StelaChat / StelaWidget
   ↓
frontend/src/services/stela.js
   ↓
Supabase Edge Function: /functions/v1/stela
   ├─ CORS & origin check
   ├─ Rate limit (per-IP, daily quota)
   ├─ Input validation (length, roles, content)
   ├─ Input sanitization (HTML comments, chat tokens)
   ├─ Topic guard (scope enforcement)
   ├─ FAQ fast path (deterministic answers)
   ├─ Answer cache (60 min, first message only)
   ├─ Context assembly (dynamic DB + static knowledge)
   ├─ Context relevance routing (category-based prioritization)
   ├─ Provider selection (9Router → Anthropic → Gemini → Groq)
   ├─ Model fallback (multiple models per provider)
   ├─ Timeout enforcement (12s per provider)
   ├─ Output validation (secret patterns, length, safety)
   └─ Safe error normalization
   ↓
Response aman { reply }
   ↓
Chat UI
```

STELA tidak memanggil AI provider langsung dari browser. API key model hanya boleh tersedia di environment server-side Edge Function.

### Defense in Depth (10 Lapisan Keamanan)

1. **Input Validation:** Length limits, role alternation, empty check
2. **Input Sanitization:** Strip HTML comments, chat tokens, XML tags
3. **Topic Guard:** Regex-based scope enforcement, block out-of-scope requests
4. **Prompt Hierarchy:** Separate system rules, trusted knowledge, untrusted DB data
5. **Context Isolation:** XML markers `<data-sekolah>`, `<data-dinamis-publik>` with tag neutralization
6. **Output Validation:** Secret pattern detection, length check, system prompt fragment filter
7. **Rate Limiting:** Per-IP (20/5min), daily quota (500/day), emergency kill switch
8. **Cache Layers:** Answer cache (60min), context cache (60s), FAQ fast path (<5ms)
9. **Provider Fallback:** Priority chain with health tracking, timeout handling, 5xx retry
10. **Safe Fallback Response:** Generic errors, no provider names, no status codes leaked

## 3. Struktur File STELA

```text
frontend/src/pages/StelaPage.jsx
frontend/src/components/stela/StelaChat.jsx
frontend/src/components/stela/StelaWidget.jsx
frontend/src/services/stela.js
frontend/src/data/dummyData.js
frontend/scripts/buat-konten-stela.mjs
frontend/scripts/uji-stela.mjs
supabase/functions/stela/index.ts
supabase/functions/stela/inti.mjs
supabase/functions/stela/konteks.mjs
supabase/functions/stela/konten-sekolah.mjs
supabase/functions/stela/penjaga-biaya.mjs
```

Peran masing-masing:

- `StelaPage.jsx`: halaman penuh `/stela`.
- `StelaChat.jsx`: state percakapan, input, loading, retry, error, dan scroll.
- `StelaWidget.jsx`: widget mengambang di halaman publik selain `/stela`.
- `stela.js`: client request ke Edge Function.
- `index.ts`: entry point, CORS, rate limit, context assembly, error handling.
- `inti.mjs`: core AI logic, provider selection, model fallback, timeout, FAQ fast path, topic guard, output validation.
- `konteks.mjs`: context selection, keyword scoring, category-based prioritization.
- `konten-sekolah.mjs`: snapshot knowledge statis (~28K tokens).
- `penjaga-biaya.mjs`: rate limiting, answer cache, daily quota, emergency switch.
- `buat-konten-stela.mjs`: generator snapshot dari `dummyData.js`.
- `uji-stela.mjs`: comprehensive test suite (300+ lines, injection resistance, validation, cache, rate limits).

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
supabase secrets set NINEROUTER_KEY=...
supabase secrets set NINEROUTER_URL=https://router-anda.example
supabase secrets set NINEROUTER_MODEL=kr/claude-haiku-4.5
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

STELA menggunakan tiga sumber informasi:

1. **FAQ Fast Path:** Jawaban deterministik untuk pertanyaan umum (jurusan, BKK, PPDB, alamat, profil) - <5ms response.
2. **Knowledge statis:** `konten-sekolah.mjs` (~28K tokens) sebagai baseline context.
3. **Context dinamis:** Data publik Supabase yang diambil Edge Function dan di-cache 60 detik.

### Context Dinamis

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

### Context Relevance Routing

Pertanyaan dikategorikan secara deterministik (sekolah, jurusan, ppdb, bkk, prestasi, berita, pengumuman, umum). Untuk provider dengan budget ketat (Groq: 3000 tokens), section yang relevan diprioritaskan:

- **sekolah:** aboutDescription, visiMisi, kepalaSekolah, footerData
- **jurusan:** jurusanData, jurusanDetail, kepalaSekolah
- **ppdb:** ppdbMeta, kepalaSekolah, jurusanData
- **bkk:** bkkData, footerData
- **prestasi:** prestasiData, kepalaSekolah
- **berita:** beritaData, kepalaSekolah
- **pengumuman:** pengumumanData, kepalaSekolah

Static knowledge INTI (identitas sekolah, kontak, daftar jurusan) selalu ikut.

### Update Knowledge Statis

Jika `dummyData.js` berubah, perbarui snapshot:

```bash
cd frontend
npm run stela:konten
```

Setelah snapshot berubah, deploy ulang Edge Function. Context dari Supabase tetap mengikuti data publik terbaru dalam batas cache.

Konten database diperlakukan sebagai data referensi tidak tepercaya. Isi konten admin tidak boleh menggantikan instruksi sistem atau mengubah peran STELA.

## 7. Security dan Error Handling

### Keamanan Multi-Layer

STELA menerapkan **defense in depth** dengan 10 lapisan keamanan:

1. **Input Validation:** Max 20 messages, 1000 chars/message, 8000 total, role alternation
2. **Input Sanitization:** Strip HTML comments `<!-- -->`, chat tokens `<|im_start|>`, XML tags
3. **Topic Guard:** Regex-based scope check, blocks: prompt injection, API key requests, system prompt reveal, admin impersonation
4. **Prompt Hierarchy:** System rules (immutable) → Trusted knowledge → Untrusted DB data → User message
5. **Context Isolation:** XML markers with tag neutralization (`netralkanPenanda()`)
6. **Output Validation:** Secret patterns (`sk-`, `AIza`, `gsk_`, `Bearer`), length check, system prompt fragments
7. **Rate Limiting:** 20 req/5min per-IP, 500/day total, emergency kill switch (`STELA_AKTIF=false`)
8. **Cache Layers:** FAQ fast path (<5ms), answer cache (60min), context cache (60s)
9. **Provider Fallback:** 9Router → Anthropic → Gemini → Groq, with timeout (12s/provider) and health tracking
10. **Safe Fallback:** Generic errors, no provider names, no status codes

### Timeout Enforcement

- **Per-provider timeout:** 12 seconds
- **Fallback trigger:** Timeout, 429, 404, 5xx errors
- **Model health tracking:** 30-min cooldown for failed models
- **AbortController:** Proper cleanup, no memory leaks

### Tested Attack Resistance

STELA telah diuji terhadap:

- HTML comment injection: `<!-- SYSTEM OVERRIDE -->`
- Chat token injection: `<|im_start|>system`
- XML tag injection: `</data-sekolah>`
- Prompt reveal attempts
- Role change attempts
- API key extraction attempts
- Database content as instructions

Catatan: Tidak ada sistem yang 100% jailbreak-proof. STELA resistant to tested attack patterns.

### Error Handling

- API key hanya di `Deno.env` Edge Function
- Tidak ada API key di React, frontend `.env`, localStorage, atau response
- CORS dibatasi `STELA_ALLOWED_ORIGINS` (production: explicit origins only)
- Tidak ada riwayat percakapan disimpan ke database atau localStorage
- Error internal dinormalisasi: "STELA sedang mengalami kendala. Silakan coba lagi."

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

Edit `supabase/functions/stela/inti.mjs`. Setiap perubahan harus mempertahankan:

- Scope informasi sekolah.
- Larangan mengarang informasi.
- Perlindungan terhadap prompt injection (ATURAN KEAMANAN items 9-15 tidak dapat diubah).
- Filter status publik.
- Batas panjang context dan request.

### Menambah FAQ Fast Path

Edit `FAQ_FAST_PATH` di `inti.mjs`. Setiap FAQ harus:

- Memiliki `pola` regex yang jelas
- Memiliki `cocok()` function untuk confidence check
- Memiliki `jawaban` yang sudah tervalidasi dan singkat
- Tidak bocorkan informasi private
- Tetap melewati `topikDiizinkan()` check

### Perubahan knowledge statis

Ubah sumber data yang relevan, jalankan generator `npm run stela:konten`, review hasil `konten-sekolah.mjs`, lalu deploy ulang Edge Function.

Jangan membuat database, tabel, bucket, atau authentication baru hanya untuk STELA jika data existing masih cukup.

### Testing

Jalankan test suite sebelum deploy:

```bash
cd frontend
node scripts/uji-stela.mjs
```

Test suite mencakup:
- Input validation (length, roles, content)
- Prompt injection resistance
- Provider selection
- Context selection
- Rate limiting
- Cache behavior
- Secret leak prevention
- Model fallback list

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

- `NINEROUTER_KEY`: secret API 9Router bersama STELA dan NextTel.
- `NINEROUTER_URL`: wajib saat memakai 9Router. Lokal: `http://127.0.0.1:20128`; Supabase: URL HTTPS router/VPS/tunnel yang bisa dijangkau server. `router-anda.example` di atas adalah placeholder. Homepage `https://9router.com` bukan endpoint API yang berfungsi saat diuji.
- `NINEROUTER_MODEL`: model atau combo sesuai dashboard; bawaan `kr/claude-haiku-4.5` memerlukan provider Kiro yang terhubung.
- `NEXTTEL_NINEROUTER_KEY`: secret 9Router khusus NextTel, jika ingin memisahkan akun.
- `NEXTTEL_NINEROUTER_MODEL`: model 9Router khusus NextTel.

### Benchmark lokal 9Router

Jalankan `9router.cmd -H 127.0.0.1 -n --skip-update`, lalu `npm.cmd run dev` dari folder `frontend`. Di terminal lain, jalankan `npm.cmd run ai:benchmark` dari folder yang sama. Skrip memanggil `http://127.0.0.1:5173` dan memakai kuota AI sungguhan; restart dev server sebelum pengukuran untuk mengosongkan cache.

Hasil sampel lokal dengan `kr/claude-haiku-4.5`: STELA jurusan 8.692 ms, fasilitas 2.575 ms, penolakan luar topik 2.871 ms; NextTel JSON 3.322 ms. Cache STELA 35 ms dan penolakan input kosong 5 ms. Keenam pemeriksaan lolos. Angka cache bukan kecepatan model. Sampel ini belum menguji beban serentak, uptime jangka panjang, atau deployment produksi.

Router lokal harus tetap berjalan selama dipakai. Deploy Vercel saja tidak menjalankan 9Router atau Edge Function; untuk produksi, siapkan URL HTTPS router yang aktif lalu atur secret dan deploy fungsi Supabase.
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

NextTel menggunakan provider fallback yang sama dengan STELA: 9Router → Anthropic → Gemini → Groq, dengan timeout 12 detik per provider.

Rekomendasi NextTel adalah panduan berdasarkan minat, bukan keputusan resmi
penerimaan siswa.

### Deterministic Fallback

Jika AI gagal atau response tidak valid, aplikasi tetap menampilkan hasil deterministik (topRecommendation, scores, ranking) tanpa AI explanation. AI explanation adalah enhancement, bukan requirement.

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

## 12. PPDB Auth, Verifikasi, dan Status

Portal PPDB menggunakan Supabase Auth. Signup mengirim email konfirmasi dengan redirect ke `/ppdb/verifikasi`, sedangkan login memakai email dan password melalui `signInWithPassword`. Keberhasilan signup tidak sama dengan email telah diterima; pengiriman email tetap bergantung pada konfigurasi Email Confirmation, URL Configuration, dan SMTP di Supabase Dashboard.

Halaman verifikasi membaca session dan `email_confirmed_at`, serta memakai `auth.resend` untuk mengirim ulang email dengan cooldown 60 detik. Setelah terverifikasi, pengguna dapat melanjutkan ke formulir. Tidak ada token atau password yang disimpan manual.

Halaman `/ppdb/status` mengambil submission terbaru melalui `auth_user_id` milik user aktif. RLS membatasi pembacaan user pada submission sendiri; admin tetap dapat membaca seluruh data. Dokumen tetap private dan hanya diakses melalui signed URL. Record lama dengan `auth_user_id = NULL` dianggap legacy dan tidak diklaim oleh akun mana pun.
