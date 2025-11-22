import { Container, Row, Col } from "react-bootstrap";
import { Github, Instagram, Linkedin } from "react-bootstrap-icons";
import "../../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer-custom">
      <Container>
        <Row className="footer-cols-spacing">
          {/* Marca */}
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="footer-brand fuenteLogo">
              AlgoRitmo 2.0
              <img
                src="/logo.png"
                alt="AlgoRitmo Icon"
                className="footer-logo"
              />
            </h5>
            <p className="footer-description">
              Tu música, en cualquier momento, con estilo AlgoRitmo.
            </p>
          </Col>

          {/* Navegación */}
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="footer-title">Enlaces</h6>
            <ul className="footer-links">
              <li>
                <a href="/" className="footer-link">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/catalogo" className="footer-link">
                  Listas
                </a>
              </li>
              <li>
                <a href="/about" className="footer-link">
                  Acerca de nosotros
                </a>
              </li>
            </ul>
          </Col>

          {/* Contacto + Redes */}
          <Col md={4}>
            <h6 className="footer-title">Contacto</h6>
            <p className="footer-contact">Email: sebaflomen@gmail.com</p>

            <div className="footer-socials">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <p className="text-center footer-copy">
          &copy; 2025 <span className="footer-copy">AlgoRitmo 2.0 </span> App – Todos
          los derechos reservados
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
