import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();

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
          <li className="nav-item">
            <Link className="nav-link" to="#">Cerrar sesión</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
