# STELA — chatbot situs SMK Telkom Purwokerto

Edge Function yang menjembatani widget chat di browser dengan penyedia AI.

Mendukung **Anthropic (Claude)**, **Google Gemini**, dan **Groq**. Yang dipakai
ditentukan oleh kunci mana yang terisi — tidak ada sakelar terpisah yang bisa
lupa disetel. Urutan prioritas: Anthropic, Gemini, Groq.

### Catatan model Gemini

Daftar `/v1beta/models` **memuat model yang tidak bisa dipakai akun baru.**
`gemini-2.5-flash` muncul di daftar tapi menjawab 404 dengan pesan
*"no longer available to new users"*; `gemini-2.0-flash` sudah hilang sama
sekali. Jadi kalau mengganti versi, uji dengan `generateContent` sungguhan —
membaca daftar model saja tidak cukup.

Parameter thinking juga berbeda antar generasi: seri 2.5 memakai
`thinkingBudget`, seri 3.x menolaknya dengan 400 dan memakai `thinkingLevel`.

### Memilih penyedia

| | Gratis | Prompt penuh (28 rb token) | Praktisnya |
| --- | --- | --- | --- |
| **Gemini** | ya, permanen | muat | pilihan terbaik untuk situs publik |
| **Groq** | ya, tapi 8.000 token/menit | **ditolak HTTP 413** | ~1-2 pertanyaan per menit |
| **Anthropic** | tidak | muat, dan di-cache | termurah per jawaban bila berbayar |

Angka Groq itu hasil pengukuran langsung, bukan perkiraan: prompt penuh STELA
37.308 token diminta terhadap plafon 8.000 dan ditolak seketika. STELA
menanganinya dengan memangkas pengetahuan ke ~3.000 token per pertanyaan
(lihat `konteks.mjs`), tapi plafon per menitnya tetap membatasi berapa orang
bisa bertanya bersamaan. **Untuk situs sekolah yang ramai, pakai Gemini.**

## Kenapa harus lewat Edge Function

API key **tidak boleh** diletakkan di frontend. Semua variabel `VITE_*` ikut dibundel ke berkas JavaScript yang diunduh browser, jadi siapa pun bisa membacanya lewat DevTools lalu memakai kuota Anda. Fungsi ini ada supaya key hanya hidup di server.

## Dua cara menjalankan

| | Mode lokal | Edge Function |
| --- | --- | --- |
| Untuk | mencoba dan mengembangkan | produksi |
| Butuh Supabase | tidak | ya |
| Yang diisi | `ANTHROPIC_API_KEY` di `frontend/.env` | secret Supabase + `VITE_SUPABASE_*` |
| Endpoint | `/api/stela` (dari `frontend/vite-plugin-stela.js`) | `/functions/v1/stela` |
| Data dinamis | tidak ada, hanya data statis | berita/pengumuman/prestasi/BKK dari Supabase |

Pemilihannya otomatis di `frontend/src/services/stela.js`: begitu `VITE_SUPABASE_URL` terisi, ia memakai Edge Function; kalau kosong dan sedang `npm run dev`, ia memakai endpoint lokal.

### Mode lokal (paling cepat)

Isi **salah satu** baris di `frontend/.env`:

```
GEMINI_API_KEY=AIzaSy...
```

