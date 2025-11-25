import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Google, Facebook } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/login.css";

const BASE_USERS = import.meta.env.VITE_API_USUARIOS

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

  const passwordGuardado = watch("password");

  const handleClose = () => {
    setShow(false);
    navigate("/");
  };

  const toggleModo = () => {
    setModo(modo === "login" ? "registro" : "login");
    reset();
  };

  const onSubmit = (formData) => {
    if (modo === "login") manejarLogin(formData);
    else manejarRegistro(formData);
  };

  const manejarLogin = async (data) => {
    const emailAdmin = import.meta.env.VITE_API_EMAIL;
    const passAdmin = import.meta.env.VITE_API_PASSWORD;

    if (data.email === emailAdmin && data.password === passAdmin) {
      setUsuarioLogueado({ admin: true, email: data.email, rol: 'admin' });
      Swal.fire("Admin OK", "Bienvenido al panel", "success");
      navigate("/admin");
      return;
    }

    try {
      const r = await fetch(`${BASE_USERS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const res = await r.json();

      if (!r.ok) {
        Swal.fire("Error", res.mensaje || "Error en login", "error");
        return;
      }

      setUsuarioLogueado(res);
      
      if(res.token) localStorage.setItem("token", res.token);

      Swal.fire("Login OK", `Hola ${res.nombre || res.email}`, "success");
      handleClose();
    } catch (e) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
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
        Swal.fire("Error", res.mensaje || "Error al registrar", "error");
        return;
      }

      Swal.fire("Cuenta creada", "Ya podés iniciar sesión", "success");
      setModo("login");
      reset();
    } catch (e) {
      Swal.fire("Error", "No se pudo registrar el usuario", "error");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton className="border-0 bg-dark text-white">
        <Modal.Title>{modo === "login" ? "Iniciar Sesión" : "Registrarse"}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        <div className="d-flex justify-content-center gap-3 mb-4">
            <Button variant="outline-light" className="w-50">
                <Google className="me-2"/> Google
            </Button>
            <Button variant="outline-primary" className="w-50">
                <Facebook className="me-2"/> Facebook
            </Button>
        </div>

        <div className="text-center mb-3 text-muted">o ingresá con tu email</div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          {modo === "registro" && (
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Seba"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  maxLength: { value: 30, message: "Máximo 30 caracteres" },
                })}
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="nombre@ejemplo.com"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  message: "Ingresá un correo válido",
                },
              })}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="*******"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                maxLength: { value: 20, message: "Máximo 20 caracteres" },
              })}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {modo === "registro" && (
            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="*******"
                {...register("confirmarPassword", {
                  required: "Confirmá la contraseña",
                  validate: (value) => value === passwordGuardado || "Las contraseñas no coinciden",
                })}
                isInvalid={!!errors.confirmarPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmarPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          <Button type="submit" className="btn-gradient w-100 mt-3">
            {modo === "login" ? "Ingresar" : "Crear cuenta"}
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer className="bg-dark border-0 justify-content-center">
        <Button variant="link" className="text-decoration-none text-light" onClick={toggleModo}>
          {modo === "login" 
            ? "¿No tenés cuenta? Registrate" 
            : "¿Ya tenés cuenta? Iniciá sesión"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginPage;