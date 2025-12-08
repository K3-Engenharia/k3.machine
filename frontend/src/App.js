import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EquipamentosList from './pages/EquipamentosList';
import EquipamentoForm from './pages/EquipamentoForm';
import EquipamentoEdit from './pages/EquipamentoEdit';
import AgendarPreventiva from './pages/AgendarPreventiva';
import AgendamentosList from './pages/AgendamentosList';
import AgendamentoEdit from './pages/AgendamentoEdit';
import UsuariosEmpresaAdmin from './pages/UsuariosEmpresaAdmin';
import EmpresaForm from './pages/EmpresaForm';
import AgendamentosCalendario from './pages/AgendamentosCalendario';
import UsuarioCreate from './pages/UsuarioCreate';
import TiposEquipamentoAdmin from './pages/TiposEquipamentoAdmin';
import { startKeepAlive } from './services/keepAlive';

let stopKeepAlive = null;

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  
  // Iniciar keep-alive quando o usuário está autenticado
  if (token && !stopKeepAlive) {
    stopKeepAlive = startKeepAlive();
  }
  
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/equipamentos" element={<PrivateRoute><EquipamentosList /></PrivateRoute>} />
        <Route path="/equipamentos/novo" element={<PrivateRoute><EquipamentoForm /></PrivateRoute>} />
        <Route path="/equipamentos/editar/:id" element={<PrivateRoute><EquipamentoEdit /></PrivateRoute>} />
        <Route path="/equipamentos/:id/agendar" element={<PrivateRoute><AgendarPreventiva /></PrivateRoute>} />
        <Route path="/equipamentos/:id/agendamentos" element={<PrivateRoute><AgendamentosList /></PrivateRoute>} />
        <Route path="/agendamentos/:agendamentoId/editar" element={<PrivateRoute><AgendamentoEdit /></PrivateRoute>} />
        <Route path="/admin/usuarios-empresa" element={<PrivateRoute><UsuariosEmpresaAdmin /></PrivateRoute>} />
        <Route path="/empresas/nova" element={<PrivateRoute><EmpresaForm /></PrivateRoute>} />
        <Route path="/agendamentos/calendario" element={<PrivateRoute><AgendamentosCalendario /></PrivateRoute>} />
        <Route path="/admin/usuarios-criar" element={<PrivateRoute><UsuarioCreate /></PrivateRoute>} />
        <Route path="/admin/tipos-equipamento" element={<PrivateRoute><TiposEquipamentoAdmin /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
