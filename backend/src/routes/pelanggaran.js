const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const controller = require('../controllers/pelanggaranController');

router.use(auth);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize('admin', 'guru_bk', 'wali_kelas'), controller.create);
router.put('/:id', authorize('admin', 'guru_bk'), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);

module.exports = router;
