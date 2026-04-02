const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { search, siswa_id, kelas_id, tingkat, tanggal_dari, tanggal_sampai, page = 1, limit = 10 } = req.query;
    let query = `SELECT p.*, s.nama as siswa_nama, s.nis, k.nama_kelas, jp.nama as jenis_nama, jp.tingkat as jenis_tingkat, jp.poin, u.nama as guru_pencatat_nama
                 FROM pelanggaran p JOIN siswa s ON p.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN jenis_pelanggaran jp ON p.jenis_pelanggaran_id = jp.id JOIN users u ON p.guru_pencatat_id = u.id WHERE 1=1`;
    const params = [];

    if (req.user.role === 'wali_kelas') {
      query += ' AND s.kelas_id IN (SELECT id FROM kelas WHERE wali_kelas_id = ?)';
      params.push(req.user.id);
    } else if (req.user.role === 'siswa') {
      query += ' AND s.user_id = ?';
      params.push(req.user.id);
    }

    if (search) { query += ' AND (s.nama LIKE ? OR s.nis LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (siswa_id) { query += ' AND p.siswa_id = ?'; params.push(siswa_id); }
    if (kelas_id) { query += ' AND s.kelas_id = ?'; params.push(kelas_id); }
    if (tingkat) { query += ' AND jp.tingkat = ?'; params.push(tingkat); }
    if (tanggal_dari) { query += ' AND p.tanggal >= ?'; params.push(tanggal_dari); }
    if (tanggal_sampai) { query += ' AND p.tanggal <= ?'; params.push(tanggal_sampai); }

    const countQuery = `SELECT COUNT(*) as total FROM pelanggaran p JOIN siswa s ON p.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN jenis_pelanggaran jp ON p.jenis_pelanggaran_id = jp.id JOIN users u ON p.guru_pencatat_id = u.id WHERE 1=1${query.substring(query.indexOf('WHERE 1=1') + 9)}`;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY p.tanggal DESC, p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await db.query(query, params);
    res.json({ data: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT p.*, s.nama as siswa_nama, s.nis, k.nama_kelas, jp.nama as jenis_nama, jp.tingkat as jenis_tingkat, jp.poin, u.nama as guru_pencatat_nama FROM pelanggaran p JOIN siswa s ON p.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN jenis_pelanggaran jp ON p.jenis_pelanggaran_id = jp.id JOIN users u ON p.guru_pencatat_id = u.id WHERE p.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Pelanggaran tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { siswa_id, jenis_pelanggaran_id, tanggal, sanksi, keterangan } = req.body;
    if (!siswa_id || !jenis_pelanggaran_id || !tanggal) {
      return res.status(400).json({ message: 'Siswa, jenis pelanggaran, dan tanggal wajib diisi' });
    }
    const [result] = await db.query(
      'INSERT INTO pelanggaran (siswa_id, jenis_pelanggaran_id, guru_pencatat_id, tanggal, sanksi, keterangan) VALUES (?, ?, ?, ?, ?, ?)',
      [siswa_id, jenis_pelanggaran_id, req.user.id, tanggal, sanksi || null, keterangan || null]
    );
    res.status(201).json({ message: 'Pelanggaran berhasil dicatat', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { siswa_id, jenis_pelanggaran_id, tanggal, sanksi, keterangan } = req.body;
    await db.query(
      'UPDATE pelanggaran SET siswa_id = ?, jenis_pelanggaran_id = ?, tanggal = ?, sanksi = ?, keterangan = ? WHERE id = ?',
      [siswa_id, jenis_pelanggaran_id, tanggal, sanksi || null, keterangan || null, req.params.id]
    );
    res.json({ message: 'Pelanggaran berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM pelanggaran WHERE id = ?', [req.params.id]);
    res.json({ message: 'Pelanggaran berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
