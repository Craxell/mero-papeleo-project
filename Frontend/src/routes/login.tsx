import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../assets/Stylesheets/loginStyles.css';
import { baseUrl } from '../helpers/urlHelpers';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        username: username,
        password: password,
      });

      if (response.data.status === 'success') {
        Swal.fire({
          title: 'Inicio de sesión exitoso',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema con el servidor. Inténtalo nuevamente.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      <h1 className="title">Iniciar Sesión</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control
            className="input-field"
            type="text"
            placeholder="Nombre de usuario"
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
          Iniciar sesión
        </Button>
        <br />
        <Form.Text className="text-muted">
          No compartimos tus datos con nadie ;v
        </Form.Text>
      </Form>
    </>
  );
}
