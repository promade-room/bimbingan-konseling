const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jenis_pelanggaran ORDER BY tingkat, nama');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jenis_pelanggaran WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Jenis pelanggaran tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama, tingkat, poin } = req.body;
    if (!nama || !tingkat) {
      return res.status(400).json({ message: 'Nama dan tingkat wajib diisi' });
    }
    const [result] = await db.query('INSERT INTO jenis_pelanggaran (nama, tingkat, poin) VALUES (?, ?, ?)', [nama, tingkat, poin || 0]);
    res.status(201).json({ message: 'Jenis pelanggaran berhasil dibuat', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama, tingkat, poin } = req.body;
    await db.query('UPDATE jenis_pelanggaran SET nama = ?, tingkat = ?, poin = ? WHERE id = ?', [nama, tingkat, poin || 0, req.params.id]);
    res.json({ message: 'Jenis pelanggaran berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM jenis_pelanggaran WHERE id = ?', [req.params.id]);
    res.json({ message: 'Jenis pelanggaran berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
