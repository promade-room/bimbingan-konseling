const bcrypt = require('bcryptjs');
const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    let query = 'SELECT id, nama, email, role, foto, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nama LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    // Count total
    const countQuery = query.replace('SELECT id, nama, email, role, foto, created_at', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
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
    const [rows] = await db.query('SELECT id, nama, email, role, foto, created_at FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    if (!nama || !email || !password || !role) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email sudah digunakan' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)', [nama, email, hash, role]);
    res.status(201).json({ message: 'User berhasil dibuat', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    const id = req.params.id;

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await db.query('UPDATE users SET nama = ?, email = ?, password = ?, role = ? WHERE id = ?', [nama, email, hash, role, id]);
    } else {
      await db.query('UPDATE users SET nama = ?, email = ?, role = ? WHERE id = ?', [nama, email, role, id]);
    }
    res.json({ message: 'User berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'Tidak bisa menghapus akun sendiri' });
    }
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
