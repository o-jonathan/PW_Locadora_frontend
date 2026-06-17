import { useContext, useState } from "react";
import { Container, Table, Button, Modal, Form, Alert, Spinner, Badge } from "react-bootstrap";
import { LocacoesContext } from "../context/locacoesContext";
import { ClientesContext } from "../context/clientesContext";
import { FilmesContext } from "../context/filmesContext";
import { postLocacaoAPI, putLocacaoAPI, deleteLocacaoPorIdAPI } from "../../services/locacaoServices";
import { postItemLocacaoAPI, deleteItemLocacaoPorIdAPI } from "../../services/itemLocacaoServices";
import WithAuth from "../../seguranca/WithAuth";
import { useNavigate } from "react-router-dom";
import { trataErroAutenticacao } from "../../seguranca/trataErroAutenticacao";

const EMPTY = { cliente_id: "", data_locacao: "", data_devolucao: "" };

function formatDate(value) {
    if (!value) return null;
    return value.substring(0, 10);
}

const Locacoes = () => {
    // Importamos fetchLocacoes
    const { locacoes, loading, error, fetchLocacoes } = useContext(LocacoesContext);
    const { clientes } = useContext(ClientesContext);
    const { filmes } = useContext(FilmesContext);

    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [filmeSelecionado, setFilmeSelecionado] = useState("");
    const [itens, setItens] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const navigate = useNavigate();

    function nomeCliente(id) {
        return clientes.find(c => c.id === id)?.nome ?? id;
    }

    function tituloFilme(id) {
        return filmes.find(f => f.id === id)?.titulo ?? id;
    }

    function openNew() {
        setEditing(null);
        setForm(EMPTY);
        setItens([]);
        setFilmeSelecionado("");
        setFormError(null);
        setShow(true);
    }

    function openEdit(locacao) {
        setEditing(locacao);
        setForm({
            cliente_id: locacao.cliente_id ?? "",
            data_locacao: formatDate(locacao.data_locacao) ?? "",
            data_devolucao: formatDate(locacao.data_devolucao) ?? "",
        });
        setItens(
            (locacao.itemLocacoes ?? []).map(i => ({
                id: i.id,
                filme_id: i.filme_id,
                titulo: tituloFilme(i.filme_id),
            }))
        );
        setFilmeSelecionado("");
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

    function addFilme() {
        if (!filmeSelecionado) return;
        if (itens.some(i => String(i.filme_id) === String(filmeSelecionado))) return;
        const filme = filmes.find(f => String(f.id) === String(filmeSelecionado));
        setItens(prev => [...prev, { filme_id: filme.id, titulo: filme.titulo }]);
        setFilmeSelecionado("");
    }

    function removeFilme(filme_id) {
        setItens(prev => prev.filter(i => String(i.filme_id) !== String(filme_id)));
    }

    function buildLocacaoPayload(base = {}) {
        return {
            ...base,
            cliente_id: Number(form.cliente_id),
            data_locacao: formatDate(form.data_locacao),
            data_devolucao: formatDate(form.data_devolucao) || null,
        };
    }

    async function handleSave() {
        if (!form.cliente_id || !form.data_locacao) {
            setFormError("Cliente e data de locação são obrigatórios.");
            return;
        }
        if (itens.length === 0) {
            setFormError("Adicione ao menos um filme.");
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            if (editing) {
                const locacaoPayload = buildLocacaoPayload(editing);
                const response = await putLocacaoAPI(locacaoPayload);
                const updated = response.objeto;

                if (!updated?.id) {
                    throw new Error(updated?.message ?? "O servidor não retornou a locação atualizada. Verifique o backend.");
                }

                const removidos = (editing.itemLocacoes ?? []).filter(
                    i => !itens.some(it => String(it.filme_id) === String(i.filme_id))
                );
                for (const i of removidos) {
                    await deleteItemLocacaoPorIdAPI(i.id);
                }

                for (const i of itens.filter(it => !it.id)) {
                    await postItemLocacaoAPI({ locacao_id: updated.id, filme_id: i.filme_id });
                }

            } else {
                const locacaoPayload = buildLocacaoPayload();
                const response = await postLocacaoAPI(locacaoPayload);
                const created = response.objeto;

                console.log(created.id)

                if (!created?.id) {
                    throw new Error(created?.message ?? "O servidor não retornou a locação criada. Verifique o backend.");
                }

                for (const i of itens) {
                    await postItemLocacaoAPI({ locacao_id: created.id, filme_id: i.filme_id });
                }
            }

            // Recarrega todos os relacionamentos chamando a função de fetch do Context
            await fetchLocacoes();
            setShow(false);
        } catch (err) {
            if (!trataErroAutenticacao(err, navigate)) {
                console.error("Erro ao salvar locação:", err);
                setFormError(err.message);
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteLocacaoPorIdAPI(deletingId);
            // Atualiza a tabela
            await fetchLocacoes();
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
                <h2>Locações</h2>
                <Button variant="primary" onClick={openNew}>
                    <i className="bi bi-plus-lg me-1" /> Nova Locação
                </Button>
            </div>

            {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Cliente</th>
                            <th>Filmes</th>
                            <th>Data Locação</th>
                            <th>Data Devolução</th>
                            <th style={{ width: 120 }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locacoes.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-muted">Nenhuma locação cadastrada.</td></tr>
                        ) : locacoes.map(l => (
                            <tr key={l.id}>
                                <td>{l.id}</td>
                                <td>{nomeCliente(l.cliente_id)}</td>
                                <td>
                                    {(l.itemLocacoes ?? []).map(i => (
                                        <Badge key={i.id} bg="secondary" className="me-1">{tituloFilme(i.filme_id)}</Badge>
                                    ))}
                                </td>
                                <td>{formatDate(l.data_locacao)}</td>
                                <td>{formatDate(l.data_devolucao) ?? <span className="text-muted">—</span>}</td>
                                <td>
                                    <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => openEdit(l)}>
                                        <i className="bi bi-pencil" />
                                    </Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => openDelete(l.id)}>
                                        <i className="bi bi-trash" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal Criar/Editar */}
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? "Editar Locação" : "Nova Locação"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Select name="cliente_id" value={form.cliente_id} onChange={handleChange}>
                                <option value="">Selecione um cliente...</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Data de Locação</Form.Label>
                            <Form.Control name="data_locacao" type="date" value={form.data_locacao} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Data de Devolução <span className="text-muted">(opcional)</span></Form.Label>
                            <Form.Control name="data_devolucao" type="date" value={form.data_devolucao} onChange={handleChange} />
                        </Form.Group>

                        <Form.Label>Filmes</Form.Label>
                        <div className="d-flex gap-2 mb-2">
                            <Form.Select value={filmeSelecionado} onChange={e => setFilmeSelecionado(e.target.value)}>
                                <option value="">Selecione um filme...</option>
                                {filmes.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
                            </Form.Select>
                            <Button variant="outline-primary" onClick={addFilme}>
                                <i className="bi bi-plus-lg" />
                            </Button>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                            {itens.map(i => (
                                <Badge key={i.filme_id} bg="secondary" className="d-flex align-items-center gap-1 p-2">
                                    {i.titulo}
                                    <i className="bi bi-x" style={{ cursor: "pointer" }} onClick={() => removeFilme(i.filme_id)} />
                                </Badge>
                            ))}
                            {itens.length === 0 && <span className="text-muted small">Nenhum filme adicionado.</span>}
                        </div>
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
                <Modal.Body>Tem certeza que deseja excluir esta locação?</Modal.Body>
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

export default WithAuth(Locacoes);