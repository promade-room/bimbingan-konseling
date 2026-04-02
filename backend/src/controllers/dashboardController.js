const db = require('../config/database');

exports.getStats = async (req, res) => {
  try {
    const now = new Date();
    const bulanIni = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let siswaCondition = '';
    let siswaParams = [];
    if (req.user.role === 'wali_kelas') {
      siswaCondition = ' WHERE kelas_id IN (SELECT id FROM kelas WHERE wali_kelas_id = ?)';
      siswaParams = [req.user.id];
    } else if (req.user.role === 'siswa') {
      siswaCondition = ' WHERE user_id = ?';
      siswaParams = [req.user.id];
    }

    // Total siswa
    const [siswaCount] = await db.query(`SELECT COUNT(*) as total FROM siswa${siswaCondition}`, siswaParams);

    // Konseling bulan ini
    let konselingQuery = 'SELECT COUNT(*) as total FROM konseling WHERE DATE_FORMAT(tanggal, "%Y-%m") = ?';
    let konselingParams = [bulanIni];
    if (req.user.role === 'wali_kelas') {
      konselingQuery += ' AND siswa_id IN (SELECT id FROM siswa WHERE kelas_id IN (SELECT id FROM kelas WHERE wali_kelas_id = ?))';
      konselingParams.push(req.user.id);
    } else if (req.user.role === 'siswa') {
      konselingQuery += ' AND siswa_id IN (SELECT id FROM siswa WHERE user_id = ?)';
      konselingParams.push(req.user.id);
    }
    const [konselingCount] = await db.query(konselingQuery, konselingParams);

    // Pelanggaran bulan ini
    let pelanggaranQuery = 'SELECT COUNT(*) as total FROM pelanggaran WHERE DATE_FORMAT(tanggal, "%Y-%m") = ?';
    let pelanggaranParams = [bulanIni];
    if (req.user.role === 'wali_kelas') {
      pelanggaranQuery += ' AND siswa_id IN (SELECT id FROM siswa WHERE kelas_id IN (SELECT id FROM kelas WHERE wali_kelas_id = ?))';
      pelanggaranParams.push(req.user.id);
    } else if (req.user.role === 'siswa') {
      pelanggaranQuery += ' AND siswa_id IN (SELECT id FROM siswa WHERE user_id = ?)';
      pelanggaranParams.push(req.user.id);
    }
    const [pelanggaranCount] = await db.query(pelanggaranQuery, pelanggaranParams);

    // Surat pending (belum ada file / belum ditindak lanjuti)
    const [suratMasukCount] = await db.query('SELECT COUNT(*) as total FROM surat_masuk');
    const [suratKeluarCount] = await db.query('SELECT COUNT(*) as total FROM surat_keluar');

    // Total kelas
    const [kelasCount] = await db.query('SELECT COUNT(*) as total FROM kelas');

    res.json({
      total_siswa: siswaCount[0].total,
      konseling_bulan_ini: konselingCount[0].total,
      pelanggaran_bulan_ini: pelanggaranCount[0].total,
      total_surat_masuk: suratMasukCount[0].total,
      total_surat_keluar: suratKeluarCount[0].total,
      total_kelas: kelasCount[0].total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getKonselingChart = async (req, res) => {
  try {
    const { tahun } = req.query;
    const year = tahun || new Date().getFullYear();

    const [rows] = await db.query(
      `SELECT MONTH(tanggal) as bulan, COUNT(*) as total FROM konseling WHERE YEAR(tanggal) = ? GROUP BY MONTH(tanggal) ORDER BY bulan`,
      [year]
    );

    // Fill missing months with 0
    const chart = Array.from({ length: 12 }, (_, i) => {
      const found = rows.find(r => r.bulan === i + 1);
      return { bulan: i + 1, total: found ? found.total : 0 };
    });

    res.json(chart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPelanggaranChart = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT jp.tingkat, COUNT(*) as total FROM pelanggaran p JOIN jenis_pelanggaran jp ON p.jenis_pelanggaran_id = jp.id GROUP BY jp.tingkat`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const [konseling] = await db.query(
      `SELECT 'konseling' as type, ks.id, ks.tanggal, s.nama as siswa_nama, k.nama_kelas, u.nama as guru_nama, ks.jenis_layanan, NULL as jenis_pelanggaran
       FROM konseling ks JOIN siswa s ON ks.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN users u ON ks.guru_bk_id = u.id ORDER BY ks.created_at DESC LIMIT 5`
    );

    const [pelanggaran] = await db.query(
      `SELECT 'pelanggaran' as type, p.id, p.tanggal, s.nama as siswa_nama, k.nama_kelas, u.nama as guru_nama, NULL as jenis_layanan, jp.nama as jenis_pelanggaran
       FROM pelanggaran p JOIN siswa s ON p.siswa_id = s.id JOIN kelas k ON s.kelas_id = k.id JOIN users u ON p.guru_pencatat_id = u.id JOIN jenis_pelanggaran jp ON p.jenis_pelanggaran_id = jp.id ORDER BY p.created_at DESC LIMIT 5`
    );

    const combined = [...konseling, ...pelanggaran].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
    res.json(combined);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
