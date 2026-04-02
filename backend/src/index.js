require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/kelas', require('./routes/kelas'));
app.use('/api/siswa', require('./routes/siswa'));
app.use('/api/konseling', require('./routes/konseling'));
app.use('/api/pelanggaran', require('./routes/pelanggaran'));
app.use('/api/jenis-pelanggaran', require('./routes/jenisPelanggaran'));
app.use('/api/surat-masuk', require('./routes/suratMasuk'));
app.use('/api/surat-keluar', require('./routes/suratKeluar'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/laporan', require('./routes/laporan'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
