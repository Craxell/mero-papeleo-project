import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseUrl } from '../helpers/urlHelpers';
import DefaultLayout from '../layout/DefaultLayout';
import { useAuth } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';

import '../assets/Stylesheets/registerStyles.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = useAuth();

  // Si el usuario ya está autenticado, redirige al dashboard
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log('Base URL:', baseUrl);
      console.log('Datos enviados:', { username, email, password });

      const response = await axios.post(`${baseUrl}/register`, {
        username,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response:', response);
      if (response.data.status === 'success') {
        Swal.fire({
          title: 'Registro exitoso',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Llamar a la función de login tras el registro exitoso
        await auth.login(username, password);

        // Limpiar los campos de entrada
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.detail || 'Ocurrió un error durante el registro.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      if (axios.isAxiosError(error) && error.response) {
        Swal.fire({
          title: 'Error',
          text: error.response.data.detail || 'Ocurrió un error durante el registro.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return (
    <DefaultLayout>
      <h1 className="title">Registrarse</h1>
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
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            className="input-field"
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Registrarse
        </Button>
        <br />
        <Form.Text className="text-muted">
          No compartimos tus datos con nadie ;v
        </Form.Text>
      </Form>
    </DefaultLayout>
  );
}
