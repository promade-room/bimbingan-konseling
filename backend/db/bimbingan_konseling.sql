-- Database: bimbingan_konseling
-- Run this SQL to create all tables

CREATE DATABASE IF NOT EXISTS bimbingan_konseling;
USE bimbingan_konseling;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'guru_bk', 'wali_kelas', 'siswa') NOT NULL DEFAULT 'siswa',
  foto VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Kelas table
CREATE TABLE kelas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_kelas VARCHAR(20) NOT NULL,
  tingkat ENUM('7', '8', '9') NOT NULL,
  wali_kelas_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (wali_kelas_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Siswa table
CREATE TABLE siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nis VARCHAR(20) NOT NULL UNIQUE,
  nisn VARCHAR(20) DEFAULT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  jenis_kelamin ENUM('L', 'P') NOT NULL,
  kelas_id INT NOT NULL,
  alamat TEXT DEFAULT NULL,
  no_hp_ortu VARCHAR(20) DEFAULT NULL,
  foto VARCHAR(255) DEFAULT NULL,
  user_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Jenis Pelanggaran (master data)
CREATE TABLE jenis_pelanggaran (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  tingkat ENUM('ringan', 'sedang', 'berat') NOT NULL DEFAULT 'ringan',
  poin INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Konseling table
CREATE TABLE konseling (
  id INT AUTO_INCREMENT PRIMARY KEY,
  siswa_id INT NOT NULL,
  guru_bk_id INT NOT NULL,
  tanggal DATE NOT NULL,
  jenis_layanan ENUM('konsultasi', 'kunjungan_rumah', 'bimbingan_klasikal', 'mediator') NOT NULL,
  kategori ENUM('pribadi', 'belajar', 'sosial', 'karir') NOT NULL,
  keterangan TEXT DEFAULT NULL,
  status ENUM('selesai', 'tindak_lanjut') NOT NULL DEFAULT 'selesai',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
  FOREIGN KEY (guru_bk_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pelanggaran table
CREATE TABLE pelanggaran (
  id INT AUTO_INCREMENT PRIMARY KEY,
  siswa_id INT NOT NULL,
  jenis_pelanggaran_id INT NOT NULL,
  guru_pencatat_id INT NOT NULL,
  tanggal DATE NOT NULL,
  sanksi TEXT DEFAULT NULL,
  keterangan TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
  FOREIGN KEY (jenis_pelanggaran_id) REFERENCES jenis_pelanggaran(id) ON DELETE CASCADE,
  FOREIGN KEY (guru_pencatat_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Surat Masuk table
CREATE TABLE surat_masuk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomor_surat VARCHAR(50) NOT NULL,
  tanggal_surat DATE NOT NULL,
  tanggal_terima DATE NOT NULL,
  pengirim VARCHAR(100) NOT NULL,
  perihal VARCHAR(255) NOT NULL,
  file VARCHAR(255) DEFAULT NULL,
  keterangan TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Surat Keluar table
CREATE TABLE surat_keluar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomor_surat VARCHAR(50) NOT NULL,
  tanggal_surat DATE NOT NULL,
  tujuan VARCHAR(100) NOT NULL,
  perihal VARCHAR(255) NOT NULL,
  file VARCHAR(255) DEFAULT NULL,
  keterangan TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default admin
INSERT INTO users (nama, email, password, role) VALUES
('Administrator', 'admin@konseling.com', '$2a$10$YQ8GzJKz5YKxBqB3vGzQXeKj5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'admin');

-- Note: password hash above is for 'admin123' - run seed script for proper hash