atau

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Kunci Gemini dari [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
berbentuk `AIzaSy` diikuti 33 karakter. Kalau kunci Anda berawalan `AQ.` atau
`ya29.`, itu token OAuth/efemeral yang berumur pendek, **bukan** API key — ia
akan ditolak atau mati dalam hitungan menit.

Lalu `npm run dev`. Dev server akan mencetak `STELA lokal siap di /api/stela`. Buka `/stela` atau klik gelembung chat.

Kunci ini **tanpa awalan `VITE_`**. Awalan itu justru menyuntikkan nilainya ke bundel browser — persis yang harus dihindari. Ia dibaca hanya oleh proses Node milik dev server, dan endpoint `/api/stela` tidak ikut ter-build ke produksi.

Endpoint lokal punya pagar 100 permintaan per sesi dev, supaya loop tak sengaja tidak berubah jadi tagihan.

## Cara memasang (produksi)

### 1. Ambil API key

Buat key di [console.anthropic.com](https://console.anthropic.com) → **API Keys**.

Sebelum lanjut, buka **Settings → Limits** dan pasang batas belanja bulanan. Ini pengaman biaya yang sesungguhnya — pembatas laju di kode hanya menahan penyalahgunaan sederhana.

### 2. Simpan key sebagai secret

Jalankan dari root repository:

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxx
supabase secrets set STELA_MODEL=claude-opus-5
supabase secrets set STELA_ALLOWED_ORIGINS=https://domain-website-anda.example,http://localhost:5173
```

Key ini tersimpan di sisi Supabase dan tidak pernah masuk ke git.

### 3. Deploy

```bash
supabase functions deploy stela
```

### 4. Isi konfigurasi frontend

Buat `frontend/.env` (berkas ini sudah masuk `.gitignore`):

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Pakai **anon/publishable key**, bukan service key. Anon key memang dirancang untuk publik.

Selesai. Buka `/stela` atau klik gelembung chat di pojok kanan bawah.

## Pengetahuan STELA

Data dashboard admin **sengaja dikecualikan** dari pengetahuan chatbot.
`adminPendaftar` berisi nama, NISN, tanggal lahir, alamat, dan telepon
pendaftar. Isinya sekarang dummy, tapi begitu diganti data asli, STELA akan
patuh membacakannya ke penanya mana pun. Lebih aman datanya tidak pernah masuk
context daripada mengandalkan prompt untuk menolak. Penyaringnya ada di
`buat-konten-stela.mjs` (`const DILARANG = /^admin/i`).

STELA memakai dua sumber pengetahuan:

1. `konten-sekolah.mjs` sebagai pengetahuan statis/fallback, yang dihasilkan otomatis dari `frontend/src/data/dummyData.js`.
2. Context dinamis dari tabel publik Supabase pada setiap cache window 60 detik:
   - Berita berstatus `published`.
   - Pengumuman berstatus `published`.
   - Seluruh Prestasi.
   - BKK berstatus `aktif`.

Context dinamis dibaca menggunakan key anon dan tetap mengikuti RLS. STELA tidak membaca PPDB, `admins`, draft, atau bucket private.

Jika isi statis di `dummyData.js` berubah, perbarui snapshot dengan:

```bash
cd frontend
npm run stela:konten
```

Lalu deploy ulang fungsinya. Jangan mengedit `konten-sekolah.mjs` dengan tangan — isinya akan tertimpa.

## Pengaturan opsional

| Secret | Bawaan | Kegunaan |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | — | wajib, kecuali memakai Gemini |
| `GEMINI_API_KEY` | — | alternatif Anthropic; salah satu wajib ada |
| `GROQ_API_KEY` | — | alternatif lain; berbentuk `gsk_` + 52 karakter |
| `STELA_AKTIF` | `true` | isi `false` untuk mematikan STELA seketika |
| `STELA_MAKS_PER_HARI` | `500` | plafon panggilan berbayar per hari |
| `STELA_MAKS_PER_IP` | `20` | plafon per alamat IP tiap 5 menit |
| `STELA_MODEL` | `claude-opus-5` / `gemini-3.6-flash` | opsional; ikut penyedia yang aktif |
| `STELA_ALLOWED_ORIGINS` | — | daftar origin frontend yang dipisahkan koma; wajib diisi untuk request browser |
| `SUPABASE_URL` | disediakan Supabase | URL project untuk membaca context publik |
| `SUPABASE_ANON_KEY` | disediakan Supabase | key anon untuk membaca context yang tunduk pada RLS |

## Pagar biaya

Enam lapisan, diurutkan dari yang paling murah ke paling mahal. Permintaan
harus lolos semuanya sebelum satu token pun dibeli.

| # | Lapisan | Bawaan | Setelan |
| --- | --- | --- | --- |
| 1 | Sakelar mati | aktif | `STELA_AKTIF=false` |
| 2 | Plafon harian | 500 (Edge) / 100 (lokal) | `STELA_MAKS_PER_HARI` |
| 3 | Plafon per IP / 5 menit | 20 | `STELA_MAKS_PER_IP` |
| 4 | Cache jawaban | 200 entri, 1 jam | di `penjaga-biaya.mjs` |
| 5 | Batas ukuran masukan | 20 pesan, 8.000 karakter | di `inti.mjs` |
| 6 | Plafon token keluaran | 2.000 | `BATAS.MAKS_TOKEN_JAWABAN` |

**Lapisan 4 yang paling banyak menghemat.** Di situs sekolah, mayoritas
pengunjung menanyakan hal yang itu-itu juga. Satu jawaban tersimpan melayani
puluhan orang tanpa biaya tambahan, dan jawaban dari cache tidak memakan jatah
harian. Hanya pertanyaan pembuka satu pesan yang di-cache — percakapan lanjutan
jawabannya bergantung konteks sebelumnya, jadi menyimpannya berisiko menyodorkan
jawaban milik orang lain.

### Yang TIDAK dijamin lapisan ini

Semua hitungan di atas ada **di memori proses**. Di Supabase Edge tiap isolate
punya salinan sendiri, dan hitungannya kembali nol saat isolate diistirahatkan —
jadi plafon efektifnya bisa berlipat sebanyak isolate yang aktif.

**Plafon yang benar-benar mengikat hanya batas belanja di konsol penyedia.**
Pasang di sana lebih dulu, sebelum mengandalkan apa pun di kode ini:

- Gemini: [Google Cloud Console → Billing → Budgets & alerts](https://console.cloud.google.com/billing). Kuota gratis AI Studio sudah punya batas sendiri; selama belum ditautkan ke akun billing, ia berhenti melayani, bukan menagih.
- Anthropic: [console.anthropic.com](https://console.anthropic.com) → **Settings → Limits**.

Kalau situs mulai ramai, pindahkan hitungan harian ke tabel Postgres dengan
indeks `(ip, waktu)` supaya berlaku lintas isolate.

## Soal biaya

Knowledge statis dan context publik dikirim sebagai system prompt. Blok tersebut ditandai `cache_control: ephemeral` agar Anthropic dapat menggunakan prompt caching ketika context tetap sama. Context dinamis juga di-cache di isolate selama 60 detik untuk mengurangi request Supabase.

Batas yang sudah terpasang di kode:

- maksimal 20 pesan per percakapan
- maksimal 1.000 karakter per pertanyaan, 8.000 karakter per percakapan
- maksimal 2.000 token jawaban (Opus 5 berpikir secara bawaan dan token berpikir ikut terhitung; plafon 800 memotong jawaban di tengah). Keringkasan dijaga aturan prompt, bukan plafon token
- maksimal 20 permintaan per 5 menit per alamat IP
- maksimal 500 panggilan berbayar per hari
- jawaban berulang dilayani dari cache, tanpa memanggil API

## Menguji tanpa memanggil API

```bash
cd frontend
npm run stela:uji
```

Memeriksa validasi pesan — batas panjang, urutan peran, penolakan peran `system` yang diselipkan — tanpa mengeluarkan biaya sepeser pun.

## Susunan berkas

| Berkas | Isi |
| --- | --- |
| `inti.mjs` | prompt sistem, validasi pesan, pemanggilan Anthropic/Gemini/Groq — dipakai bersama kedua mode |
| `konteks.mjs` | memilih potongan pengetahuan yang relevan, agar muat di plafon penyedia |
| `penjaga-biaya.mjs` | sakelar mati, plafon harian, pembatas per IP, cache jawaban |
| `index.ts` | pembungkus Deno: CORS, pembatas laju, context Supabase |
| `konten-sekolah.mjs` | hasil generate dari `dummyData.js`, jangan diedit tangan |
| `frontend/vite-plugin-stela.js` | endpoint `/api/stela` untuk mode lokal |

`inti.mjs` sengaja `.mjs` polos supaya Deno dan Node sama-sama bisa memuatnya. Prompt hanya ditulis di satu tempat; kalau ditaruh dua kali, cepat atau lambat keduanya berbeda tanpa ada yang sadar.

## Batasan yang perlu diketahui

**Pembatas laju disimpan di memori isolate.** Kalau Supabase menjalankan beberapa isolate sekaligus, batas efektifnya berlipat sebanyak isolate aktif, dan hitungannya kembali nol ketika isolate diistirahatkan. Ini memadai untuk menahan perulangan sederhana, bukan serangan sungguhan. Kalau situs mulai ramai, pindahkan pencatatannya ke tabel Postgres dengan indeks `(ip, waktu)`.

**Jawaban belum dialirkan (streaming).** Pengguna menunggu sampai jawaban lengkap, ditemani indikator mengetik. Kalau terasa lambat, ubah fungsi ini agar meneruskan `stream: true` dari Anthropic dan baca potongannya di `StelaChat.jsx`.

**STELA hanya tahu isi situs ini.** Ia diinstruksikan menolak mengarang dan mengarahkan ke Tata Usaha untuk hal yang tidak ada di data. Instruksi tersebut juga menutup upaya pengunjung menyuruh STELA keluar dari perannya lewat isi pesan maupun isi konten admin.

API key Anthropic tidak pernah dimasukkan ke `frontend/.env`, source React, localStorage, atau response Edge Function. Error internal juga tidak diteruskan ke browser.
