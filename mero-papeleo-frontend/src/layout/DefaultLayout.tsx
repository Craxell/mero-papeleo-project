import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navBar"; // Asegúrate de importar el Navbar

const DefaultLayout: React.FC = () => {
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
