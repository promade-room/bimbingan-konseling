# PRD — Bimbingan Konseling

## 📋 Overview

| Field | Detail |
|---|---|
| **Project Name** | Bimbingan Konseling |
| **Subdomain** | konseling.sias.web.id |
| **Database** | bimbingan_konseling |
| **Theme** | Futuristic / Cyberpunk |
| **Stack** | Express.js + MySQL + Vue 3 + TailwindCSS |
| **Target** | MTs Muhammadiyah 1 Kota Palembang |

### Deskripsi

Sistem informasi bimbingan konseling berbasis web untuk mengelola layanan BK di sekolah. Mencakup pencatatan konseling siswa, tracking pelanggaran, manajemen surat masuk/keluar, dan pelaporan.

---

## 👥 Roles & Users

| Role | Akses |
|---|---|
| **Admin** | Full akses — kelola user, data master, konfigurasi sistem |
| **Guru BK** | Kelola data konseling, pelanggaran, surat, lihat laporan |
| **Wali Kelas** | Lihat data siswa di kelasnya, catat pelanggaran, lihat riwayat konseling kelasnya |
| **Siswa** | Lihat riwayat konseling & pelanggaran diri sendiri |

### Default Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@konseling.com | admin123 |

---

## 🧩 Modules & Features

### 1. Dashboard
- Statistik ringkasan: total siswa, total konseling bulan ini, total pelanggaran bulan ini, surat pending
- Grafik konseling per bulan (bar chart)
- Grafik pelanggaran per kategori (pie chart)
- Aktivitas terbaru (log konseling & pelanggaran terbaru)
- Per-role: Guru BK & Admin lihat semua, Wali Kelas lihat kelasnya, Siswa lihat dirinya

### 2. Data Siswa
- CRUD data siswa: NIS, NISN, nama, jenis kelamin, kelas, alamat, no HP orang tua, foto
- Filter/search by kelas, nama, NIS
- Import/export (opsional, bisa ditambah nanti)
- Relasi ke tabel kelas

### 3. Data Kelas
- CRUD kelas: nama kelas (7A, 7B, 8A, dst), tingkat (7/8/9), wali kelas (relasi ke user guru)
- Wali Kelas auto-assign ke kelas

### 4. Konseling / Bimbingan
- Catatan konseling per siswa
- Fields: siswa, guru BK, tanggal, jenis layanan (konsultasi, kunjungan rumah, bimbingan klasikal, mediator), kategori (pribadi, belajar, sosial, karir), keterangan/catatan
- Status: selesai / tindak lanjut
- Filter by tanggal, siswa, kelas, jenis layanan
- Guru BK bisa buka riwayat lengkap per siswa

### 5. Pelanggaran
- Catatan pelanggaran siswa
- Fields: siswa, guru BK/pencatat, tanggal, jenis pelanggaran, tingkat (ringan/sedang/berat), sanksi, keterangan
- Predefined jenis pelanggaran (bisa di-manage admin): terlambat, tidak seragam, bolos, merokok, berkelahi, dll
- Tingkat pelanggaran auto-count → kalau akumulasi berat, notifikasi/alert
- Filter by siswa, kelas, tanggal, tingkat

### 6. Surat Masuk
- Pencatatan surat masuk ke BK
- Fields: nomor surat, tanggal surat, tanggal terima, pengirim, perihal, file scan (upload), keterangan
- CRUD + preview/download file

### 7. Surat Keluar
- Pencatatan surat keluar dari BK
- Fields: nomor surat, tanggal surat, tujuan, perihal, file scan (upload), keterangan
- CRUD + preview/download file

### 8. Laporan
- Laporan konseling: filter by tanggal, kelas, jenis layanan → cetak/preview
- Laporan pelanggaran: filter by tanggal, kelas, tingkat → cetak/preview
- Format: halaman print-friendly (window.print / CSS @media print)
- Export PDF (opsional)

### 9. Manajemen User
- CRUD user (admin only)
- Fields: nama, email, password, role, foto profil
- Reset password

### 10. Profil
- Edit profil sendiri (nama, email, password, foto)

---

## 🗄️ Database Schema (Draft)

