import { Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/app.css"; 

const MiPlaylist = () => {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("playlist")) || [];
    setPlaylist(data);
  }, []);

  if (playlist.length === 0) {
    return (
      <h3 className="text-center mt-5 text-light">
        No agregaste canciones a tu playlist todavía.
      </h3>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-light">🎧 Tu Playlist favorita</h2>

      <Row className="gy-4">
        {playlist.map((cancion) => (
          <Col key={cancion.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="cardSpotify rounded-4 overflow-hidden h-100">
              <Card.Img
                src={cancion.imagen || "/defecto.png"}
                className="cardImg"
              />

              <Card.Body className="text-center">
                <Card.Title>{cancion.artista}</Card.Title>
                <Card.Text>{cancion.titulo}</Card.Text>

                <Button
                  as={Link}
                  to={`/detalles/${cancion.id}`}
                  className="btn-gradient mt-2"
                >
                  Ver Detalle
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MiPlaylist;
