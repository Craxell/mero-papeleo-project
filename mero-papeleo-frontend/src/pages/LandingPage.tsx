import React from 'react';
import '../assets/css/LandingPage.css';
import AuthForm from '../components/AuthForm';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Bienvenido a Mero Papeleo</h1>
        <p className="tagline">La solución perfecta para gestionar tus documentos.</p>
        <section className="auth-section">
          <AuthForm />
        </section>
      </header>

      <h2>Características</h2>
      <section className="features">
        <div className="feature">
          <h3>Fácil de usar</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="feature">
          <h3>Acceso seguro</h3>
          <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio, et feugiat augue facilisis sit amet.</p>
        </div>
        <div className="feature">
          <h3>Soporte 24/7</h3>
          <p>Mauris vitae elit eget eros gravida eleifend sit amet ac sapien. Quisque quis arcu ac lorem pretium malesuada.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2024 Mero Papeleo. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
