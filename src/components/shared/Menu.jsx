import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/app.css";

const Menu = ({ usuarioLogueado, setUsuarioLogueado }) => {
  const navegacion = useNavigate();

  const logout = () => {
    setUsuarioLogueado(false);
    navegacion("/login");
  };

  return (
    <Navbar expand="lg" className="navbar-custom py-2 fs-5" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand-custom fuenteLogo">
          <img src="/logo.png" alt="AlgoRitmo Icon" className="navbar-logo" />
          AlgoRitmo 2.0
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center gap-2 gap-lg-3">
            <NavLink to="/" className="nav-link nav-link-custom">
              Inicio
            </NavLink>

            <NavLink to="/about" className="nav-link nav-link-custom">
              Nosotros
            </NavLink>

            {usuarioLogueado ? (
              <>
                <NavLink to="/admin" className="nav-link nav-link-custom">
                  Administrador
                </NavLink>

                <Button
                  type="button"
                  variant="outline-light"
                  className="btn-cuenta ms-lg-3 mt-3 mt-lg-0"
                  onClick={logout}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline-light"
                className="btn-cuenta ms-lg-3 mt-3 mt-lg-0"
                onClick={() => navegacion("/login")}
              >
                Ingresar
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
