import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router";

const MenuPublico = () => (
    <div>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>Locadora</Navbar.Brand>
                <Nav className="me-auto" variant="pills">
                    <NavLink className="nav-link" to="/"><i className="bi bi-house-fill" /> Home</NavLink>
                </Nav>
                <Nav variant="pills">
                    <NavLink className="nav-link" to="/login"><i className="bi bi-person-fill" /> Login</NavLink>
                    <NavLink className="nav-link" to="/cadastro"><i className="bi bi-person-plus-fill" /> Cadastro</NavLink>
                </Nav>
            </Container>
        </Navbar>
        <Outlet />
    </div>
);

export default MenuPublico;