### `users`
| Field | Type | Note |
|---|---|---|
| id | INT PK AUTO_INCREMENT | |
| nama | VARCHAR(100) | |
| email | VARCHAR(100) UNIQUE | |
| password | VARCHAR(255) | bcrypt |
| role | ENUM | admin, guru_bk, wali_kelas, siswa |
| foto | VARCHAR(255) | nullable, path file |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `kelas`
| Field | Type | Note |
|---|---|---|
| id | INT PK AUTO_INCREMENT | |
| nama_kelas | VARCHAR(20) | e.g. "7A", "8B" |
| tingkat | ENUM | 7, 8, 9 |
| wali_kelas_id | INT FK → users | nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `siswa`
| Field | Type | Note |
|---|---|---|
| id | INT PK AUTO_INCREMENT | |
| nis | VARCHAR(20) UNIQUE | |
| nisn | VARCHAR(20) UNIQUE | nullable |
| nama | VARCHAR(100) | |
| jenis_kelamin | ENUM | L, P |
| kelas_id | INT FK → kelas | |
| alamat | TEXT | nullable |
| no_hp_ortu | VARCHAR(20) | nullable |
| foto | VARCHAR(255) | nullable |
| user_id | INT FK → users | nullable (login siswa) |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `konseling`
| Field | Type | Note |
|---|---|---|
| id | INT PK AUTO_INCREMENT | |
| siswa_id | INT FK → siswa | |
| guru_bk_id | INT FK → users | |
| tanggal | DATE | |
| jenis_layanan | ENUM | konsultasi, kunjungan_rumah, bimbingan_klasikal, mediator |
| kategori | ENUM | pribadi, belajar, sosial, karir |
| keterangan | TEXT | |
| status | ENUM | selesai, tindak_lanjut |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `jenis_pelanggaran`
| Field | Type | Note |
|---|---|---|
| id | INT PK AUTO_INCREMENT | |
| nama | VARCHAR(100) | |
| tingkat | ENUM | ringan, sedang, berat |
| poin | INT | default 0 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `pelanggaran`
| Field | Type | Note |
|---|---|---|
| id | INT PK AUTO_INCREMENT | |
| siswa_id | INT FK → siswa | |
| jenis_pelanggaran_id | INT FK → jenis_pelanggaran | |
| guru_pencatat_id | INT FK → users | |
| tanggal | DATE | |
| sanksi | TEXT | nullable |
| keterangan | TEXT | nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `surat_masuk`
| Field | Type | Note |
|---|---|---|
| id | INT PK AUTO_INCREMENT | |
| nomor_surat | VARCHAR(50) | |
| tanggal_surat | DATE | |
| tanggal_terima | DATE | |
| pengirim | VARCHAR(100) | |
| perihal | VARCHAR(255) | |
| file | VARCHAR(255) | nullable, path upload |
| keterangan | TEXT | nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `surat_keluar`
| Field | Type | Note |
|---|---|---|
| id | INT PK AUTO_INCREMENT | |
| nomor_surat | VARCHAR(50) | |
| tanggal_surat | DATE | |
| tujuan | VARCHAR(100) | |
| perihal | VARCHAR(255) | |
| file | VARCHAR(255) | nullable, path upload |
| keterangan | TEXT | nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## 🎨 UI / Theme — Futuristic Cyberpunk

### Warna Utama
- **Background:** `#0a0a1a` (dark navy/black)
- **Primary:** `#00f0ff` (neon cyan)
- **Secondary:** `#ff00aa` (neon magenta/pink)
- **Accent:** `#f5f500` (neon yellow)
- **Surface/Card:** `#111128` (dark purple-tinted)
- **Text:** `#e0e0e0` (light gray)
- **Success:** `#00ff88` (neon green)
- **Danger:** `#ff3366` (neon red)

### Style Guidelines
- Border glow effect (box-shadow neon)
- Glassmorphism cards (backdrop-blur, semi-transparent)
- Angled/clip-path elements (cyberpunk geometric)
- Monospace / tech font (Orbitron for headings, Inter/Rajdhani for body)
- Scanline / grid background pattern (subtle)
- Animations: subtle flicker, pulse on hover
- Sidebar with neon accent border
- Tables with neon-striped rows

### Layout
- Sidebar navigation (collapsible) — neon left border
- Top bar: user info, notifikasi, breadcrumbs
- Main content area with cards / data tables
- Modal untuk form CRUD (neon-styled)
- Responsive (mobile sidebar → bottom nav / hamburger)

### Font
- **Heading:** Orbitron (Google Fonts)
- **Body:** Rajdhani (Google Fonts)

