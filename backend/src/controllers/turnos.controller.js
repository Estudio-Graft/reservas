const { Turno } = require('../models');
const { obtenerDisponibilidad, cumpleAntelacionMinima } = require('../services/disponibilidad.service');
const { emailTurnoConfirmado, emailTurnoCancelado } = require('../services/email.service');
require('dotenv').config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefonoRegex = /^[0-9+\-\s]{6,20}$/;

// GET /api/disponibilidad?fecha=YYYY-MM-DD  (público)
const consultarDisponibilidad = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Falta el parámetro fecha.' });

    const resultado = await obtenerDisponibilidad(fecha);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar disponibilidad.' });
  }
};

// POST /api/turnos  (público — acá se crea el pedido de turno)
const crearTurno = async (req, res) => {
  try {
    const { fecha, hora, nombre, apellido, email, telefono } = req.body;

    if (!fecha || !hora || !nombre || !apellido || !email || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios: nombre, apellido, email, teléfono.' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'El email no tiene un formato válido.' });
    }
    if (!telefonoRegex.test(telefono)) {
      return res.status(400).json({ error: 'El teléfono no tiene un formato válido.' });
    }
    if (!cumpleAntelacionMinima(fecha)) {
      return res.status(400).json({ error: 'Los turnos deben reservarse con al menos un día de antelación.' });
    }

    // Revalidar disponibilidad server-side (nunca confiar solo en lo que mandó el front)
    const disponibilidad = await obtenerDisponibilidad(fecha);
    if (!disponibilidad.disponible || !disponibilidad.horarios.includes(hora)) {
      return res.status(409).json({ error: 'Ese horario ya no está disponible. Elegí otro.' });
    }

    const turno = await Turno.create({
      fecha, hora, nombre, apellido, email, telefono, estado: 'pendiente',
    });

    res.status(201).json({
      mensaje: 'Turno solicitado con éxito. Vas a recibir un email cuando sea confirmado.',
      turno,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Ese horario ya fue reservado por otra persona.' });
    }
    res.status(500).json({ error: 'Error al crear el turno.' });
  }
};

// GET /api/turnos?estado=pendiente  (protegido, admin)
const listarTurnos = async (req, res) => {
  try {
    const { estado } = req.query;
    const where = estado ? { estado } : {};
    const turnos = await Turno.findAll({ where, order: [['fecha', 'ASC'], ['hora', 'ASC']] });
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los turnos.' });
  }
};

// PATCH /api/turnos/:id/confirmar  (protegido, admin)
const confirmarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado.' });

    turno.estado = 'confirmado';
    await turno.save();

    await emailTurnoConfirmado(turno);

    res.json({ mensaje: 'Turno confirmado.', turno });
  } catch (error) {
    res.status(500).json({ error: 'Error al confirmar el turno.' });
  }
};

// PATCH /api/turnos/:id/cancelar  (protegido, admin)
const cancelarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado.' });

    turno.estado = 'cancelado';
    await turno.save();

    const urlReagendar = process.env.FRONTEND_URL || 'http://localhost:5173';
    await emailTurnoCancelado(turno, urlReagendar);

    res.json({ mensaje: 'Turno cancelado.', turno });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar el turno.' });
  }
};

module.exports = {
  consultarDisponibilidad,
  crearTurno,
  listarTurnos,
  confirmarTurno,
  cancelarTurno,
};
