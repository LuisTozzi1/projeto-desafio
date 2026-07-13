import { NavLink } from 'react-router-dom';
import DixiLogoMark from './DixiLogoMark';
import { useAuth } from '../context/AuthContext';
import './sidebar.css';

const ICONS = {
  funcionario: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ),
  cargo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  departamento: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 21V7l8-4 8 4v14" />
      <path d="M9 21v-6h6v6" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  ),
};

export default function Sidebar() {
  const { username, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <DixiLogoMark size={40} />
        <div className="sidebar-logo-text">
          <strong>DIXI</strong>
          <span>SOLUÇÕES</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/funcionarios" className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}>
          {ICONS.funcionario}
          Funcionário
        </NavLink>
        <NavLink to="/cargos" className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}>
          {ICONS.cargo}
          Cargo
        </NavLink>
        <NavLink to="/departamentos" className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}>
          {ICONS.departamento}
          Departamento
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span title={username}>{username}</span>
          <button className="sidebar-logout" onClick={logout} title="Sair" data-cy="logout-button">
            {ICONS.logout}
          </button>
        </div>
      </div>
    </aside>
  );
}
