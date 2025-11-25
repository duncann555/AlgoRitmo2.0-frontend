import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../styles/menu.css";

const Menu = ({ usuarioLogueado, setUsuarioLogueado }) => {
  const navegacion = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setUsuarioLogueado(null);
    navegacion("/");
  };

  return (
    <Navbar expand="lg" className="navbar-custom py-2 fs-5" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom fuenteLogo">
          <img src="/logo.png" alt="AlgoRitmo Icon" className="navbar-logo" />
          AlgoRitmo 2.0
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center gap-2 gap-lg-3">
            <NavLink end to="/" className="nav-link nav-link-custom">
              Inicio
            </NavLink>

            <NavLink end to="/about" className="nav-link nav-link-custom">
              Nosotros
            </NavLink>

            {usuarioLogueado ? (
              <>
                {usuarioLogueado.rol === 'admin' ? (
                  <NavLink end to="/admin" className="nav-link nav-link-custom">
                    Administrador
                  </NavLink>
                ) : (
                  // Si NO es admin (es usuario normal) muestra esto
                  <NavLink end to="/playlist" className="nav-link nav-link-custom">
                     Mi Música
                  </NavLink>
                )}

                <Button
                  variant="outline-light"
                  className="btn-cuenta ms-lg-3 mt-3 mt-lg-0"
                  onClick={logout}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button
                variant="outline-light"
                className="btn-gradient ms-lg-3 mt-3 mt-lg-0"
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