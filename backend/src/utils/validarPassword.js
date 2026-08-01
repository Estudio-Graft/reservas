/**
 * Exige mínimo 8 caracteres, al menos una letra, un número y un signo.
 * Devuelve { valido: boolean, motivo: string }
 */
function validarPassword(password) {
  if (!password || password.length < 8) {
    return { valido: false, motivo: 'Debe tener al menos 8 caracteres.' };
  }
  const tieneLetra = /[a-zA-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);
  const tieneSigno = /[^a-zA-Z0-9]/.test(password);

  if (!tieneLetra) return { valido: false, motivo: 'Debe incluir al menos una letra.' };
  if (!tieneNumero) return { valido: false, motivo: 'Debe incluir al menos un número.' };
  if (!tieneSigno) return { valido: false, motivo: 'Debe incluir al menos un signo (ej: ! @ # $ %).' };

  return { valido: true, motivo: '' };
}

module.exports = validarPassword;
