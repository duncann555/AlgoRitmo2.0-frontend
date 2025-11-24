import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import "../../styles/home.css";
import PlaylistSidebar from "../pages/PlayLists.jsx"; // tu componente sidebar
import { FaMusic, FaPlus, FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import { getCanciones } from "../../../services/canciones.service";
import { getPlaylist, addToPlaylistApi, removeFromPlaylistApi } from "../../../services/playlist.service";

const ITEMS_POR_VISTA = 6;

const Home = () => {
  const [busqueda, setBusqueda] = useState("");
  const [todasLasCanciones, setTodasLasCanciones] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [indicePlaylist, setIndicePlaylist] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("usuarioKey")) || false;

  // canciones desde backend
  useEffect(() => {
    const cargar = async () => {
      const lista = await getCanciones();
      setTodasLasCanciones(lista);
    };
    cargar();
  }, []);

  // playlist del usuario desde backend
  useEffect(() => {
    const cargarPlaylist = async () => {
      if (!user?.id) return setPlaylist([]);
      const pl = await getPlaylist(user.id);
      setPlaylist(pl);
    };
    cargarPlaylist();
  }, []);

  const agregarAPlaylist = async (song) => {
    if (!user?.id) {
      Swal.fire("Login requerido", "Logueate para usar playlists", "info");
      navigate("/login");
      return;
    }

    await addToPlaylistApi(user.id, song.id);

    setPlaylist((prev) => {
      const yaExiste = prev.some((p) => p.id === song.id);
      return yaExiste ? prev : [...prev, song];
    });
  };

  const quitarDePlaylist = async (id) => {
    if (!user?.id) return;

    await removeFromPlaylistApi(user.id, id);
    setPlaylist((prev) => prev.filter((p) => p.id !== id));
  };

  const playlistVisible = () => {
    const total = playlist.length;
    if (total <= ITEMS_POR_VISTA) return playlist;

    const fin = indicePlaylist + ITEMS_POR_VISTA;
    if (fin <= total) return playlist.slice(indicePlaylist, fin);

    const sobrante = fin - total;
    return [
      ...playlist.slice(indicePlaylist, total),
      ...playlist.slice(0, sobrante),
    ];
  };

  const siguientePlaylist = () => {
    if (playlist.length === 0) return;
    setIndicePlaylist((prev) => (prev + 1) % playlist.length);
  };

  const anteriorPlaylist = () => {
    if (playlist.length === 0) return;
    setIndicePlaylist((prev) =>
      prev - 1 < 0 ? playlist.length - 1 : prev - 1
    );
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
        {/* BANNER */}
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
              <Button
                type="button"
                onClick={anteriorPlaylist}
                className="btn-playlist-nav-circle btn-playlist-left"
              >
                <i className="bi bi-chevron-left" />
              </Button>

              <Button
                type="button"
                onClick={siguientePlaylist}
                className="btn-playlist-nav-circle btn-playlist-right"
              >
                <i className="bi bi-chevron-right" />
              </Button>

              <div className="mt-4">
                <h3 className="playlist-subtitle mb-2">Tu playlist favorita</h3>

                <div className="playlist-banner-container mt-2 pb-5">
                  {playlistVisible().map((cancion) => (
                    <div key={cancion.id} className="playlist-mini-card">
                      <div
                        className="playlist-mini-main"
                        onClick={() => navigate(`/detalles/${cancion.id}`)}
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
                          quitarDePlaylist(cancion.id);
                        }}
                      >
                        <i className="bi bi-x-lg" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* GRID */}
        <section className="mt-4">
          <h3 className="mb-3 text-white">Canciones</h3>

          <Row className="gy-4">
            {(busqueda.trim() !== "" ? cancionesFiltradas : todasLasCanciones)
              .map((cancion, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                  <Card className="h-100 rounded-4 overflow-hidden cardSpotify">
                    <div className="card-img-wrapper">
                      <Card.Img
                        variant="top"
                        src={cancion.imagen || "/defecto.png"}
                        className="cardImg"
                      />

                      <Link
                        to={`/detalles/${cancion.id}`}
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
                          playlist.some((p) => p.id === cancion.id)
                            ? "btn-agregar-playlist"
                            : "btn-gradient"
                        }`}
                        onClick={() => agregarAPlaylist(cancion)}
                      >
                        {playlist.some((p) => p.id === cancion.id) ? (
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
              ))}
          </Row>
        </section>
      </Col>
    </Row>
  );
};

export default Home;
