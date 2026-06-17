import { useContext, useState } from "react";
import { Container, Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { ClientesContext } from "../context/clientesContext";
import { postClienteAPI, putClienteAPI, deleteClientePorIdAPI } from "../../services/clienteServices";
import WithAuth from "../../seguranca/WithAuth";
import { useNavigate } from "react-router-dom";
import { trataErroAutenticacao } from "../../seguranca/trataErroAutenticacao";
import { getUsuario } from "../../seguranca/Autenticacao";

const EMPTY = { nome: "", email: "" };

const Clientes = () => {
    const usuario = getUsuario();
    const { clientes, loading, error, fetchClientes } = useContext(ClientesContext);

    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const navigate = useNavigate();

    function openNew() {
        setEditing(null);
        setForm(EMPTY);
        setFormError(null);
        setShow(true);
    }

    function openEdit(cliente) {
        setEditing(cliente);
        setForm({ nome: cliente.nome, email: cliente.email });
        setFormError(null);
        setShow(true);
    }

    function openDelete(id) {
        setDeletingId(id);
        setShowConfirm(true);
    }

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function handleSave() {
        if (!form.nome.trim() || !form.email.trim()) {
            setFormError("Preencha todos os campos.");
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            if (editing) {
                await putClienteAPI({ ...editing, ...form });
            } else {
                await postClienteAPI(form);
            }
            // Atualiza a tabela chamando a API novamente
            await fetchClientes();
            setShow(false);
        } catch (err) {
            if (!trataErroAutenticacao(err, navigate)) {
                setFormError(err.message);
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (usuario.tipo !== 'A') {
            alert("Apenas administradores podem excluir registros.");
            return;
        }

        setDeleting(true);
        try {
            await deleteClientePorIdAPI(deletingId);
            // Atualiza a tabela
            await fetchClientes();
            setShowConfirm(false);
        } catch (err) {
            if (!trataErroAutenticacao(err, navigate)) {
                alert(err.message);
            }
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Clientes</h2>
                <Button variant="primary" onClick={openNew}>
                    <i className="bi bi-plus-lg me-1" /> Novo Cliente
                </Button>
            </div>

            {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th style={{ width: 120 }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length === 0 ? (
                            <tr><td colSpan={4} className="text-center text-muted">Nenhum cliente cadastrado.</td></tr>
                        ) : clientes.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.nome}</td>
                                <td>{c.email}</td>
                                <td>
                                    <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => openEdit(c)}>
                                        <i className="bi bi-pencil" />
                                    </Button>
                                    {usuario?.tipo === 'A' && (
                                        <Button size="sm" variant="outline-danger" onClick={() => openDelete(c.id)}>
                                            <i className="bi bi-trash" />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal Criar/Editar */}
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? "Editar Cliente" : "Novo Cliente"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@exemplo.com" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving}>
                        {saving ? <Spinner size="sm" animation="border" /> : "Salvar"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Confirmar Exclusão */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza que deseja excluir este cliente?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                        {deleting ? <Spinner size="sm" animation="border" /> : "Excluir"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default WithAuth(Clientes);