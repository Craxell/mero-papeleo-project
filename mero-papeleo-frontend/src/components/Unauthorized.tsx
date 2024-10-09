import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Forbidden</h1>
      <p>Lo sentimos, No cuentas con permisos para visualizar esto, je je je je.</p>
      <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Volver a la página anterior
      </button>
    </div>
  );
};

export default Unauthorized;
