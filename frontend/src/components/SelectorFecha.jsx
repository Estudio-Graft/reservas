function manana() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  return fecha.toISOString().slice(0, 10);
}

export default function SelectorFecha({ valor, onChange }) {
  return (
    <div>
      <label htmlFor="fecha">Elegí un día</label>
      <input
        id="fecha"
        type="date"
        min={manana()}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      />
      <p style={{ fontSize: 13, color: '#6B7280', marginTop: 6 }}>
        Los turnos deben reservarse con al menos un día de anticipación.
      </p>
    </div>
  );
}
