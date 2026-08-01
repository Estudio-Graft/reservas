export default function SelectorHorario({ horarios, seleccionado, onSeleccionar, cargando, motivoNoDisponible }) {
  if (cargando) return <p>Buscando horarios disponibles...</p>;

  if (motivoNoDisponible) {
    return <p style={{ color: '#6B7280' }}>{motivoNoDisponible}</p>;
  }

  if (!horarios || horarios.length === 0) {
    return <p style={{ color: '#6B7280' }}>No quedan horarios libres para ese día. Probá con otra fecha.</p>;
  }

  return (
    <div>
      <label>Elegí un horario</label>
      <div className="horarios-grid">
        {horarios.map((h) => (
          <button
            key={h}
            type="button"
            className={`horario-btn ${seleccionado === h ? 'seleccionado' : ''}`}
            onClick={() => onSeleccionar(h)}
          >
            {h}
          </button>
        ))}
      </div>
    </div>
  );
}
