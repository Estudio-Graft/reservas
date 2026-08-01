import { useState, useEffect } from 'react';
import API from '../api/client';
import SelectorFecha from '../components/SelectorFecha';
import SelectorHorario from '../components/SelectorHorario';
import FormularioCliente from '../components/FormularioCliente';

export default function Reservar() {
  const [fecha, setFecha] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [motivoNoDisponible, setMotivoNoDisponible] = useState('');
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  const [datos, setDatos] = useState({ nombre: '', apellido: '', email: '', telefono: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    if (!fecha) return;

    setCargandoHorarios(true);
    setHorarioSeleccionado('');
    setMotivoNoDisponible('');
    setError('');

    API.get('/disponibilidad', { params: { fecha } })
      .then((res) => {
        if (!res.data.disponible) {
          setMotivoNoDisponible(res.data.motivo);
          setHorarios([]);
        } else {
          setHorarios(res.data.horarios);
        }
      })
      .catch(() => setError('No se pudo consultar la disponibilidad. Intentá de nuevo.'))
      .finally(() => setCargandoHorarios(false));
  }, [fecha]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!fecha || !horarioSeleccionado) {
      setError('Elegí una fecha y un horario.');
      return;
    }
    if (!datos.nombre || !datos.apellido || !datos.email || !datos.telefono) {
      setError('Completá todos los datos: nombre, apellido, email y teléfono.');
      return;
    }

    setEnviando(true);
    try {
      const res = await API.post('/turnos', {
        fecha,
        hora: horarioSeleccionado,
        ...datos,
      });
      setExito(res.data.mensaje);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo reservar el turno. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (exito) {
    return (
      <div className="contenedor">
        <div className="card">
          <h2>¡Listo!</h2>
          <p>{exito}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor">
      <h1>Reservar un turno</h1>
      <form className="card" onSubmit={handleSubmit}>
        <SelectorFecha valor={fecha} onChange={setFecha} />

        {fecha && (
          <SelectorHorario
            horarios={horarios}
            seleccionado={horarioSeleccionado}
            onSeleccionar={setHorarioSeleccionado}
            cargando={cargandoHorarios}
            motivoNoDisponible={motivoNoDisponible}
          />
        )}

        {horarioSeleccionado && <FormularioCliente datos={datos} onChange={setDatos} />}

        {error && <div className="mensaje-error">{error}</div>}

        <button type="submit" className="btn-primario" disabled={enviando || !horarioSeleccionado}>
          {enviando ? 'Enviando...' : 'Solicitar turno'}
        </button>
      </form>
    </div>
  );
}
