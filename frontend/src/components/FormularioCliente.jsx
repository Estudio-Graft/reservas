export default function FormularioCliente({ datos, onChange }) {
  return (
    <div>
      <div className="grid-2">
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            value={datos.nombre}
            onChange={(e) => onChange({ ...datos, nombre: e.target.value })}
            placeholder="Juan"
          />
        </div>
        <div>
          <label htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            value={datos.apellido}
            onChange={(e) => onChange({ ...datos, apellido: e.target.value })}
            placeholder="Pérez"
          />
        </div>
      </div>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={datos.email}
        onChange={(e) => onChange({ ...datos, email: e.target.value })}
        placeholder="juan@mail.com"
      />

      <label htmlFor="telefono">Teléfono</label>
      <input
        id="telefono"
        value={datos.telefono}
        onChange={(e) => onChange({ ...datos, telefono: e.target.value })}
        placeholder="11 2233 4455"
      />
    </div>
  );
}
