import { useState, useEffect } from 'react';
import API from '../api/client';

export default function PanelExcepciones() {
  const [excepciones, setExcepciones] = useState([]);
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  function cargar() {
    API.get('/excepciones').then((res) => setExcepciones(res.data));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function agregar(e) {
    e.preventDefault();
    setError('');
    if (!fecha) {
      setError('Elegí una fecha.');
      return;
    }
    try {
      await API.post('/excepciones', { fecha, motivo });
      setFecha('');
      setMotivo('');
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agregar la excepción.');
    }
  }

  async function eliminar(id) {
    await API.delete(`/excepciones/${id}`);
    cargar();
  }

  return (
    <div className="card">
      <h3>Días bloqueados (feriados, ausencias)</h3>

      <form onSubmit={agregar}>
        <div className="grid-2">
          <div>
            <label htmlFor="fechaExcepcion">Fecha</label>
            <input id="fechaExcepcion" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div>
            <label htmlFor="motivo">Motivo (opcional)</label>
            <input id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: Feriado" />
          </div>
        </div>
        {error && <div className="mensaje-error">{error}</div>}
        <button type="submit" className="btn-primario">Bloquear ese día</button>
      </form>

      <div style={{ marginTop: 20, overflowX: 'auto' }}>
        <table className="tabla-responsive">
          <thead>
            <tr><th>Fecha</th><th>Motivo</th><th></th></tr>
          </thead>
          <tbody>
            {excepciones.length === 0 && (
              <tr><td colSpan={3} style={{ color: '#6B7280' }}>No hay días bloqueados.</td></tr>
            )}
            {excepciones.map((ex) => (
              <tr key={ex.id}>
                <td>{ex.fecha}</td>
                <td>{ex.motivo || '—'}</td>
                <td>
                  <button className="btn-secundario" onClick={() => eliminar(ex.id)}>Quitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
