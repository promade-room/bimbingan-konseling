require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/config/database');

async function seed() {
  try {
    console.log('Seeding database...');

    // Create admin user with proper hash
    const hash = await bcrypt.hash('admin123', 10);
    await db.query(
      `INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = ?`,
      ['Administrator', 'admin@konseling.com', hash, 'admin', hash]
    );
    console.log('✓ Admin user created (admin@konseling.com / admin123)');

    // Seed default jenis pelanggaran
    const jenisPelanggaran = [
      { nama: 'Terlambat masuk sekolah', tingkat: 'ringan', poin: 5 },
      { nama: 'Tidak memakai seragam lengkap', tingkat: 'ringan', poin: 5 },
      { nama: 'Membuat gaduh di kelas', tingkat: 'ringan', poin: 5 },
      { nama: 'Tidak mengerjakan tugas', tingkat: 'ringan', poin: 3 },
      { nama: 'Bolos sekolah', tingkat: 'sedang', poin: 15 },
      { nama: 'Tidak mengikuti upacara', tingkat: 'sedang', poin: 10 },
      { nama: 'Berbicara kasar', tingkat: 'sedang', poin: 10 },
      { nama: 'Merokok di lingkungan sekolah', tingkat: 'berat', poin: 25 },
      { nama: 'Berkelahi', tingkat: 'berat', poin: 30 },
      { nama: 'Membawa barang terlarang', tingkat: 'berat', poin: 30 },
      { nama: 'Mencontek saat ujian', tingkat: 'berat', poin: 20 },
      { nama: 'Merusak fasilitas sekolah', tingkat: 'berat', poin: 25 },
    ];

    for (const jp of jenisPelanggaran) {
      await db.query(
        'INSERT INTO jenis_pelanggaran (nama, tingkat, poin) VALUES (?, ?, ?)',
        [jp.nama, jp.tingkat, jp.poin]
      );
    }
    console.log(`✓ ${jenisPelanggaran.length} jenis pelanggaran seeded`);

    console.log('\nDone! Database seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
