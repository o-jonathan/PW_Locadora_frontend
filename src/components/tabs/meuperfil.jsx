import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

import { getUsuario, logout } from "../../seguranca/Autenticacao";

const MeuPerfil = () => {
    const usuario = getUsuario();
    const email = usuario.email;
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");

    const [salvo, setSalvo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    async function handleUpdate(e) {
        e.preventDefault();

        setLoading(true);
        setErro("");

        try {

            const response = await fetch(
                `${process.env.REACT_APP_ENDERECO_API}/usuario`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        telefone,
                        nome
                    })
                }
            );

            const json = await response.json();

            if (!response.ok) {
                throw new Error(
                    json.message || "Erro ao cadastrar usuário."
                );
            }

            setSalvo(true);

        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (salvo) {
        logout();
        return <Navigate to="/login" />;
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
        >
            <Card style={{ width: "400px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4">
                        Meu Perfil
                    </h2>

                    {erro && (
                        <Alert variant="danger">
                            {erro}
                        </Alert>
                    )}

                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                                type="text"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
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
                                    Salvando...
                                </>
                            ) : (
                                "Salvar"
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MeuPerfil;