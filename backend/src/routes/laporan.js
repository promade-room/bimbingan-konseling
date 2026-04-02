const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const controller = require('../controllers/laporanController');

router.use(auth);
router.get('/konseling', authorize('admin', 'guru_bk', 'wali_kelas'), controller.laporanKonseling);
router.get('/pelanggaran', authorize('admin', 'guru_bk', 'wali_kelas'), controller.laporanPelanggaran);

module.exports = router;
