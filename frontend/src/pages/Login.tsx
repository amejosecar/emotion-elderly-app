// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setStatus("");
    setValidated(true);

    try {
      const payload = new URLSearchParams();
      payload.append("username", email);
      payload.append("password", password);

      const res = await api.post("/auth/login", payload.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      login(res.data.access_token);
      navigate("/loading");
    } catch (err: any) {
      setStatus("❌ Credenciales inválidas o error de conexión");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Container
        style={{
          maxWidth: "420px",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className="mb-4 text-center" style={{ fontWeight: 600 }}>
          Iniciar Sesión
        </h2>

        {status && <Alert variant="danger">{status}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-4">
            <Form.Label className="mb-2" style={{ fontWeight: 500 }}>
              Correo electrónico
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingresa un correo válido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-4">
            <Form.Label className="mb-2" style={{ fontWeight: 500 }}>
              Contraseña
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              La contraseña es obligatoria.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicCheckbox" className="mb-3">
            <Form.Check type="checkbox" label="Recordarme" />
          </Form.Group>

          <div className="mt-3">
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              style={{ fontWeight: 500 }}
            >
              Acceder
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
