import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Aquí va la lógica de registro
    console.log('Registro:', { username, email, password });
  };

  return (
    <div className="container">
      <h2 className="mt-5">Registro</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Crea una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <br />
        <Button variant="primary" type="submit">
          Registrar
        </Button>
      </Form>
    </div>
  );
};

export default Register;
