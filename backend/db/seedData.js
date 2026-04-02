require('dotenv').config();
const db = require('../src/config/database');

async function seedData() {
  try {
    console.log('Seeding sample data...');

    // Get admin user
    const [adminRows] = await db.query("SELECT id FROM users WHERE email = 'admin@konseling.com'");
    const adminId = adminRows[0].id;

    // Create guru BK users
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('guru123', 10);
    await db.query(`INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE nama = VALUES(nama)`, ['Ahmad Rizki, S.Pd', 'gurubk@konseling.com', hash, 'guru_bk']);
    const [guruRows] = await db.query("SELECT id FROM users WHERE email = 'gurubk@konseling.com'");
    const guruBkId = guruRows[0].id;

    // Create wali kelas
    await db.query(`INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE nama = VALUES(nama)`, ['Siti Nurhaliza, S.Pd', 'walikelas@konseling.com', hash, 'wali_kelas']);
    const [waliRows] = await db.query("SELECT id FROM users WHERE email = 'walikelas@konseling.com'");
    const waliKelasId = waliRows[0].id;

    // Create Kelas
    const kelasData = [
      { nama_kelas: '7A', tingkat: '7', wali_kelas_id: waliKelasId },
      { nama_kelas: '7B', tingkat: '7', wali_kelas_id: null },
      { nama_kelas: '8A', tingkat: '8', wali_kelas_id: null },
      { nama_kelas: '8B', tingkat: '8', wali_kelas_id: null },
      { nama_kelas: '9A', tingkat: '9', wali_kelas_id: null },
      { nama_kelas: '9B', tingkat: '9', wali_kelas_id: null }
    ];

    for (const k of kelasData) {
      await db.query('INSERT INTO kelas (nama_kelas, tingkat, wali_kelas_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE wali_kelas_id = VALUES(wali_kelas_id)', [k.nama_kelas, k.tingkat, k.wali_kelas_id]);
    }
    console.log('✓ 6 kelas created');

    // Get kelas IDs
    const [kelasRows] = await db.query('SELECT id, nama_kelas FROM kelas');
    const kelasMap = {};
    kelasRows.forEach(k => kelasMap[k.nama_kelas] = k.id);

    // Create 20 Siswa
    const siswaData = [
      { nis: '2024001', nisn: '0051234001', nama: 'Muhammad Farhan', jk: 'L', kelas: '7A', alamat: 'Jl. Demang Lebar Daun No. 10', hp: '081234567001' },
      { nis: '2024002', nisn: '0051234002', nama: 'Aisyah Nur Fitri', jk: 'P', kelas: '7A', alamat: 'Jl. Kapten A. Rivai No. 25', hp: '081234567002' },
      { nis: '2024003', nisn: '0051234003', nama: 'Ahmad Fadillah', jk: 'L', kelas: '7A', alamat: 'Jl. Veteran No. 8', hp: '081234567003' },
      { nis: '2024004', nisn: '0051234004', nama: 'Nurul Hidayah', jk: 'P', kelas: '7B', alamat: 'Jl. Rajawali No. 15', hp: '081234567004' },
      { nis: '2024005', nisn: '0051234005', nama: 'Rizki Pratama', jk: 'L', kelas: '7B', alamat: 'Jl. Sukaramai No. 3', hp: '081234567005' },
      { nis: '2024006', nisn: '0051234006', nama: 'Fatimah Azzahra', jk: 'P', kelas: '7B', alamat: 'Jl. Merdeka No. 42', hp: '081234567006' },
      { nis: '2024007', nisn: '0051234007', nama: 'Bayu Setiawan', jk: 'L', kelas: '8A', alamat: 'Jl. Pangeran Antasari No. 7', hp: '081234567007' },
      { nis: '2024008', nisn: '0051234008', nama: 'Zahra Maulida', jk: 'P', kelas: '8A', alamat: 'Jl. Jenderal Sudirman No. 19', hp: '081234567008' },
      { nis: '2024009', nisn: '0051234009', nama: 'Dimas Aryo', jk: 'L', kelas: '8A', alamat: 'Jl. Letkol Iskandar No. 31', hp: '081234567009' },
      { nis: '2024010', nisn: '0051234010', nama: 'Salsabila Putri', jk: 'P', kelas: '8B', alamat: 'Jl. Tengkuruk No. 5', hp: '081234567010' },
      { nis: '2024011', nisn: '0051234011', nama: 'Fajar Nugroho', jk: 'L', kelas: '8B', alamat: 'Jl. Basuki Rahmat No. 12', hp: '081234567011' },
      { nis: '2024012', nisn: '0051234012', nama: 'Khadijah Amelia', jk: 'P', kelas: '8B', alamat: 'Jl. Ahmad Yani No. 28', hp: '081234567012' },
      { nis: '2024013', nisn: '0051234013', nama: 'Yoga Prasetyo', jk: 'L', kelas: '9A', alamat: 'Jl. Kartini No. 9', hp: '081234567013' },
      { nis: '2024014', nisn: '0051234014', nama: 'Annisa Rahmawati', jk: 'P', kelas: '9A', alamat: 'Jl. Diponegoro No. 17', hp: '081234567014' },
      { nis: '2024015', nisn: '0051234015', nama: 'Iqbal Ramadhan', jk: 'L', kelas: '9A', alamat: 'Jl. Gajah Mada No. 22', hp: '081234567015' },
      { nis: '2024016', nisn: '0051234016', nama: 'Dewi Lestari', jk: 'P', kelas: '9A', alamat: 'Jl. Hasanuddin No. 6', hp: '081234567016' },
      { nis: '2024017', nisn: '0051234017', nama: 'Reza Firmansyah', jk: 'L', kelas: '9B', alamat: 'Jl. Sudirman No. 33', hp: '081234567017' },
      { nis: '2024018', nisn: '0051234018', nama: 'Mega Wati', jk: 'P', kelas: '9B', alamat: 'Jl. Pemuda No. 14', hp: '081234567018' },
      { nis: '2024019', nisn: '0051234019', nama: 'Aldi Saputra', jk: 'L', kelas: '9B', alamat: 'Jl. Mangkunegara No. 4', hp: '081234567019' },
      { nis: '2024020', nisn: '0051234020', nama: 'Halimatus Saadiah', jk: 'P', kelas: '9B', alamat: 'Jl. Imam Bonjol No. 20', hp: '081234567020' }
    ];

    for (const s of siswaData) {
      await db.query(
        'INSERT INTO siswa (nis, nisn, nama, jenis_kelamin, kelas_id, alamat, no_hp_ortu) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nama = VALUES(nama)',
        [s.nis, s.nisn, s.nama, s.jk, kelasMap[s.kelas], s.alamat, s.hp]
      );
    }
    console.log('✓ 20 siswa created');

    // Get siswa IDs
    const [siswaRows] = await db.query('SELECT id, nama FROM siswa ORDER BY nis');
    const siswaIds = siswaRows.map(s => s.id);

    // Konseling data (10 records)
    const konselingData = [
      { siswa_idx: 0, tanggal: '2026-03-01', jenis: 'konsultasi', kategori: 'pribadi', keterangan: 'Siswa mengeluhkan kesulitan mengatur waktu belajar', status: 'selesai' },
      { siswa_idx: 1, tanggal: '2026-03-03', jenis: 'konsultasi', kategori: 'belajar', keterangan: 'Kesulitan memahami mata pelajaran Matematika', status: 'tindak_lanjut' },
      { siswa_idx: 3, tanggal: '2026-03-05', jenis: 'kunjungan_rumah', kategori: 'sosial', keterangan: 'Kunjungan rumah terkait kondisi keluarga siswa', status: 'selesai' },
      { siswa_idx: 6, tanggal: '2026-03-08', jenis: 'bimbingan_klasikal', kategori: 'karir', keterangan: 'Bimbingan perencanaan karir untuk kelas 8', status: 'selesai' },
      { siswa_idx: 8, tanggal: '2026-03-10', jenis: 'konsultasi', kategori: 'pribadi', keterangan: 'Siswa bermasalah dengan teman sekelas', status: 'tindak_lanjut' },
      { siswa_idx: 10, tanggal: '2026-03-12', jenis: 'mediator', kategori: 'sosial', keterangan: 'Mediasi konflik antar siswa', status: 'selesai' },
      { siswa_idx: 12, tanggal: '2026-03-15', jenis: 'konsultasi', kategori: 'belajar', keterangan: 'Motivasi belajar menurun, perlu pendampingan', status: 'tindak_lanjut' },
      { siswa_idx: 14, tanggal: '2026-03-18', jenis: 'bimbingan_klasikal', kategori: 'karir', keterangan: 'Persiapan UN dan pemilihan SMA', status: 'selesai' },
      { siswa_idx: 16, tanggal: '2026-03-20', jenis: 'konsultasi', kategori: 'pribadi', keterangan: 'Konseling terkait percaya diri', status: 'selesai' },
      { siswa_idx: 18, tanggal: '2026-03-25', jenis: 'kunjungan_rumah', kategori: 'sosial', keterangan: 'Siswa sering tidak masuk tanpa keterangan', status: 'tindak_lanjut' }
    ];

    for (const k of konselingData) {
      await db.query(
        'INSERT INTO konseling (siswa_id, guru_bk_id, tanggal, jenis_layanan, kategori, keterangan, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [siswaIds[k.siswa_idx], guruBkId, k.tanggal, k.jenis, k.kategori, k.keterangan, k.status]
      );
    }
    console.log('✓ 10 konseling records created');

    // Pelanggaran data (8 records)
    const pelanggaranData = [
      { siswa_idx: 2, jenis_id: 1, tanggal: '2026-03-02', sanksi: 'Teguran lisan', keterangan: 'Terlambat 15 menit' },
      { siswa_idx: 4, jenis_id: 2, tanggal: '2026-03-04', sanksi: 'Teguran tertulis', keterangan: 'Tidak memakai dasi' },
      { siswa_idx: 7, jenis_id: 5, tanggal: '2026-03-06', sanksi: 'Surat peringatan 1', keterangan: 'Bolos 2 jam pelajaran' },
      { siswa_idx: 9, jenis_id: 1, tanggal: '2026-03-09', sanksi: 'Teguran lisan', keterangan: 'Terlambat 20 menit' },
      { siswa_idx: 11, jenis_id: 4, tanggal: '2026-03-11', sanksi: 'Mengulang tugas', keterangan: 'Tidak mengumpulkan PR 3 hari berturut-turut' },
      { siswa_idx: 13, jenis_id: 7, tanggal: '2026-03-14', sanksi: 'Teguran tertulis', keterangan: 'Berkata kasar kepada teman' },
      { siswa_idx: 15, jenis_id: 3, tanggal: '2026-03-17', sanksi: 'Teguran lisan', keterangan: 'Berisik saat upacara bendera' },
      { siswa_idx: 17, jenis_id: 6, tanggal: '2026-03-22', sanksi: 'Surat peringatan 1', keterangan: 'Tidak mengikuti upacara senin' }
    ];

    for (const p of pelanggaranData) {
      await db.query(
        'INSERT INTO pelanggaran (siswa_id, jenis_pelanggaran_id, guru_pencatat_id, tanggal, sanksi, keterangan) VALUES (?, ?, ?, ?, ?, ?)',
        [siswaIds[p.siswa_idx], p.jenis_id, guruBkId, p.tanggal, p.sanksi, p.keterangan]
      );
    }
    console.log('✓ 8 pelanggaran records created');

    // Surat Masuk (5 records)
    const suratMasukData = [
      { nomor: '001/SM/BK/III/2026', tgl_surat: '2026-03-01', tgl_terima: '2026-03-01', pengirim: 'Dinas Pendidikan Kota Palembang', perihal: 'Sosialisasi Program Anti Narkoba', keterangan: 'Untuk dilaksanakan sosialisasi ke siswa' },
      { nomor: '002/SM/BK/III/2026', tgl_surat: '2026-03-05', tgl_terima: '2026-03-06', pengirim: 'Komite Sekolah', perihal: 'Undangan Rapat Komite', keterangan: 'Rapat evaluasi semester ganjil' },
      { nomor: '003/SM/BK/III/2026', tgl_surat: '2026-03-10', tgl_terima: '2026-03-11', pengirim: 'Puskesmas Setempat', perihal: 'Pemeriksaan Kesehatan Siswa', keterangan: 'Jadwal pemeriksaan gigi dan mata' },
      { nomor: '004/SM/BK/III/2026', tgl_surat: '2026-03-15', tgl_terima: '2026-03-15', pengirim: 'Kementerian Agama', perihal: 'Program Bimbingan Rohani', keterangan: 'Pelaksanaan siraman rohani bulanan' },
      { nomor: '005/SM/BK/III/2026', tgl_surat: '2026-03-20', tgl_terima: '2026-03-21', pengirim: 'Polres Palembang', perihal: 'Sosialisasi Bahaya Kenakalan Remaja', keterangan: 'Kerjasama dengan unit Binmas' }
    ];

    for (const sm of suratMasukData) {
      await db.query(
        'INSERT INTO surat_masuk (nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, keterangan) VALUES (?, ?, ?, ?, ?, ?)',
        [sm.nomor, sm.tgl_surat, sm.tgl_terima, sm.pengirim, sm.perihal, sm.keterangan]
      );
    }
    console.log('✓ 5 surat masuk created');

    // Surat Keluar (4 records)
    const suratKeluarData = [
      { nomor: '001/SK/BK/III/2026', tanggal: '2026-03-03', tujuan: 'Orang Tua/Wali Siswa', perihal: 'Panggilan Orang Tua Siswa Bermasalah', keterangan: 'Untuk siswa yang melanggar tata tertib' },
      { nomor: '002/SK/BK/III/2026', tanggal: '2026-03-08', tujuan: 'Kepala Sekolah', perihal: 'Laporan Kegiatan Bimbingan Bulan Februari', keterangan: 'Laporan bulanan kegiatan BK' },
      { nomor: '003/SK/BK/III/2026', tanggal: '2026-03-15', tujuan: 'Dinas Pendidikan', perihal: 'Laporan Kasus Kenakalan Siswa', keterangan: 'Laporan semester ini' },
      { nomor: '004/SK/BK/III/2026', tanggal: '2026-03-22', tujuan: 'Wali Kelas 9A', perihal: 'Rekomendasi Siswa Penerima Beasiswa', keterangan: 'Berdasarkan hasil konseling dan nilai akademik' }
    ];

    for (const sk of suratKeluarData) {
      await db.query(
        'INSERT INTO surat_keluar (nomor_surat, tanggal_surat, tujuan, perihal, keterangan) VALUES (?, ?, ?, ?, ?)',
        [sk.nomor, sk.tanggal, sk.tujuan, sk.perihal, sk.keterangan]
      );
    }
    console.log('✓ 4 surat keluar created');

    console.log('\n✅ All sample data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedData();
