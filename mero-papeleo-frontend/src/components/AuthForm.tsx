import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import '../assets/css/AuthForm.css';
import Swal from 'sweetalert2';
import '@sweetalert2/themes/wordpress-admin/wordpress-admin.min.css';
import { isEmpty, isEmail, isStrongPassword } from '../assets/ts/functions_AuthForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ username: false, email: false, password: false, confirmPassword: false });
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let hasError = false;

    // Reiniciar errores
    setErrors({ username: false, email: false, password: false, confirmPassword: false });

    if (isEmpty(username)) {
      setErrors((prev) => ({ ...prev, username: true }));
      Swal.fire({
        title: 'Error',
        text: 'El nombre de usuario no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      hasError = true;
    }

    if (!isLogin && isEmpty(email)) {
      setErrors((prev) => ({ ...prev, email: true }));
      Swal.fire({
        title: 'Error',
        text: 'El email no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      hasError = true;
    }

    if (!isLogin && !isEmail(email)) {
      setErrors((prev) => ({ ...prev, email: true }));
      Swal.fire({
        title: 'Error',
        text: 'El email ingresado no es válido.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      hasError = true;
    }

    if (isEmpty(password)) {
      setErrors((prev) => ({ ...prev, password: true }));
      Swal.fire({
        title: 'Error',
        text: 'La contraseña no puede estar vacía.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      hasError = true;
    }

    if (!isLogin && !isStrongPassword(password)) {
      setErrors((prev) => ({ ...prev, password: true }));
      Swal.fire({
        title: 'Error',
        text: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      hasError = true;
    }

    // Validación de coincidencia de contraseñas
    if (!isLogin && password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: true }));
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      hasError = true;
    }

    if (hasError) return;

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
      setConfirmPassword(''); // Reiniciar confirmación de contraseña

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
                className={`input-field ${errors.username ? 'is-invalid' : ''}`}
                type="text"
                placeholder="Nombre de Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <Form.Text className="text-danger"></Form.Text>}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Contraseña</Form.Label>
              <div className="input-group">
                <Form.Control
                  className={`input-field ${errors.password ? 'is-invalid' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {errors.password && <Form.Text className="text-danger"></Form.Text>}
            </Form.Group>
            <Button variant="primary" type="submit" className="auth-button">
              Iniciar Sesión
            </Button>
            <Form.Text className="text-muted">
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
                className={`input-field ${errors.username ? 'is-invalid' : ''}`}
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <Form.Text className="text-danger"></Form.Text>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                className={`input-field ${errors.email ? 'is-invalid' : ''}`}
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <Form.Text className="text-danger"></Form.Text>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Contraseña</Form.Label>
              <div className="input-group">
                <Form.Control
                  className={`input-field ${errors.password ? 'is-invalid' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {errors.password && <Form.Text className="text-danger"></Form.Text>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <div className="input-group">
                <Form.Control
                  className={`input-field ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {errors.confirmPassword && <Form.Text className="text-danger"></Form.Text>}
            </Form.Group>

            <Button variant="primary" type="submit" className="auth-button">
              Registrarse
            </Button>
            <Form.Text className="text-muted">
              <Button variant="link" onClick={() => setIsLogin(true)}>
                Inicia sesión
              </Button>
            </Form.Text>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
