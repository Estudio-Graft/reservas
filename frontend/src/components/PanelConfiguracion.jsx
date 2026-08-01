import { useState, useEffect } from 'react';
import API from '../api/client';

const DIAS = [
  { valor: 1, etiqueta: 'Lun' },
  { valor: 2, etiqueta: 'Mar' },
  { valor: 3, etiqueta: 'Mié' },
  { valor: 4, etiqueta: 'Jue' },
  { valor: 5, etiqueta: 'Vie' },
  { valor: 6, etiqueta: 'Sáb' },
  { valor: 0, etiqueta: 'Dom' },
];

export default function PanelConfiguracion() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    API.get('/config').then((res) => setConfig(res.data));
  }, []);

  function toggleDia(dia) {
    const actuales = config.diasLaborales;
    const nuevos = actuales.includes(dia)
      ? actuales.filter((d) => d !== dia)
      : [...actuales, dia];
    setConfig({ ...config, diasLaborales: nuevos });
  }

  async function guardar() {
    setError('');
    setExito('');
    setGuardando(true);
    try {
      const res = await API.put('/config', config);
      setConfig(res.data);
      setExito('Configuración guardada.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar.');
    } finally {
      setGuardando(false);
    }
  }

  if (!config) return <p>Cargando configuración...</p>;

  return (
    <div className="card">
      <h3>Horarios de atención</h3>

      <div className="grid-2">
        <div>
          <label htmlFor="horaInicio">Desde</label>
          <input
            id="horaInicio"
            type="time"
            value={config.horaInicio}
            onChange={(e) => setConfig({ ...config, horaInicio: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="horaFin">Hasta</label>
          <input
            id="horaFin"
            type="time"
            value={config.horaFin}
            onChange={(e) => setConfig({ ...config, horaFin: e.target.value })}
          />
        </div>
      </div>

      <label htmlFor="duracion">Duración de cada turno (minutos)</label>
      <input
        id="duracion"
        type="number"
        min="15"
        step="15"
        value={config.duracionTurnoMinutos}
        onChange={(e) => setConfig({ ...config, duracionTurnoMinutos: Number(e.target.value) })}
      />

      <label>Días laborales</label>
      <div className="dias-semana">
        {DIAS.map((d) => (
          <label key={d.valor} className="dia-check">
            <input
              type="checkbox"
              checked={config.diasLaborales.includes(d.valor)}
              onChange={() => toggleDia(d.valor)}
            />
            {d.etiqueta}
          </label>
        ))}
      </div>

      {error && <div className="mensaje-error">{error}</div>}
      {exito && <div className="mensaje-exito">{exito}</div>}

      <button className="btn-primario" onClick={guardar} disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  );
}
