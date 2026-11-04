# Backup Otomatis

## Jadwal

| Platform | Waktu | Zona |
|---|---|---|
| Windows Task Scheduler | 02:00 harian | Asia/Jakarta |
| Linux systemd timer | 19:00 UTC harian | (02:00 WIB) |

## Windows

File: `backend/schedulers/windows-backup-daily.xml`.

Install:

```powershell
schtasks /create /tn "SMKDailyBackup" /xml backend\schedulers\windows-backup-daily.xml
```

Sesuaikan `WorkingDirectory` pada XML ke path backend project. Pastikan `node` dapat ditemukan oleh Task Scheduler (tambahkan ke PATH atau gunakan path absolut).

Status:

```powershell
schtasks /query /tn "SMKDailyBackup" /v
```

Jalankan manual:

```powershell
schtasks /run /tn "SMKDailyBackup"
```

Disable/hapus:

```powershell
schtasks /end /tn "SMKDailyBackup"
schtasks /delete /tn "SMKDailyBackup" /f
```

## Linux

File: `backend/schedulers/linux-backup-daily.service` dan `.timer`.

Install:

```bash
sudo cp schedulers/linux-backup-daily.{service,timer} /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now linux-backup-daily.timer
```

Sesuaikan `WorkingDirectory` dan path `node` pada file `.service`. User harus dapat membaca `.env` backend.

Status:

```bash
systemctl status linux-backup-daily.timer
systemctl list-timers linux-backup-daily.timer
journalctl -u linux-backup-daily.service -n 50
```

Jalankan manual:

```bash
sudo systemctl start linux-backup-daily.service
```

## Pencegahan backup bersamaan

Timer `Persistent=true` menjalankan backup yang tertunda hanya sekali. Task Scheduler `StartWhenAvailable=true` menjalankan backup yang terlewat saat komputer aktif kembali. Tidak ada dua instansi backup yang berjalan simultan karena scheduler memulai service oneshot.

## Retensi

Backup berusia lebih dari 30 hari dihapus secara otomatis setelah backup harian selesai. Penentuan usia memakai zona `Asia/Jakarta`.
