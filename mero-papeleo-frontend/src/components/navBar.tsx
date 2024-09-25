import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/navbar.css';
import { useAuth } from '../auth/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { username, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Mero Papeleo</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`}>
            <Link className="nav-link" to="/users">Usuarios</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/prompt' ? 'active' : ''}`}>
            <Link className="nav-link" to="/prompt">Prompt</Link>
          </li>
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <span className="nav-link">Hola, {username}</span>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={logout}>Cerrar sesión</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
