const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const controller = require('../controllers/suratMasukController');

router.use(auth);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize('admin', 'guru_bk'), upload.single('file'), controller.create);
router.put('/:id', authorize('admin', 'guru_bk'), upload.single('file'), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);

module.exports = router;
