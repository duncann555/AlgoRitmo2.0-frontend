import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../styles/app.css";

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
          cancion.titulo
            .toLowerCase()
            .includes(palabraBuscador.toLowerCase()) ||
          cancion.artista
            .toLowerCase()
            .includes(palabraBuscador.toLowerCase()) ||
          (!isNaN(codigoBusqueda) && i + 1 === codigoBusqueda) ||
          cancion.categoria
            .toLowerCase()
            .includes(palabraBuscador.toLowerCase())
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
    <section className="container admin-panel">
      <div className="d-flex justify-content-center align-items-center mt-4">
        <h1 className="admin-title">Administración de Canciones</h1>
      </div>

      <div className="mt-4">
        <Form className="row g-2 justify-content-center">
          <div className="col-12 col-lg-8 col-md-10 d-flex gap-2">
            <Form.Control
              type="search"
              placeholder="Buscar canción..."
              className="admin-control-buscar flex-grow-1"
              aria-label="Buscar"
              onChange={manejoCambioBuscador}
              value={palabraBuscador}
            />

            <Button
              className="btn-agregarCancion"
              onClick={() => navigate("/admin/formulario")}
            >
              <i className="bi bi-music-note-beamed me-2"></i> Agregar
            </Button>
          </div>
        </Form>
      </div>

      <Table
        responsive
        bordered
        hover
        variant="dark"
        className="mt-4 admin-table"
      >
        <thead>
          <tr className="text-center">
            <th>N°</th>
            <th>Título</th>
            <th>Artista/Grupo</th>
            <th>Categoría</th>
            <th>Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {cancionFiltrada.length > 0 ? (
            cancionFiltrada.map(function (cancion, i) {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{cancion.titulo}</td>
                  <td>{cancion.artista}</td>
                  <td>{cancion.categoria}</td>
                  <td>{cancion.duracion}</td>
                  <td className="text-center">
                    <Button
                      className="me-2 admin-button-edit"
                      onClick={() => manejoEdit(cancion, i)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button
                      className="admin-button-trash"
                      onClick={() => manejoDelete(i)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">
                No hay canciones que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </section>
  );
}

export default Administrador;
