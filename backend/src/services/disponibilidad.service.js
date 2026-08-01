const { Configuracion, DiaExcepcion, Turno } = require('../models');
const { Op } = require('sequelize');

/**
 * Suma minutos a una hora en formato "HH:mm" y devuelve otro "HH:mm"
 */
function sumarMinutos(horaStr, minutos) {
  const [h, m] = horaStr.split(':').map(Number);
  const total = h * 60 + m + minutos;
  const nuevaH = Math.floor(total / 60);
  const nuevaM = total % 60;
  return `${String(nuevaH).padStart(2, '0')}:${String(nuevaM).padStart(2, '0')}`;
}

function horaAMinutos(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Devuelve true si la fecha (YYYY-MM-DD) cumple la regla de "1 día de antelación":
 * solo se puede reservar para mañana en adelante, nunca para hoy.
 */
function cumpleAntelacionMinima(fechaStr) {
  const hoy = new Date();
  const hoyStr = hoy.toISOString().slice(0, 10);
  return fechaStr > hoyStr;
}

/**
 * Calcula los horarios disponibles para una fecha puntual.
 * Devuelve { disponible: boolean, motivo?: string, horarios: string[] }
 */
async function obtenerDisponibilidad(fechaStr) {
  if (!cumpleAntelacionMinima(fechaStr)) {
    return { disponible: false, motivo: 'Los turnos deben reservarse con al menos un día de antelación.', horarios: [] };
  }

  const config = await Configuracion.findOne();
  if (!config) {
    return { disponible: false, motivo: 'El sistema todavía no tiene una configuración de horarios.', horarios: [] };
  }

  // ¿Es un día laboral según el día de la semana?
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  const fechaObj = new Date(anio, mes - 1, dia);
  const diaSemana = fechaObj.getDay(); // 0=domingo ... 6=sabado

  if (!config.diasLaborales.includes(diaSemana)) {
    return { disponible: false, motivo: 'Ese día no es un día laboral.', horarios: [] };
  }

  // ¿Está bloqueado por excepción puntual?
  const excepcion = await DiaExcepcion.findOne({ where: { fecha: fechaStr } });
  if (excepcion) {
    return { disponible: false, motivo: excepcion.motivo || 'Día no disponible.', horarios: [] };
  }

  // Armar la lista completa de horarios posibles según la configuración
  const todosLosHorarios = [];
  let cursor = config.horaInicio;
  while (horaAMinutos(cursor) < horaAMinutos(config.horaFin)) {
    todosLosHorarios.push(cursor);
    cursor = sumarMinutos(cursor, config.duracionTurnoMinutos);
  }

  // Sacar los horarios que ya estén ocupados (pendientes o confirmados) ese día
  const turnosDelDia = await Turno.findAll({
    where: {
      fecha: fechaStr,
      estado: { [Op.ne]: 'cancelado' },
    },
  });
  const horariosOcupados = new Set(turnosDelDia.map((t) => t.hora));

  const horariosLibres = todosLosHorarios.filter((h) => !horariosOcupados.has(h));

  return { disponible: true, horarios: horariosLibres };
}

module.exports = { obtenerDisponibilidad, cumpleAntelacionMinima, horaAMinutos, sumarMinutos };
