import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../assets/Stylesheets/registerStyles.css';  // Importa el nuevo CSS

export default function Register() {
  // Variables de estado para username, correo y contraseña
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/register', {
        username: username,
        email: email,
        password: password,
      });

      // Si el servidor devuelve éxito
      if (response.data.status === 'success') {
        Swal.fire({
          title: 'Registro exitoso',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Limpiar los campos después del registro
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        // Si el servidor devuelve un error
        Swal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      // Error en la solicitud
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
    </>
  );
}
