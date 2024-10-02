import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navpanel";

const DefaultLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Si el usuario no está autenticado, redirige a la página de inicio
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar /> {/* Aquí se incluye el Navbar */}
      <main>
        <Outlet /> {/* Este es el lugar donde se renderizarán las subrutas */}
      </main>
    </>
  );
};

export default DefaultLayout;
