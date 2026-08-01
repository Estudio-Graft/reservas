const { DiaExcepcion } = require('../models');

const listarExcepciones = async (req, res) => {
  try {
    const excepciones = await DiaExcepcion.findAll({ order: [['fecha', 'ASC']] });
    res.json(excepciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los días de excepción.' });
  }
};

const crearExcepcion = async (req, res) => {
  try {
    const { fecha, motivo } = req.body;
    if (!fecha) return res.status(400).json({ error: 'La fecha es obligatoria.' });

    const existente = await DiaExcepcion.findOne({ where: { fecha } });
    if (existente) {
      return res.status(409).json({ error: 'Ese día ya está marcado como excepción.' });
    }

    const excepcion = await DiaExcepcion.create({ fecha, motivo });
    res.status(201).json(excepcion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la excepción.' });
  }
};

const eliminarExcepcion = async (req, res) => {
  try {
    const eliminado = await DiaExcepcion.destroy({ where: { id: req.params.id } });
    if (!eliminado) return res.status(404).json({ error: 'No encontrado.' });
    res.json({ mensaje: 'Excepción eliminada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la excepción.' });
  }
};

module.exports = { listarExcepciones, crearExcepcion, eliminarExcepcion };
