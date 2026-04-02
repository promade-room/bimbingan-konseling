const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { search, kelas_id, page = 1, limit = 10 } = req.query;
    let query = `SELECT s.*, k.nama_kelas, k.tingkat FROM siswa s JOIN kelas k ON s.kelas_id = k.id WHERE 1=1`;
    const params = [];

    // Role-based filtering
    if (req.user.role === 'wali_kelas') {
      query += ' AND s.kelas_id IN (SELECT id FROM kelas WHERE wali_kelas_id = ?)';
      params.push(req.user.id);
    } else if (req.user.role === 'siswa') {
      query += ' AND s.user_id = ?';
      params.push(req.user.id);
    }

    if (search) {
      query += ' AND (s.nama LIKE ? OR s.nis LIKE ? OR s.nisn LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (kelas_id) {
      query += ' AND s.kelas_id = ?';
      params.push(kelas_id);
    }

    const countQuery = `SELECT COUNT(*) as total FROM siswa s JOIN kelas k ON s.kelas_id = k.id WHERE 1=1${query.substring(query.indexOf('WHERE 1=1') + 9)}`;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY k.tingkat, k.nama_kelas, s.nama LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await db.query(query, params);
    res.json({
      data: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT s.*, k.nama_kelas, k.tingkat FROM siswa s JOIN kelas k ON s.kelas_id = k.id WHERE s.id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nis, nisn, nama, jenis_kelamin, kelas_id, alamat, no_hp_ortu } = req.body;
    if (!nis || !nama || !jenis_kelamin || !kelas_id) {
      return res.status(400).json({ message: 'NIS, nama, jenis kelamin, dan kelas wajib diisi' });
    }
    const [result] = await db.query(
      'INSERT INTO siswa (nis, nisn, nama, jenis_kelamin, kelas_id, alamat, no_hp_ortu) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nis, nisn || null, nama, jenis_kelamin, kelas_id, alamat || null, no_hp_ortu || null]
    );
    res.status(201).json({ message: 'Siswa berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'NIS/NISN sudah terdaftar' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nis, nisn, nama, jenis_kelamin, kelas_id, alamat, no_hp_ortu } = req.body;
    await db.query(
      'UPDATE siswa SET nis = ?, nisn = ?, nama = ?, jenis_kelamin = ?, kelas_id = ?, alamat = ?, no_hp_ortu = ? WHERE id = ?',
      [nis, nisn || null, nama, jenis_kelamin, kelas_id, alamat || null, no_hp_ortu || null, req.params.id]
    );
    res.json({ message: 'Siswa berhasil diupdate' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'NIS/NISN sudah terdaftar' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM siswa WHERE id = ?', [req.params.id]);
    res.json({ message: 'Siswa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
