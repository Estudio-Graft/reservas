import { useState, useEffect } from 'react';
import API from '../api/client';

const FILTROS = [
  { valor: 'pendiente', etiqueta: 'Pendientes' },
  { valor: 'confirmado', etiqueta: 'Confirmados' },
  { valor: 'cancelado', etiqueta: 'Cancelados' },
];

export default function PanelTurnos() {
  const [filtro, setFiltro] = useState('pendiente');
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(false);

  function cargar() {
    setCargando(true);
    API.get('/turnos', { params: { estado: filtro } })
      .then((res) => setTurnos(res.data))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  async function confirmar(id) {
    await API.patch(`/turnos/${id}/confirmar`);
    cargar();
  }

  async function cancelar(id) {
    const ok = window.confirm('¿Cancelar este turno? Se le va a avisar al cliente por email.');
    if (!ok) return;
    await API.patch(`/turnos/${id}/cancelar`);
    cargar();
  }

  return (
    <div className="card">
      <h3>Turnos</h3>

      <div className="tabs">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            className={`tab-btn ${filtro === f.valor ? 'activo' : ''}`}
            onClick={() => setFiltro(f.valor)}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {cargando && <p>Cargando...</p>}

      <div style={{ overflowX: 'auto' }}>
        <table className="tabla-responsive">
          <thead>
            <tr>
              <th>Fecha</th><th>Hora</th><th>Cliente</th><th>Contacto</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {!cargando && turnos.length === 0 && (
              <tr><td colSpan={6} style={{ color: '#6B7280' }}>No hay turnos en este estado.</td></tr>
            )}
            {turnos.map((t) => (
              <tr key={t.id}>
                <td>{t.fecha}</td>
                <td>{t.hora}</td>
                <td>{t.nombre} {t.apellido}</td>
                <td>{t.email}<br />{t.telefono}</td>
                <td><span className={`badge badge-${t.estado}`}>{t.estado}</span></td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {t.estado === 'pendiente' && (
                    <>
                      <button className="btn-primario" style={{ marginRight: 6, padding: '8px 12px' }} onClick={() => confirmar(t.id)}>
                        Confirmar
                      </button>
                      <button className="btn-peligro" style={{ padding: '8px 12px' }} onClick={() => cancelar(t.id)}>
                        Cancelar
                      </button>
                    </>
                  )}
                  {t.estado === 'confirmado' && (
                    <button className="btn-peligro" style={{ padding: '8px 12px' }} onClick={() => cancelar(t.id)}>
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
