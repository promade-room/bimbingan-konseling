const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { search, siswa_id, kelas_id, jenis_layanan, kategori, status, tanggal_dari, tanggal_sampai, page = 1, limit = 10 } = req.query;
    let query = `SELECT ks.*, s.nama as siswa_nama, s.nis, k.nama_kelas, u.nama as guru_bk_nama
                 FROM konseling ks JOIN siswa s ON ks.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN users u ON ks.guru_bk_id = u.id WHERE 1=1`;
    const params = [];

    if (req.user.role === 'wali_kelas') {
      query += ' AND s.kelas_id IN (SELECT id FROM kelas WHERE wali_kelas_id = ?)';
      params.push(req.user.id);
    } else if (req.user.role === 'siswa') {
      query += ' AND s.user_id = ?';
      params.push(req.user.id);
    }

    if (search) {
      query += ' AND (s.nama LIKE ? OR s.nis LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (siswa_id) { query += ' AND ks.siswa_id = ?'; params.push(siswa_id); }
    if (kelas_id) { query += ' AND s.kelas_id = ?'; params.push(kelas_id); }
    if (jenis_layanan) { query += ' AND ks.jenis_layanan = ?'; params.push(jenis_layanan); }
    if (kategori) { query += ' AND ks.kategori = ?'; params.push(kategori); }
    if (status) { query += ' AND ks.status = ?'; params.push(status); }
    if (tanggal_dari) { query += ' AND ks.tanggal >= ?'; params.push(tanggal_dari); }
    if (tanggal_sampai) { query += ' AND ks.tanggal <= ?'; params.push(tanggal_sampai); }

    const countQuery = `SELECT COUNT(*) as total FROM konseling ks JOIN siswa s ON ks.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN users u ON ks.guru_bk_id = u.id WHERE 1=1${query.substring(query.indexOf('WHERE 1=1') + 9)}`;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY ks.tanggal DESC, ks.created_at DESC LIMIT ? OFFSET ?';
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
      'SELECT ks.*, s.nama as siswa_nama, s.nis, k.nama_kelas, u.nama as guru_bk_nama FROM konseling ks JOIN siswa s ON ks.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN users u ON ks.guru_bk_id = u.id WHERE ks.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Data konseling tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { siswa_id, tanggal, jenis_layanan, kategori, keterangan, status } = req.body;
    if (!siswa_id || !tanggal || !jenis_layanan || !kategori) {
      return res.status(400).json({ message: 'Siswa, tanggal, jenis layanan, dan kategori wajib diisi' });
    }
    const [result] = await db.query(
      'INSERT INTO konseling (siswa_id, guru_bk_id, tanggal, jenis_layanan, kategori, keterangan, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [siswa_id, req.user.id, tanggal, jenis_layanan, kategori, keterangan || null, status || 'selesai']
    );
    res.status(201).json({ message: 'Konseling berhasil dicatat', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { siswa_id, tanggal, jenis_layanan, kategori, keterangan, status } = req.body;
    await db.query(
      'UPDATE konseling SET siswa_id = ?, tanggal = ?, jenis_layanan = ?, kategori = ?, keterangan = ?, status = ? WHERE id = ?',
      [siswa_id, tanggal, jenis_layanan, kategori, keterangan || null, status || 'selesai', req.params.id]
    );
    res.json({ message: 'Konseling berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM konseling WHERE id = ?', [req.params.id]);
    res.json({ message: 'Konseling berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
