import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Volver a la página anterior
      </button>
    </div>
  );
};

export default NotFoundPage;
