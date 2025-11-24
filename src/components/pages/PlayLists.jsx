import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../../styles/app.css";

const Playlist = ({ playlist = [], onRemove }) => {
  return (
    <div className="playlist-container">
      <h5 className="playlist-title">Tu Playlist</h5>

      {playlist.length === 0 ? (
        <p className="text-muted">No agregaste canciones aún.</p>
      ) : (
        <ul className="playlist-list">
          {playlist.map((song) => (
            <li
              key={song.id}
              className="playlist-item d-flex align-items-center justify-content-between gap-2"
            >
              <Link
                to={`/detalles/${song.id}`}
                className="playlist-link flex-grow-1 text-truncate"
                title={`${song.nombre} - ${song.artista}`}
              >
                🎵 {song.nombre} - {song.artista}
              </Link>

              {onRemove && (
                <Button
                  variant="outline-light"
                  size="sm"
                  className="btn-remove-pill playlist-remove-btn"
                  onClick={() => onRemove(song.id)}
                >
                  <i className="bi bi-x-lg"></i>
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Playlist;
