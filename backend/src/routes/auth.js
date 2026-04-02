const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const controller = require('../controllers/authController');

router.post('/login', controller.login);
router.get('/me', auth, controller.me);
router.put('/profile', auth, controller.updateProfile);
router.put('/password', auth, controller.changePassword);

module.exports = router;
