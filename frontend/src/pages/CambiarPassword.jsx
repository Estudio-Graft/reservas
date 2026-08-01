import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';

export default function CambiarPassword() {
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (passwordNueva !== confirmar) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      await API.post('/auth/cambiar-password', { passwordActual, passwordNueva });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="contenedor" style={{ maxWidth: 420 }}>
      <h1>Cambiar contraseña</h1>
      <p style={{ color: '#6B7280' }}>
        Por seguridad, tenés que cambiar la contraseña inicial antes de continuar.
      </p>
      <form className="card" onSubmit={handleSubmit}>
        <label htmlFor="actual">Contraseña actual</label>
        <input id="actual" type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} />

        <label htmlFor="nueva">Contraseña nueva</label>
        <input id="nueva" type="password" value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} />
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
          Mínimo 8 caracteres, con letras, números y al menos un signo (ej: ! @ # $).
        </p>

        <label htmlFor="confirmar">Repetir contraseña nueva</label>
        <input id="confirmar" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />

        {error && <div className="mensaje-error">{error}</div>}

        <button type="submit" className="btn-primario" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </div>
  );
}
