import { Card, Row, Col, Button } from "react-bootstrap";
import "../../styles/detalle.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCanciones } from "../../../services/canciones.service";

const Detalle = () => {
  const { id } = useParams();
  const [cancion, setCancion] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const todas = await getCanciones();
      const encontrada = todas.find((c) => c.id === id);
      setCancion(encontrada);
    };
    cargar();
  }, [id]);

  if (!cancion) return <h2 className="text-center mt-5">Canción no encontrada</h2>;

  return (
    <>
      <Card className="mt-5 p-3 shadow-sm fondo-detalle">
        <Row>
          <Col md={4} className="d-flex align-items-center justify-content-center">
            <Card.Img
              src={cancion.imagen || "/defecto.png"}
              alt="Portada"
              className="img-fluid rounded detalleImg"
            />
          </Col>

          <Col md={8}>
            <Card.Body>
              <Card.Title className="fs-1 mb-4 texto-detalle">
                {cancion.nombre}
              </Card.Title>
              <Card.Subtitle className="fs-3 mb-4 text-muted texto">
                {cancion.album}
              </Card.Subtitle>
              <Card.Subtitle className="fs-3 mb-4 text-muted texto">
                {cancion.artista}
              </Card.Subtitle>

              <hr />

              <p className="fs-4"><strong>Duración:</strong> {cancion.duracion}</p>
              <p className="fs-4"><strong>Género:</strong> {cancion.categoria}</p>
              <p className="fs-4"><strong>Año:</strong> {cancion.anio}</p>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      <div className="d-flex justify-content-center my-3">
        <Button as={Link} to="/" className="btn-gradient">
          <i className="bi bi-arrow-bar-left"> Volver al Inicio </i>
        </Button>
      </div>
    </>
  );
};

export default Detalle;
