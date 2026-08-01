const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  consultarDisponibilidad,
  crearTurno,
  listarTurnos,
  confirmarTurno,
  cancelarTurno,
} = require('../controllers/turnos.controller');
const requireAuth = require('../middleware/auth');

// Anti-spam simple: como mucho 10 pedidos de turno cada 15 minutos por IP
const limiteReservas = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Probá de nuevo en unos minutos.' },
});

// Públicas (las usa el cliente que reserva)
router.get('/disponibilidad', consultarDisponibilidad);
router.post('/turnos', limiteReservas, crearTurno);

// Protegidas (las usa el admin)
router.get('/turnos', requireAuth, listarTurnos);
router.patch('/turnos/:id/confirmar', requireAuth, confirmarTurno);
router.patch('/turnos/:id/cancelar', requireAuth, cancelarTurno);

module.exports = router;
