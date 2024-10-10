import React from "react";
import { Card, Container } from "react-bootstrap";
import AuthForm from "../components/AuthForm";
import "../assets/css/AuthPage.css";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container className="container-auth">
      <Card className="card_auth">
        <section className="auth-section">
          <AuthForm />
        </section>
        <button
          onClick={() => navigate(-1)}
          className="button-back"
        >
          Volver a la página anterior
        </button>
      </Card>
    </Container>
  );
};

export default AuthPage;
