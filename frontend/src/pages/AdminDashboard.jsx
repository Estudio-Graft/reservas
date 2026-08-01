import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PanelTurnos from '../components/PanelTurnos';
import PanelConfiguracion from '../components/PanelConfiguracion';
import PanelExcepciones from '../components/PanelExcepciones';

const SECCIONES = [
  { valor: 'turnos', etiqueta: 'Turnos' },
  { valor: 'configuracion', etiqueta: 'Horarios' },
  { valor: 'excepciones', etiqueta: 'Días bloqueados' },
];

export default function AdminDashboard() {
  const [seccion, setSeccion] = useState('turnos');
  const navigate = useNavigate();

  function cerrarSesion() {
    localStorage.removeItem('token');
    navigate('/admin');
  }

  return (
    <div className="contenedor-ancho">
      <div className="header-admin">
        <h1>Panel de administración</h1>
        <button className="btn-secundario" onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      <div className="tabs">
        {SECCIONES.map((s) => (
          <button
            key={s.valor}
            className={`tab-btn ${seccion === s.valor ? 'activo' : ''}`}
            onClick={() => setSeccion(s.valor)}
          >
            {s.etiqueta}
          </button>
        ))}
      </div>

      {seccion === 'turnos' && <PanelTurnos />}
      {seccion === 'configuracion' && <PanelConfiguracion />}
      {seccion === 'excepciones' && <PanelExcepciones />}
    </div>
  );
}
