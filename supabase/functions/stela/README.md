# STELA — chatbot situs SMK Telkom Purwokerto

Edge Function yang menjembatani widget chat di browser dengan Claude API.

## Kenapa harus lewat Edge Function

API key **tidak boleh** diletakkan di frontend. Semua variabel `VITE_*` ikut dibundel ke berkas JavaScript yang diunduh browser, jadi siapa pun bisa membacanya lewat DevTools lalu memakai kuota Anda. Fungsi ini ada supaya key hanya hidup di server.

## Cara memasang

### 1. Ambil API key

Buat key di [console.anthropic.com](https://console.anthropic.com) → **API Keys**.

Sebelum lanjut, buka **Settings → Limits** dan pasang batas belanja bulanan. Ini pengaman biaya yang sesungguhnya — pembatas laju di kode hanya menahan penyalahgunaan sederhana.

### 2. Simpan key sebagai secret

Jalankan dari root repository:

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxx
supabase secrets set STELA_MODEL=claude-sonnet-4-20250514
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

STELA memakai dua sumber pengetahuan:

1. `konten-sekolah.ts` sebagai pengetahuan statis/fallback, yang dihasilkan otomatis dari `frontend/src/data/dummyData.js`.
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

Lalu deploy ulang fungsinya. Jangan mengedit `konten-sekolah.ts` dengan tangan — isinya akan tertimpa.

## Pengaturan opsional

| Secret | Bawaan | Kegunaan |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | — | wajib |
| `STELA_MODEL` | — | wajib diisi dengan model ID Anthropic yang tersedia pada akun Anda |
| `STELA_ALLOWED_ORIGINS` | — | daftar origin frontend yang dipisahkan koma; wajib diisi untuk request browser |
| `SUPABASE_URL` | disediakan Supabase | URL project untuk membaca context publik |
| `SUPABASE_ANON_KEY` | disediakan Supabase | key anon untuk membaca context yang tunduk pada RLS |

## Soal biaya

Knowledge statis dan context publik dikirim sebagai system prompt. Blok tersebut ditandai `cache_control: ephemeral` agar Anthropic dapat menggunakan prompt caching ketika context tetap sama. Context dinamis juga di-cache di isolate selama 60 detik untuk mengurangi request Supabase.

Batas yang sudah terpasang di kode:

- maksimal 20 pesan per percakapan
- maksimal 1.000 karakter per pertanyaan, 8.000 karakter per percakapan
- maksimal 800 token jawaban
- maksimal 20 permintaan per 5 menit per alamat IP

## Batasan yang perlu diketahui

**Pembatas laju disimpan di memori isolate.** Kalau Supabase menjalankan beberapa isolate sekaligus, batas efektifnya berlipat sebanyak isolate aktif, dan hitungannya kembali nol ketika isolate diistirahatkan. Ini memadai untuk menahan perulangan sederhana, bukan serangan sungguhan. Kalau situs mulai ramai, pindahkan pencatatannya ke tabel Postgres dengan indeks `(ip, waktu)`.

**Jawaban belum dialirkan (streaming).** Pengguna menunggu sampai jawaban lengkap, ditemani indikator mengetik. Kalau terasa lambat, ubah fungsi ini agar meneruskan `stream: true` dari Anthropic dan baca potongannya di `StelaChat.jsx`.

**STELA hanya tahu isi situs ini.** Ia diinstruksikan menolak mengarang dan mengarahkan ke Tata Usaha untuk hal yang tidak ada di data. Instruksi tersebut juga menutup upaya pengunjung menyuruh STELA keluar dari perannya lewat isi pesan maupun isi konten admin.

API key Anthropic tidak pernah dimasukkan ke `frontend/.env`, source React, localStorage, atau response Edge Function. Error internal juga tidak diteruskan ke browser.
