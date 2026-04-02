const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { search, tingkat } = req.query;
    let query = `SELECT k.*, u.nama as wali_kelas_nama FROM kelas k LEFT JOIN users u ON k.wali_kelas_id = u.id WHERE 1=1`;
    const params = [];

    if (search) {
      query += ' AND k.nama_kelas LIKE ?';
      params.push(`%${search}%`);
    }
    if (tingkat) {
      query += ' AND k.tingkat = ?';
      params.push(tingkat);
    }
    query += ' ORDER BY k.tingkat, k.nama_kelas';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT k.*, u.nama as wali_kelas_nama FROM kelas k LEFT JOIN users u ON k.wali_kelas_id = u.id WHERE k.id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama_kelas, tingkat, wali_kelas_id } = req.body;
    if (!nama_kelas || !tingkat) {
      return res.status(400).json({ message: 'Nama kelas dan tingkat wajib diisi' });
    }
    const [result] = await db.query('INSERT INTO kelas (nama_kelas, tingkat, wali_kelas_id) VALUES (?, ?, ?)', [nama_kelas, tingkat, wali_kelas_id || null]);
    res.status(201).json({ message: 'Kelas berhasil dibuat', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama_kelas, tingkat, wali_kelas_id } = req.body;
    await db.query('UPDATE kelas SET nama_kelas = ?, tingkat = ?, wali_kelas_id = ? WHERE id = ?', [nama_kelas, tingkat, wali_kelas_id || null, req.params.id]);
    res.json({ message: 'Kelas berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM kelas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Kelas berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
