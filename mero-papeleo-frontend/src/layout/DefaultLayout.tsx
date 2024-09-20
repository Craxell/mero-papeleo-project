import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import Navbar from "../components/navBar";

const DefaultLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
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
