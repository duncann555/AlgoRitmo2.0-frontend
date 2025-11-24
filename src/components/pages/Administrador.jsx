import { useEffect, useState } from "react";
import { Button, Form, Table, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";
import { getCanciones, borrarCancionApi } from "../../../services/canciones.service";

function Administrador() {
  const navigate = useNavigate();
  const [canciones, setCanciones] = useState([]);
  const [palabraBuscador, setPalabraBuscador] = useState("");
  const [cancionFiltrada, setCancionFiltrada] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getCanciones();
      setCanciones(lista);
    };
    cargar();
  }, []);

  useEffect(() => {
    if (palabraBuscador) {
      const codigoBusqueda = parseInt(palabraBuscador);
      const filtrado = canciones.filter((cancion, i) =>
        cancion.nombre.toLowerCase().includes(palabraBuscador.toLowerCase()) ||
        cancion.artista.toLowerCase().includes(palabraBuscador.toLowerCase()) ||
        (!isNaN(codigoBusqueda) && i + 1 === codigoBusqueda) ||
        cancion.categoria.toLowerCase().includes(palabraBuscador.toLowerCase())
      );
      setCancionFiltrada(filtrado);
    } else {
      setCancionFiltrada(canciones);
    }
  }, [palabraBuscador, canciones]);

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
      await borrarCancionApi(idCancion);
      setCanciones((prev) => prev.filter((c) => c.id !== idCancion));

      Swal.fire({
        title: "Eliminada",
        text: "La canción fue eliminada correctamente",
        icon: "success",
        customClass: {
          popup: "swal-popup-custom",
          confirmButton: "btn-swal-confirm",
        },
      });
    }
  };

  const manejoEdit = (cancion, index) => {
    navigate("/admin/formulario", { state: { cancion, index } });
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
              placeholder="Buscar canción..."
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
          <Table responsive bordered hover variant="dark" className="admin-table align-middle">
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
              {cancionFiltrada.length > 0 ? (
                cancionFiltrada.map((cancion, i) => (
                  <tr key={cancion.id}>
                    <td>{i + 1}</td>
                    <td className="text-truncate" style={{ maxWidth: "150px" }}>
                      {cancion.nombre}
                    </td>
                    <td>{cancion.artista}</td>
                    <td className="d-none d-md-table-cell">{cancion.categoria}</td>
                    <td className="d-none d-sm-table-cell">{cancion.duracion}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          className="admin-button-edit"
                          onClick={() => manejoEdit(cancion, i)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="admin-button-trash"
                          onClick={() => manejoDelete(cancion.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay resultados.</td>
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
