import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../assets/css/LandingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Container fluid>
        <Card className="title_lanPage">
          <header className="landing-header py-4">
            <h1>Bienvenido a Mero Papeleo</h1>
            <p className="tagline">La ayuda perfecta para tus artículos</p>
            <Link className="button-login-custom mt-3" to="/login">
              Iniciar sesión
            </Link>
          </header>
        </Card>

        <h2 className="text-custom mt-5">Características</h2>
        <Row className="text-center mt-4">
          <Col md={4}>
            <Card className="feature-card p-3 mb-4">
            <h3>IA Avanzada para la Recuperación de Información</h3>
            <p>
              Nuestro sistema RAG emplea tecnología de IA de última generación para
              extraer la información más relevante de tus papers, tesis o informes,
              brindándote respuestas precisas en cuestión de segundos.
            </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card p-3 mb-4">
            <h3>Optimización del Proceso de Investigación</h3>
            <p>
              Simplifica tu flujo de trabajo académico o profesional. Nuestro sistema
              organiza y resume tus documentos para que puedas concentrarte en lo más
              importante: tu investigación.
            </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card p-3 mb-4">
            <h3>Soporte 24/7</h3>
            <p>
            Siempre estamos aquí para ayudarte. Nuestro equipo de soporte está disponible
            las 24 horas, los 7 días de la semana, para resolver cualquier duda sobre el uso
            del sistema o la extracción de información de tus documentos.
            </p>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="landing-footer text-custom py-3 mt-5">
        <p>© 2024 Mero Papeleo. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
