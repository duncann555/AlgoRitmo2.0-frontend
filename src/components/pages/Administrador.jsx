import { useEffect, useState } from "react";
import { Button, Form, Table, Container, Row, Col } from "react-bootstrap"; // Agregamos Container, Row, Col
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";

function Administrador() {
  const navigate = useNavigate();
  const [canciones, setCanciones] = useState([]);
  const [palabraBuscador, setPalabraBuscador] = useState("");
  const [cancionFiltrada, setcancionFiltrada] = useState([]);

  function manejoCambioBuscador(e) {
    setPalabraBuscador(e.target.value);
  }

  useEffect(() => {
    if (palabraBuscador) {
      const codigoBusqueda = parseInt(palabraBuscador);
      const filtrado = canciones.filter(function (cancion, i) {
        return (
          cancion.titulo.toLowerCase().includes(palabraBuscador.toLowerCase()) ||
          cancion.artista.toLowerCase().includes(palabraBuscador.toLowerCase()) ||
          (!isNaN(codigoBusqueda) && i + 1 === codigoBusqueda) ||
          cancion.categoria.toLowerCase().includes(palabraBuscador.toLowerCase())
        );
      });
      setcancionFiltrada(filtrado);
    } else {
      setcancionFiltrada(canciones);
    }
  }, [palabraBuscador, canciones]);

  useEffect(() => {
    const data = localStorage.getItem("canciones");
    if (data) {
      setCanciones(JSON.parse(data));
    }
  }, []);

  function manejoDelete(i) {
    Swal.fire({
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
    }).then(function (result) {
      if (result.isConfirmed) {
        const cancionActual = [...canciones];
        cancionActual.splice(i, 1);
        localStorage.setItem("canciones", JSON.stringify(cancionActual));
        setCanciones(cancionActual);
        
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
    });
  }

  function manejoEdit(cancion, index) {
    navigate("/admin/formulario", { state: { cancion, index } });
  }

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
              aria-label="Buscar"
              onChange={manejoCambioBuscador}
              value={palabraBuscador}
            />
            <Button
              className="btn-gradient text-nowrap"
              onClick={() => navigate("/admin/formulario")}
            >
              <i className="bi bi-music-note-beamed me-2"></i> 
              <span className="d-none d-sm-inline">Agregar</span>
              <span className="d-inline d-sm-none">+</span>
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
                <th>Título</th>
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
                    <td className="text-truncate" style={{ maxWidth: "150px" }}>{cancion.titulo}</td>
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
                          onClick={() => manejoDelete(i)}
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