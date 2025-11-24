import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import img from "../../img/1.png";
import "../../styles/app.css";
// 👇 CAMBIO 1: Importamos las funciones nuevas (fijate las mayúsculas en API)
import { crearCancionAPI, editarCancionAPI } from "../../helpers/queries";

const FormularioAdmin = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();

  // Verificamos si hay estado para saber si estamos editando
  const editar = location.state?.cancion !== undefined;

  useEffect(() => {
    if (editar) {
      const { cancion } = location.state;
      setValue("nombre", cancion.nombre);
      setValue("artista", cancion.artista);
      setValue("categoria", cancion.categoria);
      setValue("imagen", cancion.imagen);
      setValue("duracion", cancion.duracion);
      setValue("anio", cancion.anio);
      setValue("album", cancion.album);
    } else {
      reset();
    }
  }, [editar, location.state, setValue, reset]);

  const imagenDefecto = img;

  const onSubmit = async (data) => {
    const songFront = {
      nombre: data.nombre,
      artista: data.artista,
      categoria: data.categoria,
      album: data.album,
      anio: data.anio,
      imagen: data.imagen?.trim() ? data.imagen : imagenDefecto,
      duracion: data.duracion,
    };

    try {
      let respuesta;

      if (editar) {
        // 👇 CAMBIO 2: Blindaje del ID (_id vs id)
        const cancion = location.state.cancion;
        const idCancion = cancion._id || cancion.id;
        
        respuesta = await editarCancionAPI(idCancion, songFront);
      } else {
        respuesta = await crearCancionAPI(songFront);
      }

      // 👇 CAMBIO 3: Validación de respuesta HTTP
      // Como queries.js devuelve el objeto Response, chequeamos .status o .ok
      if (respuesta && respuesta.status >= 200 && respuesta.status < 300) {
        
        Swal.fire({
          title: editar ? "Cambios guardados" : "Canción creada",
          text: `La canción "${songFront.nombre}" fue procesada con éxito`,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "swal-popup-custom",
            confirmButton: "btn-swal-confirm",
          },
        }).then(() => {
          if (!editar) reset(); // Limpiamos solo si creamos
          navigate("/admin");
        });

      } else {
        // Si el backend tiró un error (ej: 400, 500)
        throw new Error("No se pudo procesar la solicitud en el servidor.");
      }

    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Ocurrió un problema, intente más tarde.", "error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <Form className="form-flotante" onSubmit={handleSubmit(onSubmit)}>
          <Button size="sm" className="btn-close-modal" onClick={() => navigate(-1)}>
            ✖
          </Button>

          <h2 className="text-center mb-4">
            {editar ? "Editar Canción" : "Crear Canción"}
          </h2>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Sweet Child O' Mine"
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
              })}
              isInvalid={!!errors.nombre}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Artista o Grupo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Guns N' Roses"
              {...register("artista", {
                required: "El artista es obligatorio",
                minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
              })}
              isInvalid={!!errors.artista}
            />
            <Form.Control.Feedback type="invalid">
              {errors.artista?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              {...register("categoria", { required: "La categoría es obligatoria" })}
              isInvalid={!!errors.categoria}
            >
              <option value="">Seleccione una opción</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Urbano">Urbano</option>
              <option value="Balada">Balada</option>
              <option value="Cumbia">Cumbia</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Regueton">Regueton</option>
              <option value="Tango">Tango</option>
              <option value="Folcklore">Folcklore</option>
              <option value="Jazz">Jazz</option>
              <option value="Romantico">Romantico</option>
              <option value="Lentos">Lentos</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.categoria?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Álbum</Form.Label>
            <Form.Control
              type="text"
              placeholder="Appetite for Destruction"
              {...register("album", {
                required: "El álbum es obligatorio",
                minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
              })}
              isInvalid={!!errors.album}
            />
            <Form.Control.Feedback type="invalid">
              {errors.album?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Año</Form.Label>
            <Form.Control
              type="number"
              placeholder="1987"
              {...register("anio", {
                required: "El año es obligatorio",
                min: { value: 1900, message: "Debe ser mayor a 1900" },
                max: { value: new Date().getFullYear(), message: "No puede ser futuro" },
              })}
              isInvalid={!!errors.anio}
            />
            <Form.Control.Feedback type="invalid">
              {errors.anio?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen URL*</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://ejemplo.com/imagen.jpg"
              {...register("imagen")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duración</Form.Label>
            <Form.Control
              type="text"
              placeholder="02:22"
              {...register("duracion", {
                required: "La duración es obligatoria",
                pattern: { value: /^\d{2}:\d{2}$/, message: "Formato mm:ss" },
              })}
              isInvalid={!!errors.duracion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.duracion?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="btn-gradient mt-3 w-100">
            {editar ? "Guardar Cambios" : "Crear Canción"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default FormularioAdmin;