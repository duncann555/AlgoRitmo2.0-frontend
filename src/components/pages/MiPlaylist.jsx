import { Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/app.css";
// 👇 CAMBIO 1: Importamos desde helpers/queries con el nuevo nombre
import { obtenerPlaylist } from "../../helpers/queries";

const MiPlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  // Recuperamos el usuario
  const user = JSON.parse(sessionStorage.getItem("usuarioKey")) || false;

  useEffect(() => {
    cargarPlaylist();
  }, []);

  const cargarPlaylist = async () => {
    // ⚠️ OJO ACÁ: A veces Mongo guarda el ID como '_id' o 'uid'. 
    // Asegurate de estar leyendo el campo correcto del sessionStorage.
    const userId = user.id || user._id || user.uid;

    if (!userId) return setPlaylist([]);
    
    // 👇 CAMBIO 2: Usamos la función nueva
    const respuesta = await obtenerPlaylist(userId);
    // Si la respuesta es null (error), ponemos array vacío para que no explote
    setPlaylist(respuesta || []);
  };

  // Validaciones de UI
  if (!user) {
    return <h3 className="text-center mt-5 text-light">Logueate para ver tu playlist.</h3>;
  }

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
        {playlist.map((cancion) => {
          // 👇 CAMBIO 3: La trampa del ID.
          // Definimos el ID acá para usarlo en Key y Link sin problemas.
          const songId = cancion._id || cancion.id;

          return (
            <Col key={songId} xs={12} sm={6} md={4} lg={3}>
              <Card className="cardSpotify rounded-4 overflow-hidden h-100">
                <Card.Img 
                  src={cancion.imagen || "/defecto.png"} 
                  className="cardImg" 
                />
                <Card.Body className="text-center">
                  <Card.Title>{cancion.artista}</Card.Title>
                  <Card.Text>{cancion.nombre}</Card.Text>

                  <Button 
                    as={Link} 
                    to={`/detalles/${songId}`} // Usamos el ID corregido
                    className="btn-gradient mt-2"
                  >
                    Ver Detalle
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default MiPlaylist;