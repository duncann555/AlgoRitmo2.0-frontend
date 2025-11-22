import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Google, Facebook } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/login.css";

const LoginPage = ({ setUsuarioLogueado }) => {
  const [show, setShow] = useState(true);
  const [modo, setModo] = useState("login"); // 'login' | 'registro'
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const handleClose = () => {
    setShow(false);
    navigate("/"); // si cierra el modal, lo mando al Home
  };

  const onSubmit = (formData) => {
    if (modo === "login") {
      manejarLogin(formData);
    } else {
      manejarRegistro(formData);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const manejarLogin = (data) => {
    const emailAdmin = import.meta.env.VITE_API_EMAIL;
    const passAdmin = import.meta.env.VITE_API_PASSWORD;

    // 1) Admin (credenciales del .env)
    if (data.email === emailAdmin && data.password === passAdmin) {
      setUsuarioLogueado(true);
      Swal.fire({
        title: "Bienvenido a la administración de AlgoRitmo",
        text: "Iniciaste sesión correctamente",
        icon: "success",
        customClass: {
          popup: "swal-popup-custom",
          confirmButton: "btn-swal-confirm",
        },
      });
      navigate("/admin");
      return;
    }

    // 2) Usuarios "normales" desde localStorage
    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuariosAlgoRitmo") || "[]"
    );

    const usuarioEncontrado = usuariosGuardados.find(
      (user) => user.email === data.email && user.password === data.password
    );

    if (usuarioEncontrado) {
      setUsuarioLogueado(true);
      Swal.fire({
        title: `¡Hola, ${usuarioEncontrado.nombre || "música lover"}!`,
        text: "Inicio de sesión correcto",
        icon: "success",
        customClass: {
          popup: "swal-popup-custom",
          confirmButton: "btn-swal-confirm",
        },
      });
      navigate("/");
    } else {
      Swal.fire({
        title: "Ocurrió un error",
        text: "Credenciales incorrectas",
        icon: "error",
        customClass: {
          popup: "swal-popup-custom",
          confirmButton: "btn-swal-cancel",
        },
      });
    }
  };

  // =========================
  // REGISTRO
  // =========================
  const manejarRegistro = (data) => {
    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuariosAlgoRitmo") || "[]"
    );

    const yaExiste = usuariosGuardados.some(
      (user) => user.email === data.email
    );

    if (yaExiste) {
      Swal.fire({
        title: "Correo ya registrado",
        text: "Probá iniciar sesión o usá otro correo.",
        icon: "warning",
        customClass: {
          popup: "swal-popup-custom",
          confirmButton: "btn-swal-confirm",
        },
      });
      return;
    }

    const nuevoUsuario = {
      nombre: data.nombre,
      email: data.email,
      password: data.password,
    };

    const nuevaLista = [...usuariosGuardados, nuevoUsuario];
    localStorage.setItem("usuariosAlgoRitmo", JSON.stringify(nuevaLista));

    Swal.fire({
      title: "Cuenta creada",
      text: "Ya podés iniciar sesión con tus datos.",
      icon: "success",
      customClass: {
        popup: "swal-popup-custom",
        confirmButton: "btn-swal-confirm",
      },
    });

    setModo("login");
    reset({
      email: data.email,
      password: "",
      confirmarPassword: "",
      nombre: "",
    });
  };

  const password = watch("password");

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="login-modal"
      backdrop="static"
    >
      <Modal.Header closeButton className="login-header">
        <Modal.Title>
          {modo === "login" ? "Iniciar Sesión" : "Crear cuenta"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="login-body">
        <Form onSubmit={handleSubmit(onSubmit)} className="form-container">
          {/* Nombre (solo registro) */}
          {modo === "registro" && (
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tu nombre"
                className="form-control login-input"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: {
                    value: 2,
                    message: "Debe tener al menos 2 caracteres",
                  },
                  maxLength: {
                    value: 30,
                    message: "Debe tener como máximo 30 caracteres",
                  },
                })}
              />
              <Form.Text className="text-danger">
                {errors.nombre?.message}
              </Form.Text>
            </Form.Group>
          )}

          {/* Email */}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@email.com"
              className="form-control login-input"
              {...register("email", {
                required: "El correo es un dato obligatorio",
                pattern: {
                  value:
                    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                  message:
                    "Ingrese un correo con formato válido, ej: usuario@mail.com",
                },
              })}
            />
            <Form.Text className="text-danger">
              {errors.email?.message}
            </Form.Text>
          </Form.Group>

          {/* Contraseña */}
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="********"
              className="form-control login-input"
              {...register("password", {
                required: "La contraseña es obligatoria",
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/,
                  message:
                    "Debe tener 8-16 caract., al menos un dígito, una minúscula, una mayúscula y un caracter especial.",
                },
              })}
            />
            <Form.Text className="text-danger">
              {errors.password?.message}
            </Form.Text>
          </Form.Group>

          {/* Confirmar contraseña (solo registro) */}
          {modo === "registro" && (
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repetí la contraseña"
                className="form-control login-input"
                {...register("confirmarPassword", {
                  required: "Debe confirmar la contraseña",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
              />
              <Form.Text className="text-danger">
                {errors.confirmarPassword?.message}
              </Form.Text>
            </Form.Group>
          )}

          <Button type="submit" className="btn-login w-100 btn-login">
            {modo === "login" ? "Ingresar" : "Crear cuenta"}
          </Button>
        </Form>

        {/* Toggle login / registro */}
        <div className="mt-3 text-center">
          {modo === "login" ? (
            <small>
              ¿No tenés cuenta?{" "}
              <button
                type="button"
                className="btn btn-link p-0 m-0 text-decoration-none"
                onClick={() => setModo("registro")}
              >
                <span className="AlgoRitmo">Crear una cuenta</span>
              </button>
            </small>
          ) : (
            <small>
              ¿Ya tenés cuenta?{" "}
              <button
                type="button"
                className="btn btn-link p-0 m-0 text-decoration-none"
                onClick={() => setModo("login")}
              >
                <span className="AlgoRitmo">Iniciar sesión</span>
              </button>
            </small>
          )}
        </div>

        {/* Social login (decorativo) */}
        <div className="login-divider">
          o {modo === "login" ? "ingresá" : "registrate"} con
        </div>

        <div className="login-social">
          <Button type="button" className="btn-google">
            <Google className="me-2" /> Google
          </Button>
          <Button type="button" className="btn-facebook">
            <Facebook className="me-2" /> Facebook
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginPage;
