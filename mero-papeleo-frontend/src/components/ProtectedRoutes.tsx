import React from 'react';
import { useAuth } from "../auth/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
  unauthorizedComponent: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles, unauthorizedComponent }) => {
  const { isAuthenticated, role } = useAuth();
  const hasAccess = isAuthenticated && requiredRoles.includes(role || "");

  if (!hasAccess) {
    return unauthorizedComponent;
  }

  return <>{children}</>; // Renderizar las rutas protegidas si está autorizado
};

export default ProtectedRoute;
