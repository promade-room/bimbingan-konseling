const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const controller = require('../controllers/userController');

router.use(auth);
router.get('/', authorize('admin'), controller.getAll);
router.get('/:id', authorize('admin'), controller.getById);
router.post('/', authorize('admin'), controller.create);
router.put('/:id', authorize('admin'), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);

module.exports = router;
