const express = require('express');
const router = express.Router();
const { obtenerConfig, actualizarConfig } = require('../controllers/config.controller');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, obtenerConfig);
router.put('/', requireAuth, actualizarConfig);

module.exports = router;
