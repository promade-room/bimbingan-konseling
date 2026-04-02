const db = require('../config/database');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    const { search, tanggal_dari, tanggal_sampai, page = 1, limit = 10 } = req.query;
    let query = 'SELECT * FROM surat_masuk WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nomor_surat LIKE ? OR pengirim LIKE ? OR perihal LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (tanggal_dari) { query += ' AND tanggal_surat >= ?'; params.push(tanggal_dari); }
    if (tanggal_sampai) { query += ' AND tanggal_surat <= ?'; params.push(tanggal_sampai); }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY tanggal_surat DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await db.query(query, params);
    res.json({ data: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM surat_masuk WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, keterangan } = req.body;
    if (!nomor_surat || !tanggal_surat || !tanggal_terima || !pengirim || !perihal) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }
    const file = req.file ? req.file.filename : null;
    const [result] = await db.query(
      'INSERT INTO surat_masuk (nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, file, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, file, keterangan || null]
    );
    res.status(201).json({ message: 'Surat masuk berhasil dicatat', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, keterangan } = req.body;
    const id = req.params.id;

    // If new file uploaded, delete old file
    if (req.file) {
      const [old] = await db.query('SELECT file FROM surat_masuk WHERE id = ?', [id]);
      if (old[0]?.file) {
        const oldPath = path.join(__dirname, '..', 'uploads', old[0].file);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const file = req.file ? req.file.filename : undefined;
    if (file) {
      await db.query(
        'UPDATE surat_masuk SET nomor_surat = ?, tanggal_surat = ?, tanggal_terima = ?, pengirim = ?, perihal = ?, file = ?, keterangan = ? WHERE id = ?',
        [nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, file, keterangan || null, id]
      );
    } else {
      await db.query(
        'UPDATE surat_masuk SET nomor_surat = ?, tanggal_surat = ?, tanggal_terima = ?, pengirim = ?, perihal = ?, keterangan = ? WHERE id = ?',
        [nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, keterangan || null, id]
      );
    }
    res.json({ message: 'Surat masuk berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT file FROM surat_masuk WHERE id = ?', [req.params.id]);
    if (rows[0]?.file) {
      const filePath = path.join(__dirname, '..', 'uploads', rows[0].file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.query('DELETE FROM surat_masuk WHERE id = ?', [req.params.id]);
    res.json({ message: 'Surat masuk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
