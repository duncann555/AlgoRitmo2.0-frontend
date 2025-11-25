// src/components/pages/Login.jsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Google, Facebook } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/login.css";

const BASE_USERS = import.meta.env.VITE_API_USUARIOS;
const ADMIN_EMAIL = import.meta.env.VITE_API_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_API_PASSWORD;

const LoginPage = ({ setUsuarioLogueado }) => {
  const [show, setShow] = useState(true);
  const [modo, setModo] = useState("login"); // "login" | "registro"
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const password = watch("password");

  const handleClose = () => {
    setShow(false);
    navigate("/");
  };

  const onSubmit = (formData) => {
    if (modo === "login") {
      manejarLogin(formData);
    } else {
      manejarRegistro(formData);
    }
  };

  const manejarLogin = async (data) => {
    // ======================
    // 1) ADMIN LOCAL (SIN BACKEND)
    // ======================
    if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
      const userAdmin = {
        id: "admin_panel",
        nombre: "Administrador",
        email: data.email,
        rol: "admin",
        admin: true,
      };

      // Limpio token por las dudas (este admin no usa JWT)
      localStorage.removeItem("token");

      sessionStorage.setItem("usuarioKey", JSON.stringify(userAdmin));
      setUsuarioLogueado(userAdmin);

      Swal.fire("Admin OK", "Bienvenido al panel", "success");
      setShow(false);
      navigate("/admin");
      return;
    }

    // ======================
    // 2) LOGIN NORMAL (CON BACKEND + JWT)
    // ======================
    try {
      const r = await fetch(`${BASE_USERS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const res = await r.json();

      if (!r.ok) {
        Swal.fire("Error", res.mensaje || "Credenciales incorrectas", "error");
        return;
      }

      // Guardamos el token del backend
      if (res.token) {
        localStorage.setItem("token", res.token);
      } else {
        localStorage.removeItem("token");
      }

      const usuario = {
        id: res.uid || res.id,
        nombre: res.nombre,
        email: res.email,
        rol: res.rol,
        admin: res.rol === "admin",
      };

      sessionStorage.setItem("usuarioKey", JSON.stringify(usuario));
      setUsuarioLogueado(usuario);

      Swal.fire("Login OK", `Hola ${res.nombre}`, "success");
      setShow(false);
      navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
      Swal.fire("Error", "No se pudo iniciar sesión", "error");
    }
  };

  const manejarRegistro = async (data) => {
    try {
      const r = await fetch(`${BASE_USERS}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre,
          email: data.email,
          password: data.password,
          confirmarPassword: data.confirmarPassword,
        }),
      });

      const res = await r.json();

      if (!r.ok) {
        Swal.fire("Error", res.mensaje || "Error al registrar", "error");
        return;
      }

      Swal.fire("Cuenta creada", "Ya podés iniciar sesión", "success");

      // Paso a modo login y dejo precargado el mail
      setModo("login");
      reset({ email: data.email, password: "", confirmarPassword: "" });
    } catch (e) {
      console.error("Error en registro:", e);
      Swal.fire("Error", "Ocurrió un error en el registro", "error");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      className="login-modal"
    >
      <Modal.Header closeButton className="login-header">
        <Modal.Title>
          {modo === "login" ? "Iniciar Sesión" : "Crear cuenta"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="login-body">
        <Form onSubmit={handleSubmit(onSubmit)} className="form-container">
          {modo === "registro" && (
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  maxLength: { value: 30, message: "Máximo 30 caracteres" },
                })}
              />
              <Form.Text className="text-danger">
                {errors.nombre?.message}
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  message: "Formato de correo inválido",
                },
              })}
            />
            <Form.Text className="text-danger">
              {errors.email?.message}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                maxLength: { value: 20, message: "Máximo 20 caracteres" },
              })}
            />
            <Form.Text className="text-danger">
              {errors.password?.message}
            </Form.Text>
          </Form.Group>

          {modo === "registro" && (
            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                {...register("confirmarPassword", {
                  required: "Confirmá la contraseña",
                  validate: (v) => v === password || "No coinciden",
                })}
              />
              <Form.Text className="text-danger">
                {errors.confirmarPassword?.message}
              </Form.Text>
            </Form.Group>
          )}

          <Button type="submit" className="btn-login w-100">
            {modo === "login" ? "Ingresar" : "Crear cuenta"}
          </Button>
        </Form>

        <div className="mt-3 text-center">
          {modo === "login" ? (
            <small>
              ¿No tenés cuenta?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => {
                  setModo("registro");
                  reset({
                    nombre: "",
                    email: "",
                    password: "",
                    confirmarPassword: "",
                  });
                }}
              >
                <span className="AlgoRitmo">Crear una cuenta</span>
              </button>
            </small>
          ) : (
            <small>
              ¿Ya tenés cuenta?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => {
                  setModo("login");
                  reset({
                    email: "",
                    password: "",
                    confirmarPassword: "",
                    nombre: "",
                  });
                }}
              >
                <span className="AlgoRitmo">Iniciar sesión</span>
              </button>
            </small>
          )}
        </div>

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
