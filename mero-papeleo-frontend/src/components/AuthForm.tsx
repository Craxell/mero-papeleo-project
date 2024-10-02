import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import '../assets/css/AuthForm.css';
import Swal from 'sweetalert2';
import '@sweetalert2/themes/wordpress-admin/wordpress-admin.min.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      let response;

      if (isLogin) {
        response = await login(username, password);
        Swal.fire({
          title: 'Inicio de sesión exitoso',
          text: response.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate('/dashboard');
      } else {
        response = await register(username, email, password);
        Swal.fire({
          title: 'Registro exitoso',
          text: response.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }

      setUsername('');
      setEmail('');
      setPassword('');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error. Por favor, inténtalo de nuevo.';
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="auth-container">
      <div className={`flip-card ${!isLogin ? 'flipped' : ''}`}>
        <div className="form-inner front">
          <h1 className="title">Iniciar Sesión</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                className="input-field"
                type="text"
                placeholder="Nombre de Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                className="input-field"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="auth-button">
              Iniciar Sesión
            </Button>
            <Form.Text className="text-muted">
              ¿No tienes cuenta? 
              <Button variant="link" onClick={() => setIsLogin(false)}>
                Regístrate
              </Button>
            </Form.Text>
          </Form>
        </div>
        
        <div className="form-inner back">
          <h2 className="mt-5">Registro</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Crea una contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="auth-button">
              Registrar
            </Button>
            <Form.Text className="text-muted">
              ¿Ya tienes cuenta? 
              <Button variant="link" onClick={() => setIsLogin(true)}>
                Inicia Sesión
              </Button>
            </Form.Text>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;