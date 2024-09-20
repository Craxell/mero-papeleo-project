import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import LandingPage from './pages/LandingPage/LandingPage';

import Dashboard from './pages/Dashboard/dashboard';
import Usuarios from './pages/Users/users';
import Prompt from './pages/Prompt/prompt';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />


      {/* Rutas protegidas, que requieren el DefaultLayout */}
      <Route element={<DefaultLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Usuarios />} />
        <Route path="/prompt" element={<Prompt />} />
      </Route>
    </Routes>
  );
};

export default App;
