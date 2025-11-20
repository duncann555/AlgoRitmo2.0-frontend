import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Card, Form } from "react-bootstrap";

import canciones from "../../Data/CancionesInicio.js";
import "../../styles/Home.css";
import Playlist from "../pages/PlayLists.jsx";

const ITEMS_POR_VISTA = 6;

const Home = () => {
  const [busqueda, setBusqueda] = useState("");
  const [todasLasCanciones, setTodasLasCanciones] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [indicePlaylist, setIndicePlaylist] = useState(0);

  const navigate = useNavigate();

  // === CARGAR PLAYLIST DESDE LOCALSTORAGE ===
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("playlist")) || [];
    setPlaylist(data);
  }, []);

  // === CARGAR CANCIONES ===
  useEffect(() => {
    const cancionesGuardadas =
      JSON.parse(localStorage.getItem("canciones")) || [];
    setTodasLasCanciones([...canciones, ...cancionesGuardadas]);
  }, []);

  // === AGREGAR A PLAYLIST (BANNER + CARDS) ===
  const agregarAPlaylist = (song) => {
    setPlaylist((prev) => {
      const yaExiste = prev.some((item) => item.id === song.id);
      if (yaExiste) return prev;

      const nuevaLista = [...prev, song];
      localStorage.setItem("playlist", JSON.stringify(nuevaLista));
      return nuevaLista;
    });
  };

  // === QUITAR DE PLAYLIST (SIDEBAR + BANNER) ===
  const quitarDePlaylist = (id) => {
    setPlaylist((prev) => {
      const nuevaLista = prev.filter((item) => item.id !== id);
      localStorage.setItem("playlist", JSON.stringify(nuevaLista));
      return nuevaLista;
    });
  };

  // === CARRUSEL DEL BANNER ===
  const playlistVisible = () => {
    const total = playlist.length;
    if (total <= ITEMS_POR_VISTA) return playlist;

    const fin = indicePlaylist + ITEMS_POR_VISTA;

    if (fin <= total) {
      return playlist.slice(indicePlaylist, fin);
    }

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

  // === FILTRO DE BÚSQUEDA ===
const cancionesFiltradas = todasLasCanciones.filter((cancion) => {
  const textoBusqueda = busqueda.toLowerCase();

  const titulo = (cancion.nombreCancion || cancion.titulo || "").toLowerCase();
  const artista = (cancion.artista || "").toLowerCase();
  const categoria = (cancion.categoria || "").toLowerCase();

  return (
    titulo.includes(textoBusqueda) ||
    artista.includes(textoBusqueda) ||
    categoria.includes(textoBusqueda)
  );
});


  return (
    <Row className="g-4 mt-3">
      {/* === SIDEBAR === */}
      <Col xs={12} lg={4} xl={3} className="mb-4 mb-lg-0">
        <aside className="spotify-sidebar text-white sidebar-sticky">
          <h3 className="logo-sidebar mb-4 text-center">AlgoRitmo</h3>

          <div className="sidebar-section">
            <p className="sidebar-title text-uppercase mb-2">
              Tu biblioteca
            </p>

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

            <Playlist playlist={playlist} onRemove={quitarDePlaylist} />
          </div>
        </aside>
      </Col>

      {/* === CONTENIDO PRINCIPAL === */}
      <Col xs={12} lg={8} xl={9}>
        {/* === BANNER === */}
        <section className="banner-spotify mb-4 mb-lg-5 position-relative">
          <div className="banner-info">
            <p className="categoria-banner mb-1">Playlist</p>
            <h1 className="titulo-banner mb-2">Tu música favorita</h1>
            <p className="descripcion-banner mb-0">
              Descubrí artistas nuevos y recordá los clásicos.
            </p>
          </div>

          <Button className="btn-gradient btn-lg position-absolute bottom-0 end-0 me-3 mb-3">
            Reproducir
          </Button>

          {playlist.length > 0 && (
            <>
              {/* Botones grandes laterales */}
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
                <h3 className="playlist-subtitle mb-2">
                  Tu playlist favorita
                </h3>

                <div className="playlist-banner-container mt-2">
                  {playlistVisible().map((cancion) => {
                    const nombre =
                      cancion.nombreCancion || cancion.titulo || "Sin título";
                    const artista = cancion.artista || "Desconocido";

                    return (
                      <div key={cancion.id} className="playlist-mini-card">
                        <div
                          className="playlist-mini-main"
                          onClick={() => navigate(`/detalles/${cancion.id}`)}
                        >
                          <img
                            src={cancion.imagen || "/defecto.png"}
                            alt={nombre}
                            className="playlist-mini-img"
                          />
                          <div className="playlist-mini-info">
                            <p className="playlist-mini-title">
                              {nombre} - {artista}
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
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>

        {/* === RESULTADO DE BÚSQUEDA VACÍO === */}
        {busqueda.trim() !== "" && cancionesFiltradas.length === 0 && (
          <h4 className="text-danger mt-4">
            <i className="bi bi-emoji-frown" /> No se encontró ninguna canción
          </h4>
        )}

        {/* === GRID DE CANCIONES === */}
        <section className="mt-4">
          <h3 className="mb-3 text-white">Canciones</h3>

          <Row className="gy-4">
            {(busqueda.trim() !== ""
              ? cancionesFiltradas
              : todasLasCanciones
            ).map((cancion, index) => (
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
                    <Card.Text>
                      {cancion.nombreCancion || cancion.titulo}
                    </Card.Text>

                    <Button
                      className={`btn-agregar-playlist mt-2 ${
                        playlist.some((p) => p.id === cancion.id)
                          ? "agregada"
                          : ""
                      }`}
                      onClick={() => agregarAPlaylist(cancion)}
                    >
                      {playlist.some((p) => p.id === cancion.id)
                        ? "✓ Agregada"
                        : "➕ Agregar"}
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
