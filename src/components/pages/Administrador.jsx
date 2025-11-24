import { useEffect, useState } from "react";
import { Button, Form, Table, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";
import { listarCanciones, borrarCancionAPI } from "../../helpers/queries";

function Administrador() {
  const navigate = useNavigate();
  const [canciones, setCanciones] = useState([]);
  const [palabraBuscador, setPalabraBuscador] = useState("");

  useEffect(() => {
    cargarCanciones();
  }, []);

  const cargarCanciones = async () => {
    const respuesta = await listarCanciones();
    setCanciones(respuesta || []);
  };

  const cancionesFiltradas = canciones.filter((cancion, i) => {
    if (!palabraBuscador) return true;

    const textoBusqueda = palabraBuscador.toLowerCase();
    const codigoBusqueda = parseInt(palabraBuscador);

    return (
      cancion.nombre.toLowerCase().includes(textoBusqueda) ||
      cancion.artista.toLowerCase().includes(textoBusqueda) ||
      cancion.categoria.toLowerCase().includes(textoBusqueda) ||
      (!isNaN(codigoBusqueda) && i + 1 === codigoBusqueda)
    );
  });

  const manejoDelete = async (idCancion) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "swal-popup-custom",
        confirmButton: "btn-swal-confirm",
        cancelButton: "btn-swal-cancel",
      },
    });

    if (result.isConfirmed) {
      const respuesta = await borrarCancionAPI(idCancion);

      if (respuesta && respuesta.ok) {
        // Actualizamos la tabla visualmente quitando la canción borrada
        setCanciones((prev) =>
          prev.filter((c) => (c.id || c._id) !== idCancion)
        );

        Swal.fire({
          title: "Eliminada",
          text: "La canción fue eliminada correctamente",
          icon: "success",
          customClass: {
            popup: "swal-popup-custom",
            confirmButton: "btn-swal-confirm",
          },
        });
      } else {
        Swal.fire("Error", "No se pudo eliminar la canción", "error");
      }
    }
  };

  const manejoEdit = (cancion) => {
    navigate("/admin/formulario", { state: { cancion } });
  };

  return (
    <Container className="admin-panel py-4 mt-4">
      <Row className="justify-content-center align-items-center mb-4">
        <Col xs={12} className="text-center">
          <h1 className="admin-title">Administración de Canciones</h1>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <Form className="d-flex gap-2">
            <Form.Control
              type="search"
              placeholder="Buscar por nombre, artista o categoría..."
              className="admin-control-buscar flex-grow-1"
              onChange={(e) => setPalabraBuscador(e.target.value)}
              value={palabraBuscador}
            />
            <Button
              className="btn-gradient text-nowrap"
              onClick={() => navigate("/admin/formulario")}
            >
              <i className="bi bi-music-note-beamed me-2"></i>
              Agregar
            </Button>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Table
            responsive
            bordered
            hover
            variant="dark"
            className="admin-table align-middle"
          >
            <thead>
              <tr className="text-center">
                <th>N°</th>
                <th>Nombre</th>
                <th>Artista</th>
                <th className="d-none d-md-table-cell">Categoría</th>
                <th className="d-none d-sm-table-cell">Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {cancionesFiltradas.length > 0 ? (
                cancionesFiltradas.map((cancion, i) => (
                  <tr key={cancion.id || cancion._id}>
                    <td>{i + 1}</td>
                    <td className="text-truncate" style={{ maxWidth: "150px" }}>
                      {cancion.nombre}
                    </td>
                    <td>{cancion.artista}</td>
                    <td className="d-none d-md-table-cell">
                      {cancion.categoria}
                    </td>
                    <td className="d-none d-sm-table-cell">
                      {cancion.duracion}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          className="admin-button-edit"
                          onClick={() => manejoEdit(cancion)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="admin-button-trash"
                          onClick={() =>
                            manejoDelete(cancion.id || cancion._id)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4">
                    No se encontraron canciones que coincidan.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Administrador;
