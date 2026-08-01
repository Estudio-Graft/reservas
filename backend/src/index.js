const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { sequelize, Admin } = require('./models');

const authRoutes = require('./routes/auth.routes');
const configRoutes = require('./routes/config.routes');
const excepcionesRoutes = require('./routes/excepciones.routes');
const turnosRoutes = require('./routes/turnos.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/excepciones', excepcionesRoutes);
app.use('/api', turnosRoutes); // expone /api/disponibilidad y /api/turnos

app.get('/', (req, res) => {
  res.json({ mensaje: 'API del sistema de turnos funcionando.' });
});

const PORT = process.env.PORT || 3000;

async function crearAdminInicialSiNoExiste() {
  const existente = await Admin.findOne();
  if (existente) return;

  const claveInicial = process.env.ADMIN_PASSWORD_INICIAL || 'A12345!';
  const passwordHash = await bcrypt.hash(claveInicial, 10);

  await Admin.create({
    email: process.env.ADMIN_EMAIL_INICIAL || 'admin@turnos.com',
    passwordHash,
    debeCambiarPassword: true,
  });

  console.log('---------------------------------------------------');
  console.log('Admin inicial creado:');
  console.log('  email:', process.env.ADMIN_EMAIL_INICIAL || 'admin@turnos.com');
  console.log('  password:', claveInicial, '(vas a tener que cambiarla al ingresar)');
  console.log('---------------------------------------------------');
}

async function iniciar() {
  try {
    await sequelize.authenticate();
    // alter:true actualiza las tablas existentes sin borrar datos (ideal mientras se desarrolla)
    await sequelize.sync({ alter: true });
    await crearAdminInicialSiNoExiste();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

iniciar();
