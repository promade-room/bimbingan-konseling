const db = require('../config/database');

exports.laporanKonseling = async (req, res) => {
  try {
    const { tanggal_dari, tanggal_sampai, kelas_id, jenis_layanan } = req.query;
    let query = `SELECT ks.*, s.nama as siswa_nama, s.nis, k.nama_kelas, k.tingkat, u.nama as guru_bk_nama
                 FROM konseling ks JOIN siswa s ON ks.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN users u ON ks.guru_bk_id = u.id WHERE 1=1`;
    const params = [];

    if (req.user.role === 'wali_kelas') {
      query += ' AND s.kelas_id IN (SELECT id FROM kelas WHERE wali_kelas_id = ?)';
      params.push(req.user.id);
    }

    if (tanggal_dari) { query += ' AND ks.tanggal >= ?'; params.push(tanggal_dari); }
    if (tanggal_sampai) { query += ' AND ks.tanggal <= ?'; params.push(tanggal_sampai); }
    if (kelas_id) { query += ' AND s.kelas_id = ?'; params.push(kelas_id); }
    if (jenis_layanan) { query += ' AND ks.jenis_layanan = ?'; params.push(jenis_layanan); }

    query += ' ORDER BY ks.tanggal DESC, k.nama_kelas, s.nama';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.laporanPelanggaran = async (req, res) => {
  try {
    const { tanggal_dari, tanggal_sampai, kelas_id, tingkat } = req.query;
    let query = `SELECT p.*, s.nama as siswa_nama, s.nis, k.nama_kelas, k.tingkat, jp.nama as jenis_nama, jp.tingkat as jenis_tingkat, jp.poin, u.nama as guru_pencatat_nama
                 FROM pelanggaran p JOIN siswa s ON p.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN jenis_pelanggaran jp ON p.jenis_pelanggaran_id = jp.id JOIN users u ON p.guru_pencatat_id = u.id WHERE 1=1`;
    const params = [];

    if (req.user.role === 'wali_kelas') {
      query += ' AND s.kelas_id IN (SELECT id FROM kelas WHERE wali_kelas_id = ?)';
      params.push(req.user.id);
    }

    if (tanggal_dari) { query += ' AND p.tanggal >= ?'; params.push(tanggal_dari); }
    if (tanggal_sampai) { query += ' AND p.tanggal <= ?'; params.push(tanggal_sampai); }
    if (kelas_id) { query += ' AND s.kelas_id = ?'; params.push(kelas_id); }
    if (tingkat) { query += ' AND jp.tingkat = ?'; params.push(tingkat); }

    query += ' ORDER BY p.tanggal DESC, k.nama_kelas, s.nama';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
