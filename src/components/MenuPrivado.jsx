import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getUsuario, logout } from "../seguranca/Autenticacao";

const MenuPrivado = () => {
    const usuario = getUsuario();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>Locadora</Navbar.Brand>

                    <Nav className="me-auto" variant="pills">
                        <NavLink className="nav-link" to="/privado">
                            <i className="bi bi-house-fill" /> Home
                        </NavLink>

                        {usuario && (
                            <>
                                <NavLink className="nav-link" to="/privado/clientes">
                                    <i className="bi bi-person-fill" /> Clientes
                                </NavLink>

                                <NavLink className="nav-link" to="/privado/filmes">
                                    <i className="bi bi-camera-reels-fill" /> Filmes
                                </NavLink>

                                <NavLink className="nav-link" to="/privado/locacoes">
                                    <i className="bi bi-cart-fill" /> Locações
                                </NavLink>
                            </>
                        )}
                    </Nav>

                    <Nav>
                        <NavDropdown
                            title={
                                usuario
                                    ? `Usuário: ${usuario.nome}`
                                    : "Usuário"
                            }
                            align="end"
                        >
                            {usuario ? (
                                <>
                                    <NavDropdown.Item className="nav-link">
                                        <NavLink className="nav-link" to="/privado/meuperfil">
                                            <i className="bi bi-person-fill" /> Meu Perfil
                                        </NavLink>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item className="nav-link" onClick={handleLogout}>
                                        <i className="bi bi-person-fill-down" /> Logout
                                    </NavDropdown.Item>
                                </>
                            ) : (
                                <NavDropdown.Item
                                    as={NavLink}
                                    to="/login"
                                >
                                    Login
                                </NavDropdown.Item>
                            )}
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>

            <Outlet />
        </div>
    );
};

export default MenuPrivado;