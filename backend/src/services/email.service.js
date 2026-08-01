const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // "contraseña de aplicación" de Gmail, no la contraseña normal
  },
});

async function enviarMail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_NOMBRE || 'Sistema de Turnos'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    // no tiramos el error hacia arriba: si falla el mail, no debe romper la confirmación del turno
    console.error('Error al enviar email:', error.message);
  }
}

function emailTurnoConfirmado(turno) {
  return enviarMail({
    to: turno.email,
    subject: 'Tu turno fue confirmado ✅',
    html: `
      <h2>¡Turno confirmado!</h2>
      <p>Hola ${turno.nombre},</p>
      <p>Tu turno para el día <strong>${turno.fecha}</strong> a las <strong>${turno.hora}hs</strong> fue confirmado.</p>
      <p>¡Te esperamos!</p>
    `,
  });
}

function emailTurnoCancelado(turno, urlReagendar) {
  return enviarMail({
    to: turno.email,
    subject: 'Tu turno fue cancelado',
    html: `
      <h2>Turno cancelado</h2>
      <p>Hola ${turno.nombre},</p>
      <p>Lamentablemente tu turno para el día <strong>${turno.fecha}</strong> a las <strong>${turno.hora}hs</strong> fue cancelado.</p>
      <p>Podés reagendar uno nuevo ingresando acá: <a href="${urlReagendar}">${urlReagendar}</a></p>
    `,
  });
}

module.exports = { enviarMail, emailTurnoConfirmado, emailTurnoCancelado };
