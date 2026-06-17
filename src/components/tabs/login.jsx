import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

import { gravaAutenticacao, getToken } from "../../seguranca/Autenticacao";

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [autenticado, setAutenticado] = useState(false);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        try {
            const token = getToken();
            if (token) {
                setAutenticado(true);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    async function handleLogin(e) {
        e.preventDefault();

        setLoading(true);
        setErro("");

        try {
            const response = await fetch(
                `${process.env.REACT_APP_ENDERECO_API}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        senha,
                    }),
                }
            );

            const json = await response.json();

            if (!json.auth) {
                setErro(json.message || "Usuário ou senha inválidos.");
                return;
            }

            gravaAutenticacao(json);
            setAutenticado(true);

        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (autenticado) {
        return <Navigate to="/privado" />;
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
        >
            <Card style={{ width: "400px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4">
                        Login
                    </h2>

                    {erro && (
                        <Alert variant="danger">
                            {erro}
                        </Alert>
                    )}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        size="sm"
                                        animation="border"
                                        className="me-2"
                                    />
                                    Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;