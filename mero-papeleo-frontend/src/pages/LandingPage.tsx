import React from 'react';
import Card from 'react-bootstrap/Card';
import '../assets/css/LandingPage.css';
import AuthForm from '../components/AuthForm';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Card className='title_lanPage'>
        <Card.Body><h1>Bienvenido a Mero Papeleo</h1></Card.Body>
        <header className="landing-header">
        <p className="tagline">La ayuda perfecta para tus articulos</p>
      </header>
      </Card>

      <Card className='card_auth'>
        <section className="auth-section">
          <AuthForm />
        </section>
      </Card>
      

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
