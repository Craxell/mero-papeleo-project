import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Users';
import Prompt from './pages/Prompt';
import NotFoundPage from './components/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoutes';
import Unauthorized from './components/Unauthorized';
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />

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
        <Route path="/profile" element={
          <ProtectedRoute requiredRoles={["Administrador", "Usuario"]} unauthorizedComponent={<Unauthorized />}>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
