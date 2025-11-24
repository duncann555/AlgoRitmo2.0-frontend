import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Google, Facebook } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/login.css";

const BASE_USERS = "http://localhost:3000/api/usuarios";

const LoginPage = ({ setUsuarioLogueado }) => {
  const [show, setShow] = useState(true);
  const [modo, setModo] = useState("login");
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
    navigate("/");
  };

  const onSubmit = (formData) => {
    if (modo === "login") manejarLogin(formData);
    else manejarRegistro(formData);
  };

  const manejarLogin = async (data) => {
    const emailAdmin = import.meta.env.VITE_API_EMAIL;
    const passAdmin = import.meta.env.VITE_API_PASSWORD;

    // ADMIN igual que antes
    if (data.email === emailAdmin && data.password === passAdmin) {
      setUsuarioLogueado({ admin: true, email: data.email });
      Swal.fire("Admin OK", "Bienvenido al panel", "success");
      navigate("/admin");
      return;
    }

    // USUARIO NORMAL backend
    try {
      const r = await fetch(`${BASE_USERS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const res = await r.json();

      if (!r.ok) {
        Swal.fire("Error", res.mensaje, "error");
        return;
      }

      setUsuarioLogueado(res.usuario);
      Swal.fire("Login OK", `Hola ${res.usuario.email}`, "success");
      navigate("/");

    } catch (e) {
      Swal.fire("Error", e.message, "error");
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
        }),
      });
      const res = await r.json();

      if (!r.ok) {
        Swal.fire("Error", res.mensaje, "error");
        return;
      }

      Swal.fire("Cuenta creada", "Ya podés iniciar sesión", "success");
      setModo("login");
      reset({ email: data.email, password: "" });

    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  const password = watch("password");

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" className="login-modal">
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
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
              <Form.Text className="text-danger">{errors.nombre?.message}</Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              {...register("email", { required: "El correo es obligatorio" })}
            />
            <Form.Text className="text-danger">{errors.email?.message}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              {...register("password", { required: "La contraseña es obligatoria" })}
            />
            <Form.Text className="text-danger">{errors.password?.message}</Form.Text>
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
              <button className="btn btn-link p-0" onClick={() => setModo("registro")}>
                <span className="AlgoRitmo">Crear una cuenta</span>
              </button>
            </small>
          ) : (
            <small>
              ¿Ya tenés cuenta?{" "}
              <button className="btn btn-link p-0" onClick={() => setModo("login")}>
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
