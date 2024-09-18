import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseUrl } from '../helpers/urlHelpers';
import DefaultLayout from '../layout/DefaultLayout';
import { useAuth } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';

import '../assets/Stylesheets/loginStyles.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log('Base URL:', baseUrl);
      console.log('Datos enviados:', { username, password });

      const response = await axios.post(`${baseUrl}/login`, {
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response:', response);
      if (response.data.status === 'success') {
        auth.login(username, password);  // Maneja la autenticación en el contexto

        Swal.fire({
          title: 'Inicio de sesión exitoso',
          text: 'Has iniciado sesión correctamente.',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        setUsername('');
        setPassword('');
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.detail || 'Ocurrió un error durante el inicio de sesión.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      if (axios.isAxiosError(error) && error.response) {
        Swal.fire({
          title: 'Error',
          text: error.response.data.detail || 'Ocurrió un error durante el inicio de sesión.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return (
    <DefaultLayout>
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
    </DefaultLayout>
  );
}
