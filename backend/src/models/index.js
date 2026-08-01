const sequelize = require('../config/database');
const Admin = require('./Admin');
const Configuracion = require('./Configuracion');
const DiaExcepcion = require('./DiaExcepcion');
const Turno = require('./Turno');

module.exports = {
  sequelize,
  Admin,
  Configuracion,
  DiaExcepcion,
  Turno,
};
