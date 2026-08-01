const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const validarPassword = require('../utils/validarPassword');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const passwordOk = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      debeCambiarPassword: admin.debeCambiarPassword,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};

const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) return res.status(404).json({ error: 'Admin no encontrado.' });

    const passwordOk = await bcrypt.compare(passwordActual, admin.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ error: 'La contraseña actual no es correcta.' });
    }

    const { valido, motivo } = validarPassword(passwordNueva);
    if (!valido) {
      return res.status(400).json({ error: motivo });
    }

    admin.passwordHash = await bcrypt.hash(passwordNueva, 10);
    admin.debeCambiarPassword = false;
    await admin.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar la contraseña.' });
  }
};

module.exports = { login, cambiarPassword };