---

## 🏗️ Project Structure

```
bimbingan-konseling/
├── backend/
│   ├── package.json
│   ├── .env
│   ├── src/
│   │   ├── index.js              # Entry point
│   │   ├── config/
│   │   │   └── database.js       # MySQL connection
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT auth
│   │   │   └── upload.js         # Multer config
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── kelas.js
│   │   │   ├── siswa.js
│   │   │   ├── konseling.js
│   │   │   ├── pelanggaran.js
│   │   │   ├── jenisPelanggaran.js
│   │   │   ├── suratMasuk.js
│   │   │   ├── suratKeluar.js
│   │   │   ├── laporan.js
│   │   │   └── dashboard.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── kelasController.js
│   │   │   ├── siswaController.js
│   │   │   ├── konselingController.js
│   │   │   ├── pelanggaranController.js
│   │   │   ├── jenisPelanggaranController.js
│   │   │   ├── suratMasukController.js
│   │   │   ├── suratKeluarController.js
│   │   │   ├── laporanController.js
│   │   │   └── dashboardController.js
│   │   └── uploads/              # File upload storage
│   └── db/
│       └── bimbingan_konseling.sql
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router/
│       │   └── index.js
│       ├── stores/
│       │   └── auth.js           # Pinia auth store
│       ├── composables/
│       │   └── useApi.js         # Axios instance
│       ├── views/
│       │   ├── LoginView.vue
│       │   ├── DashboardView.vue
│       │   ├── SiswaView.vue
│       │   ├── KelasView.vue
│       │   ├── KonselingView.vue
│       │   ├── PelanggaranView.vue
│       │   ├── JenisPelanggaranView.vue
│       │   ├── SuratMasukView.vue
│       │   ├── SuratKeluarView.vue
│       │   ├── LaporanView.vue
│       │   ├── UsersView.vue
│       │   └── ProfilView.vue
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.vue
│       │   │   ├── TopBar.vue
│       │   │   └── MainLayout.vue
│       │   ├── ui/
│       │   │   ├── Modal.vue
│       │   │   ├── DataTable.vue
│       │   │   ├── Pagination.vue
│       │   │   ├── SearchFilter.vue
│       │   │   └── StatCard.vue
│       │   └── charts/
│       │       ├── BarChart.vue
│       │       └── PieChart.vue
│       └── assets/
│           └── css/
│               └── main.css
└── PRD.md
```

---

## 🔧 Backend Dependencies

- **express** — web framework
- **mysql2** — database driver
- **jsonwebtoken** — JWT auth
- **bcryptjs** — password hashing
- **multer** — file upload
- **cors** — cross-origin
- **dotenv** — env config
- **express-validator** — input validation

## 🎨 Frontend Dependencies

- **vue** ^3.4
- **vue-router** ^4
- **pinia** — state management
- **axios** — HTTP client
- **tailwindcss** ^3
- **chart.js** + **vue-chartjs** — charts
- **@heroicons/vue** — icons
- **sweetalert2** — alerts/confirmations

---

## 🚀 Deployment

| Item | Detail |
|---|---|
| **VPS** | 43.157.201.15 (Tencent Cloud) |
| **SSH** | `ssh -i ~/.ssh/vps_rsa ubuntu@43.157.201.15` |
| **Backend** | PM2, port 3005 (next available) |
| **Frontend** | `/var/www/bimbingan-konseling/frontend/dist` |
| **Nginx** | `/etc/nginx/conf.d/bimbingan-konseling.conf` |
| **DB Host** | 103.127.99.28:3306 |

### Nginx Config Template
```nginx
server {
    listen 80;
    server_name konseling.sias.web.id;

    location /api {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        root /var/www/bimbingan-konseling/frontend/dist;
        try_files $uri /index.html;
    }
}
```

---

## 📝 Catatan

- Semua fitur CRUD harus pakai SweetAlert2 untuk konfirmasi & notifikasi
- File upload (surat masuk/keluar) → simpan di `backend/uploads/`, serve via `/api/uploads/:filename`
- JWT token disimpan di localStorage, expired 24h
- Pagination default 10 data/page
- Semua endpoint kecuali login → butuh JWT middleware
- Role-based: admin semua akses, guru_bk CRUD konseling & pelanggaran, wali_kelas read-only kelasnya, siswa read-only dirinya
