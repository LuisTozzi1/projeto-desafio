import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/login/Login';
import FuncionariosList from './pages/funcionarios/FuncionariosList';
import CargosList from './pages/cargos/CargosList';
import DepartamentosList from './pages/departamentos/DepartamentosList';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/funcionarios" element={<FuncionariosList />} />
              <Route path="/cargos" element={<CargosList />} />
              <Route path="/departamentos" element={<DepartamentosList />} />
            </Route>

            <Route path="/" element={<Navigate to="/funcionarios" replace />} />
            <Route path="*" element={<Navigate to="/funcionarios" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
