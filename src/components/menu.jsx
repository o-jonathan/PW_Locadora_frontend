import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router";

const Menu = () => (
    <div>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>Locadora</Navbar.Brand>
                <Nav variant="pills">
                    <NavLink className="nav-link" to="/"><i className="bi bi-house-fill" /> Home</NavLink>
                    <NavLink className="nav-link" to="/clientes"><i className="bi bi-person-fill" /> Clientes</NavLink>
                    <NavLink className="nav-link" to="/filmes"><i className="bi bi-camera-reels-fill" /> Filmes</NavLink>
                    <NavLink className="nav-link" to="/locacoes"><i className="bi bi-cart-fill" /> Locações</NavLink>
                </Nav>
            </Container>
        </Navbar>
        <Outlet />
    </div>
);

export default Menu;