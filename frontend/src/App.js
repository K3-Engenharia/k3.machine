import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Box, CircularProgress } from '@mui/material';
import { startKeepAlive } from './services/keepAlive';

// Lazy load das páginas menos críticas
const EquipamentosList = lazy(() => import('./pages/EquipamentosList'));
const EquipamentoForm = lazy(() => import('./pages/EquipamentoForm'));
const EquipamentoEdit = lazy(() => import('./pages/EquipamentoEdit'));
const AgendarPreventiva = lazy(() => import('./pages/AgendarPreventiva'));
const AgendamentosList = lazy(() => import('./pages/AgendamentosList'));
const AgendamentoEdit = lazy(() => import('./pages/AgendamentoEdit'));
const UsuariosEmpresaAdmin = lazy(() => import('./pages/UsuariosEmpresaAdmin'));
const EmpresaForm = lazy(() => import('./pages/EmpresaForm'));
const AgendamentosCalendario = lazy(() => import('./pages/AgendamentosCalendario'));
const UsuarioCreate = lazy(() => import('./pages/UsuarioCreate'));
const TiposEquipamentoAdmin = lazy(() => import('./pages/TiposEquipamentoAdmin'));

// Componente de loading
const LoadingComponent = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

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
        <Route path="/equipamentos" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><EquipamentosList /></Suspense></PrivateRoute>} />
        <Route path="/equipamentos/novo" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><EquipamentoForm /></Suspense></PrivateRoute>} />
        <Route path="/equipamentos/editar/:id" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><EquipamentoEdit /></Suspense></PrivateRoute>} />
        <Route path="/equipamentos/:id/agendamentos" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><AgendamentosList /></Suspense></PrivateRoute>} />
        <Route path="/agendamentos/:agendamentoId/editar" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><AgendamentoEdit /></Suspense></PrivateRoute>} />
        <Route path="/admin/usuarios-empresa" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><UsuariosEmpresaAdmin /></Suspense></PrivateRoute>} />
        <Route path="/empresas/nova" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><EmpresaForm /></Suspense></PrivateRoute>} />
        <Route path="/agendamentos/calendario" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><AgendamentosCalendario /></Suspense></PrivateRoute>} />
        <Route path="/admin/usuarios-criar" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><UsuarioCreate /></Suspense></PrivateRoute>} />
        <Route path="/admin/tipos-equipamento" element={<PrivateRoute><Suspense fallback={<LoadingComponent />}><TiposEquipamentoAdmin /></Suspense></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
