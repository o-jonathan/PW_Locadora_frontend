import { useContext, useState } from "react";
import { Container, Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { FilmesContext } from "../context/filmesContext";
import { postFilmeAPI, putFilmeAPI, deleteFilmePorIdAPI } from "../../services/filmeServices";
import WithAuth from "../../seguranca/WithAuth";
import { useNavigate } from "react-router-dom";
import { trataErroAutenticacao } from "../../seguranca/trataErroAutenticacao";
import { getUsuario } from "../../seguranca/Autenticacao";

const GENEROS = ["Ação", "Aventura", "Comédia", "Drama", "Ficção Científica", "Terror", "Romance", "Animação", "Documentário", "Suspense"];
const EMPTY = { titulo: "", lancamento: "", genero: "" };

const Filmes = () => {
    const usuario = getUsuario();
    const { filmes, loading, error, fetchFilmes } = useContext(FilmesContext);

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

    function openEdit(filme) {
        setEditing(filme);
        setForm({ titulo: filme.titulo, lancamento: filme.lancamento ?? "", genero: filme.genero ?? "" });
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
        if (!form.titulo.trim()) {
            setFormError("O título é obrigatório.");
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            if (editing) {
                await putFilmeAPI({ ...editing, ...form });
            } else {
                await postFilmeAPI(form);
            }
            // Atualiza a tabela chamando a API novamente
            await fetchFilmes();
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
            await deleteFilmePorIdAPI(deletingId);
            // Atualiza a tabela
            await fetchFilmes();
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
                <h2>Filmes</h2>
                <Button variant="primary" onClick={openNew}>
                    <i className="bi bi-plus-lg me-1" /> Novo Filme
                </Button>
            </div>

            {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Gênero</th>
                            <th>Lançamento</th>
                            <th style={{ width: 120 }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filmes.length === 0 ? (
                            <tr><td colSpan={5} className="text-center text-muted">Nenhum filme cadastrado.</td></tr>
                        ) : filmes.map(f => (
                            <tr key={f.id}>
                                <td>{f.id}</td>
                                <td>{f.titulo}</td>
                                <td>{f.genero}</td>
                                <td>{f.lancamento}</td>
                                <td>
                                    <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => openEdit(f)}>
                                        <i className="bi bi-pencil" />
                                    </Button>
                                    {usuario?.tipo === 'A' && (
                                        <Button size="sm" variant="outline-danger" onClick={() => openDelete(f.id)}>
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
                    <Modal.Title>{editing ? "Editar Filme" : "Novo Filme"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título do filme" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Gênero</Form.Label>
                            <Form.Select name="genero" value={form.genero} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Data de Lançamento</Form.Label>
                            <Form.Control name="lancamento" type="date" value={form.lancamento} onChange={handleChange} />
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
                <Modal.Body>Tem certeza que deseja excluir este filme?</Modal.Body>
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

export default WithAuth(Filmes);