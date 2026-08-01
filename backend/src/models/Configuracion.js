const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Guardamos una sola fila (singleton) con la configuración general del calendario.
const Configuracion = sequelize.define('Configuracion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  horaInicio: {
    // formato "HH:mm", ej "08:00"
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '08:00',
  },
  horaFin: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '19:00',
  },
  duracionTurnoMinutos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
  },
  diasLaborales: {
    // array de números 0 (domingo) a 6 (sábado). Ej: [1,2,3,4,5] = lunes a viernes
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [1, 2, 3, 4, 5],
  },
});

module.exports = Configuracion;
