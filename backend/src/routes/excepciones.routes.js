const express = require('express');
const router = express.Router();
const { listarExcepciones, crearExcepcion, eliminarExcepcion } = require('../controllers/excepciones.controller');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, listarExcepciones);
router.post('/', requireAuth, crearExcepcion);
router.delete('/:id', requireAuth, eliminarExcepcion);

module.exports = router;
