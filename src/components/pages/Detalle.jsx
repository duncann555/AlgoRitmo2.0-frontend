import { Card, Row, Col, Button } from "react-bootstrap";
import "../../styles/detalle.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// 👇 CAMBIO 1: Importamos la búsqueda por ID específica
import { obtenerCancionPorId } from "../../helpers/queries";

const Detalle = () => {
  const { id } = useParams();
  const [cancion, setCancion] = useState(null);
  // Agregué un estado de "Cargando" para que no parpadee el "No encontrada" al inicio
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      // 👇 CAMBIO 2: Llamada directa por ID al backend
      const respuesta = await obtenerCancionPorId(id);
      
      // Si el backend no encuentra nada, suele devolver null o 404
      setCancion(respuesta);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  // Renderizados condicionales (UX Básica)
  if (cargando) {
    return <h2 className="text-center mt-5 text-light">Cargando detalle...</h2>;
  }

  if (!cancion) {
    return <h2 className="text-center mt-5 text-light">Canción no encontrada 😢</h2>;
  }

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

              <p className="fs-4">
                <strong>Duración:</strong> {cancion.duracion}
              </p>
              <p className="fs-4">
                <strong>Género:</strong> {cancion.categoria}
              </p>
              <p className="fs-4">
                <strong>Año:</strong> {cancion.anio}
              </p>
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