const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const controller = require('../controllers/dashboardController');

router.use(auth);
router.get('/stats', controller.getStats);
router.get('/konseling-chart', controller.getKonselingChart);
router.get('/pelanggaran-chart', controller.getPelanggaranChart);
router.get('/recent', controller.getRecentActivity);

module.exports = router;
