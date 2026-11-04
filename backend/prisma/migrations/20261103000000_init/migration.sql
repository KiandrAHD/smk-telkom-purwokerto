-- CreateTable
CREATE TABLE `admins` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `nama` VARCHAR(180) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admins_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `email_verified` DATETIME(3) NULL,
    `role` VARCHAR(30) NOT NULL DEFAULT 'applicant',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `token_hash` CHAR(64) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sessions_token_hash_key`(`token_hash`),
    INDEX `sessions_user_id_idx`(`user_id`),
    INDEX `sessions_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `berita` (
    `id` CHAR(36) NOT NULL,
    `judul` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `ringkasan` TEXT NULL,
    `konten` LONGTEXT NOT NULL,
    `gambar_url` VARCHAR(2048) NULL,
    `penulis` VARCHAR(180) NULL,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `berita_slug_key`(`slug`),
    INDEX `berita_status_created_at_idx`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengumuman` (
    `id` CHAR(36) NOT NULL,
    `judul` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `ringkasan` TEXT NULL,
    `konten` LONGTEXT NOT NULL,
    `gambar_url` VARCHAR(2048) NULL,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `tanggal` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pengumuman_slug_key`(`slug`),
    INDEX `pengumuman_status_created_at_idx`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prestasi` (
    `id` CHAR(36) NOT NULL,
    `judul` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `kategori` VARCHAR(120) NULL,
    `deskripsi` TEXT NOT NULL,
    `gambar_url` VARCHAR(2048) NULL,
    `instagram_url` VARCHAR(2048) NULL,
    `tingkat` VARCHAR(120) NULL,
    `tanggal` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `prestasi_slug_key`(`slug`),
    INDEX `prestasi_tanggal_idx`(`tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bkk` (
    `id` CHAR(36) NOT NULL,
    `perusahaan` VARCHAR(255) NOT NULL,
    `posisi` VARCHAR(255) NOT NULL,
    `deskripsi` TEXT NULL,
    `lokasi` VARCHAR(255) NULL,
    `tipe_pekerjaan` VARCHAR(100) NULL,
    `deadline` DATETIME(3) NULL,
    `status` ENUM('aktif', 'ditutup') NOT NULL DEFAULT 'aktif',
    `link_pendaftaran` VARCHAR(2048) NULL,
    `logo_url` VARCHAR(2048) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `bkk_status_deadline_idx`(`status`, `deadline`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ppdb` (
    `id` CHAR(36) NOT NULL,
    `auth_user_id` CHAR(36) NULL,
    `nama_lengkap` VARCHAR(255) NOT NULL,
    `nisn` VARCHAR(30) NULL,
    `nik` VARCHAR(30) NULL,
    `asal_sekolah` VARCHAR(255) NOT NULL,
    `tempat_lahir` VARCHAR(120) NULL,
    `tanggal_lahir` DATETIME(3) NULL,
    `jenis_kelamin` VARCHAR(30) NULL,
    `agama` VARCHAR(50) NULL,
    `tahun_lulus` VARCHAR(10) NULL,
    `alamat` TEXT NULL,
    `no_hp` VARCHAR(30) NULL,
    `email` VARCHAR(254) NULL,
    `pilihan_jurusan` VARCHAR(120) NOT NULL,
    `nilai_rapor` JSON NULL,
    `dokumen_url` VARCHAR(2048) NULL,
    `status` ENUM('menunggu', 'diproses', 'diterima', 'ditolak') NOT NULL DEFAULT 'menunggu',
    `catatan_admin` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ppdb_auth_user_id_key`(`auth_user_id`),
    INDEX `ppdb_status_created_at_idx`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ppdb_drafts` (
    `auth_user_id` CHAR(36) NOT NULL,
    `biodata` JSON NOT NULL,
    `nilai` JSON NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`auth_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` CHAR(36) NOT NULL,
    `judul` VARCHAR(180) NOT NULL,
    `ringkasan` VARCHAR(500) NOT NULL DEFAULT '',
    `deskripsi` TEXT NOT NULL,
    `kategori` ENUM('kegiatan', 'akademik', 'lomba', 'karier', 'lainnya') NOT NULL DEFAULT 'kegiatan',
    `tanggal_mulai` DATE NOT NULL,
    `waktu_mulai` VARCHAR(8) NULL,
    `tanggal_selesai` DATE NULL,
    `waktu_selesai` VARCHAR(8) NULL,
    `lokasi` VARCHAR(240) NOT NULL DEFAULT '',
    `penyelenggara` VARCHAR(160) NOT NULL DEFAULT '',
    `gambar_url` VARCHAR(2048) NULL,
    `link_informasi` VARCHAR(2048) NULL,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `events_status_tanggal_mulai_idx`(`status`, `tanggal_mulai`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spmb_information` (
    `id` CHAR(36) NOT NULL,
    `jenis` ENUM('jadwal', 'timeline', 'skema', 'persyaratan', 'syarat', 'statistik') NOT NULL,
    `judul` VARCHAR(180) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 1,
    `tanggal_mulai` DATE NULL,
    `tanggal_selesai` DATE NULL,
    `tanggal_seleksi` DATE NULL,
    `tanggal_pengumuman` DATE NULL,
    `ikon` VARCHAR(30) NULL,
    `tautan_url` VARCHAR(2048) NULL,
    `sumber_url` VARCHAR(2048) NULL,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `kuota_total` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `spmb_information_jenis_status_urutan_idx`(`jenis`, `status`, `urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` BOOLEAN NOT NULL DEFAULT true,
    `school_name` VARCHAR(150) NOT NULL,
    `npsn` CHAR(8) NOT NULL,
    `address` VARCHAR(1000) NOT NULL,
    `phone` VARCHAR(30) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `website` VARCHAR(2048) NOT NULL,
    `logo_url` VARCHAR(2048) NULL,
    `academic_year` CHAR(9) NOT NULL,
    `spmb_open` BOOLEAN NOT NULL DEFAULT true,
    `news_page_size` INTEGER NOT NULL,
    `revision` BIGINT NOT NULL DEFAULT 1,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_daily_attempts` (
    `feature` ENUM('stela', 'nexttel') NOT NULL,
    `day` DATE NOT NULL,
    `attempts` INTEGER NOT NULL,

    PRIMARY KEY (`feature`, `day`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_visitors` (
    `visitor_hash` VARCHAR(128) NOT NULL,
    `day` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`visitor_hash`, `day`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admins_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ppdb` ADD CONSTRAINT `ppdb_auth_user_id_fkey` FOREIGN KEY (`auth_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ppdb_drafts` ADD CONSTRAINT `ppdb_drafts_auth_user_id_fkey` FOREIGN KEY (`auth_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
