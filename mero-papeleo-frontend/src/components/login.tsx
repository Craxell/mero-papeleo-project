import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import { useAuth } from '../auth/AuthContext'; 
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await login(username, password); // Captura la respuesta del servidor

      Swal.fire({
        title: 'Inicio de sesión exitoso',
        text: response.message, // Muestra el mensaje del servidor
        icon: 'success',
        confirmButtonText: 'OK',
      });
      
      setUsername('');
      setPassword('');
      navigate('/dashboard'); // Redirige al dashboard
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
    <div className="login-container">
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
        <Button variant="primary" type="submit">
          Iniciar Sesión
        </Button>
        <br />
        <Form.Text className="text-muted">
          No compartimos tus datos con nadie ;v
        </Form.Text>
      </Form>
    </div>
  );
}
