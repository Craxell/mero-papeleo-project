import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../assets/css/LandingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Card className="title_lanPage">
        <Link className="button-login-custom" to="/login">
          Login
        </Link>
        <Card.Body>
          <h1>Bienvenido a Mero Papeleo</h1>
        </Card.Body>
        <header className="landing-header">
          <p className="tagline">La ayuda perfecta para tus articulos</p>
        </header>
        <h2>Características</h2>
        <section className="features">
          <div className="feature">
            <h3>Fácil de usar</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="feature">
            <h3>Acceso seguro</h3>
            <p>
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio, et
              feugiat augue facilisis sit amet.
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio, et
              feugiat augue facilisis sit amet.
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio, et
              feugiat augue facilisis sit amet.
            </p>
          </div>
          <div className="feature">
            <h3>Soporte 24/7</h3>
            <p>
              Mauris vitae elit eget eros gravida eleifend sit amet ac sapien.
              Quisque quis arcu ac lorem pretium malesuada.
              Mauris vitae elit eget eros gravida eleifend sit amet ac sapien.
              Quisque quis arcu ac lorem pretium malesuada.
              Mauris vitae elit eget eros gravida eleifend sit amet ac sapien.
              Quisque quis arcu ac lorem pretium malesuada.
            </p>
          </div>
        </section>
      </Card>

      <footer className="landing-footer">
        <p>© 2024 Mero Papeleo. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
