const express = require('express');
const router = express.Router();
const { login, cambiarPassword } = require('../controllers/auth.controller');
const requireAuth = require('../middleware/auth');

router.post('/login', login);
router.post('/cambiar-password', requireAuth, cambiarPassword);

module.exports = router;
