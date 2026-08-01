const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Días puntuales que el admin bloquea (feriados, ausencias, etc.)
// aunque ese día de la semana normalmente sea laboral.
const DiaExcepcion = sequelize.define('DiaExcepcion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    // formato "YYYY-MM-DD"
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = DiaExcepcion;
