import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/dashboard';
import Usuarios from './pages/users';
import Prompt from './pages/prompt';
import NotFoundPage from './components/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoutes';
import Unauthorized from './components/Unauthorized';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Rutas protegidas */}
      <Route element={<DefaultLayout />}>
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRoles={["Administrador", "Usuario"]} unauthorizedComponent={<Unauthorized />}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute requiredRoles={["Administrador"]} unauthorizedComponent={<Unauthorized />}>
            <Usuarios />
          </ProtectedRoute>
        } />
        <Route path="/prompt" element={
          <ProtectedRoute requiredRoles={["Administrador", "Usuario"]} unauthorizedComponent={<Unauthorized />}>
            <Prompt />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
