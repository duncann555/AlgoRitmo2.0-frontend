import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import "../../styles/home.css";
import PlaylistSidebar from "../pages/PlayLists.jsx"; 
import { FaMusic, FaPlus, FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";

// 👇 CAMBIO 1: Importamos todo desde helpers/queries
import { 
  listarCanciones, 
  obtenerPlaylist, 
  agregarAplaylistAPI, 
  borrarDePlaylistAPI 
} from "../../helpers/queries";

const ITEMS_POR_VISTA = 6;

const Home = () => {
  const [busqueda, setBusqueda] = useState("");
  const [todasLasCanciones, setTodasLasCanciones] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [indicePlaylist, setIndicePlaylist] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("usuarioKey")) || false;
  // Normalizamos el ID del usuario por si viene como _id
  const userId = user ? (user.id || user._id || user.uid) : null;

  // --- CARGAR CANCIONES ---
  useEffect(() => {
    const cargar = async () => {
      // 👇 CAMBIO 2: Usamos listarCanciones
      const lista = await listarCanciones();
      setTodasLasCanciones(lista || []);
    };
    cargar();
  }, []);

  // --- CARGAR PLAYLIST ---
  useEffect(() => {
    const cargarPlaylist = async () => {
      if (!userId) return setPlaylist([]);
      // 👇 CAMBIO 3: Usamos obtenerPlaylist
      const pl = await obtenerPlaylist(userId);
      setPlaylist(pl || []);
    };
    cargarPlaylist();
  }, [userId]); // Agregué userId como dependencia

  // --- AGREGAR A PLAYLIST ---
  const agregarAPlaylist = async (song) => {
    if (!userId) {
      Swal.fire("Login requerido", "Logueate para usar playlists", "info");
      navigate("/login");
      return;
    }

    // Normalizamos ID de la canción
    const songId = song._id || song.id;

    // 👇 CAMBIO 4: Llamada a la API nueva
    await agregarAplaylistAPI(userId, songId);

    // Actualizamos estado local
    setPlaylist((prev) => {
      // Chequeamos IDs normalizados para no duplicar
      const yaExiste = prev.some((p) => (p._id || p.id) === songId);
      return yaExiste ? prev : [...prev, song];
    });
  };

  // --- QUITAR DE PLAYLIST ---
  const quitarDePlaylist = async (idCancion) => {
    if (!userId) return;

    // 👇 CAMBIO 5: Llamada a la API nueva
    await borrarDePlaylistAPI(userId, idCancion);
    
    // Filtramos usando IDs normalizados
    setPlaylist((prev) => prev.filter((p) => (p._id || p.id) !== idCancion));
  };

  // Lógica del Carrusel (Sin cambios, solo funciona visualmente)
  const playlistVisible = () => {
    const total = playlist.length;
    if (total <= ITEMS_POR_VISTA) return playlist;
    const fin = indicePlaylist + ITEMS_POR_VISTA;
    if (fin <= total) return playlist.slice(indicePlaylist, fin);
    const sobrante = fin - total;
    return [...playlist.slice(indicePlaylist, total), ...playlist.slice(0, sobrante)];
  };

  const siguientePlaylist = () => {
    if (playlist.length === 0) return;
    setIndicePlaylist((prev) => (prev + 1) % playlist.length);
  };

  const anteriorPlaylist = () => {
    if (playlist.length === 0) return;
    setIndicePlaylist((prev) => (prev - 1 < 0 ? playlist.length - 1 : prev - 1));
  };

  const cancionesFiltradas = todasLasCanciones.filter((cancion) => {
    const texto = busqueda.toLowerCase();
    return (
      cancion.nombre.toLowerCase().includes(texto) ||
      cancion.artista.toLowerCase().includes(texto) ||
      cancion.categoria.toLowerCase().includes(texto)
    );
  });

  return (
    <Row className="g-4 mt-3">
      {/* SIDEBAR */}
      <Col xs={12} lg={4} xl={3} className="mb-4 mb-lg-0">
        <aside className="spotify-sidebar text-white sidebar-sticky">
          <h3 className="logo-sidebar mb-4 text-center">
            AlgoRitmo <FaMusic style={{ color: "#e8458b" }} />
          </h3>

          <div className="sidebar-section">
            <p className="sidebar-title text-uppercase mb-2">Tu biblioteca</p>

            <div className="sidebar-search mb-3">
              <Form.Control
                type="search"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border-0"
              />
            </div>

            <Button
              className="btn-gradient w-100 mb-3"
              onClick={() => setBusqueda("")}
            >
              Limpiar
            </Button>

            <PlaylistSidebar playlist={playlist} onRemove={quitarDePlaylist} />
          </div>
        </aside>
      </Col>

      {/* CONTENIDO */}
      <Col xs={12} lg={8} xl={9}>
        {/* BANNER PLAYLIST */}
        <section className="banner-playlist mb-4 mb-lg-5 position-relative">
          <div className="banner-info">
            <p className="categoria-banner mb-1">Playlist</p>
            <h1 className="titulo-banner mb-2">Tu música favorita</h1>
          </div>

          <Button className="btn-gradient btn-lg position-absolute bottom-0 end-0 me-3 mb-3">
            Reproducir
          </Button>

          {playlist.length > 0 && (
            <>
              <Button onClick={anteriorPlaylist} className="btn-playlist-nav-circle btn-playlist-left">
                <i className="bi bi-chevron-left" />
              </Button>

              <Button onClick={siguientePlaylist} className="btn-playlist-nav-circle btn-playlist-right">
                <i className="bi bi-chevron-right" />
              </Button>

              <div className="mt-4">
                <h3 className="playlist-subtitle mb-2">Tu playlist favorita</h3>

                <div className="playlist-banner-container mt-2 pb-5">
                  {playlistVisible().map((cancion) => {
                     // ID seguro para el banner
                     const id = cancion._id || cancion.id;
                     return (
                      <div key={id} className="playlist-mini-card">
                        <div
                          className="playlist-mini-main"
                          onClick={() => navigate(`/detalles/${id}`)}
                        >
                          <img
                            src={cancion.imagen || "/defecto.png"}
                            alt={cancion.nombre}
                            className="playlist-mini-img"
                          />
                          <div className="playlist-mini-info">
                            <p className="playlist-mini-title">
                              {cancion.nombre} - {cancion.artista}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="outline-light"
                          size="sm"
                          className="btn-remove-pill btn-remove-playlist mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            quitarDePlaylist(id);
                          }}
                        >
                          <i className="bi bi-x-lg" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>

        {/* GRID CANCIONES */}
        <section className="mt-4">
          <h3 className="mb-3 text-white">Canciones</h3>

          <Row className="gy-4">
            {(busqueda.trim() !== "" ? cancionesFiltradas : todasLasCanciones)
              .map((cancion) => {
                // ID seguro para el grid
                const id = cancion._id || cancion.id;
                
                // 👇 Lógica BLINDADA para saber si ya está en la playlist
                const estaEnPlaylist = playlist.some(
                    (p) => (p._id || p.id) === id
                );

                return (
                  <Col key={id} xs={12} sm={6} md={4} lg={3}>
                    <Card className="h-100 rounded-4 overflow-hidden cardSpotify">
                      <div className="card-img-wrapper">
                        <Card.Img
                          variant="top"
                          src={cancion.imagen || "/defecto.png"}
                          className="cardImg"
                        />
                        <Link
                          to={`/detalles/${id}`}
                          className="play-btn-overlay"
                        >
                          <i className="bi bi-play-circle-fill play-btn" />
                        </Link>
                      </div>

                      <Card.Body className="text-center">
                        <Card.Title>{cancion.artista}</Card.Title>
                        <Card.Text>{cancion.nombre}</Card.Text>

                        <Button
                          className={`mt-2 ${
                            estaEnPlaylist ? "btn-agregar-playlist" : "btn-gradient"
                          }`}
                          onClick={() => agregarAPlaylist(cancion)}
                          // Deshabilitamos si ya está, para evitar doble click
                          disabled={estaEnPlaylist} 
                        >
                          {estaEnPlaylist ? (
                            <>
                              <FaCheck className="me-2 icono-check" />
                              Agregada
                            </>
                          ) : (
                            <>
                              <FaPlus className="me-2 fs-5" />
                              Agregar
                            </>
                          )}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </section>
      </Col>
    </Row>
  );
};

export default Home;