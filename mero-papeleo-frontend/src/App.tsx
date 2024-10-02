import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/dashboard';
import Usuarios from './pages/users';
import Prompt from './pages/prompt';
import NotFoundPage from './components/NotFoundPage';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />

      {/* Rutas protegidas */}
      <Route element={<DefaultLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Usuarios />} />
        <Route path="/prompt" element={<Prompt />} />
      </Route>

      {/* NotFoundRoute */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
