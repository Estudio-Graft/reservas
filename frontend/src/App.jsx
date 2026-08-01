import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Reservar from './pages/Reservar';
import AdminLogin from './pages/AdminLogin';
import CambiarPassword from './pages/CambiarPassword';
import AdminDashboard from './pages/AdminDashboard';

function estaAutenticado() {
  return Boolean(localStorage.getItem('token'));
}

function RutaProtegida({ children }) {
  if (!estaAutenticado()) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Reservar />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/cambiar-password" element={<CambiarPassword />} />
        <Route
          path="/admin/dashboard"
          element={
            <RutaProtegida>
              <AdminDashboard />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
