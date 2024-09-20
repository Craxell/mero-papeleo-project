import { useState } from 'react';
import Login from './login';
import Register from './register';
import { Button } from 'react-bootstrap';

const AuthSection = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <section className="auth-section">
      <h2>Iniciar Sesión o Registrarse</h2>
      <div className="auth-buttons text-center mb-3">
        <Button variant="primary" onClick={toggleForm}>
          {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
        </Button>
      </div>
      <div className="w-100 d-flex justify-content-center">
        {isLogin ? <Login /> : <Register />}
      </div>
    </section>
  );
};

export default AuthSection;
