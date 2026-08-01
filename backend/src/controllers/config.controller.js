const { Configuracion } = require('../models');

const obtenerConfig = async (req, res) => {
  try {
    let config = await Configuracion.findOne();
    if (!config) {
      config = await Configuracion.create({}); // crea con los valores por defecto del modelo
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la configuración.' });
  }
};

const actualizarConfig = async (req, res) => {
  try {
    const { horaInicio, horaFin, duracionTurnoMinutos, diasLaborales } = req.body;

    if (horaInicio >= horaFin) {
      return res.status(400).json({ error: 'La hora de inicio debe ser menor a la hora de fin.' });
    }
    if (!Array.isArray(diasLaborales) || diasLaborales.length === 0) {
      return res.status(400).json({ error: 'Debe seleccionar al menos un día laboral.' });
    }

    let config = await Configuracion.findOne();
    if (!config) {
      config = await Configuracion.create({});
    }

    config.horaInicio = horaInicio;
    config.horaFin = horaFin;
    config.duracionTurnoMinutos = duracionTurnoMinutos;
    config.diasLaborales = diasLaborales;
    await config.save();

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la configuración.' });
  }
};

module.exports = { obtenerConfig, actualizarConfig };
