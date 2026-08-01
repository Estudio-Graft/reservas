const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const Turno = sequelize.define('Turno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    // "YYYY-MM-DD"
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora: {
    // "HH:mm"
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
}, {
  indexes: [
    {
      // evita dos turnos activos (no cancelados) en el mismo dia+hora
      unique: true,
      fields: ['fecha', 'hora'],
      where: { estado: { [Op.ne]: 'cancelado' } },
      name: 'turno_fecha_hora_unico_si_activo',
    },
  ],
});

module.exports = Turno;
