import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";

// Componentes
import Menu from "./components/shared/Menu";
import Footer from "./components/shared/Footer";
import Error404 from "./components/shared/Error404";
import ProtectorAdmin from "./components/routes/ProtectorAdmin";

// Páginas
import Home from "./components/pages/Home";
import Detalle from "./components/pages/Detalle";
import Login from "./components/pages/Login";
import Administrador from "./components/pages/Administrador";
import FormularioAdmin from "./components/pages/FormularioAdmin";
import MiPlaylist from "./components/pages/MiPlaylist";
import Nosotros from "./components/pages/Nosotros";

export default function App() {
  // App.jsx

  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
  const token = localStorage.getItem("token");
  const usuarioGuardado = sessionStorage.getItem("usuarioKey");

  if (!token) return null;

  try {
    const datosToken = jwtDecode(token);
    const ahora = Math.floor(Date.now() / 1000);

    if (datosToken.exp < ahora) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("usuarioKey");
      return null;
    }

    // Si ya tengo el usuario en sessionStorage, lo uso.
    if (usuarioGuardado) {
      return JSON.parse(usuarioGuardado);
    }

    // Fallback: saco lo básico del token
    return {
      uid: datosToken.id,
      nombre: datosToken.nombre,
      rol: datosToken.rol,
    };
  } catch {
    localStorage.removeItem("token");
    sessionStorage.removeItem("usuarioKey");
    return null;
  }
});


  useEffect(() => {
    if (!usuarioLogueado) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("usuarioKey");
    } else {
      sessionStorage.setItem("usuarioKey", JSON.stringify(usuarioLogueado));
    }
  }, [usuarioLogueado]);

  return (
    <BrowserRouter>
      <Menu
        usuarioLogueado={usuarioLogueado}
        setUsuarioLogueado={setUsuarioLogueado}
      />

      <main className="mb-4">
        <Container>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/detalles/:id" element={<Detalle />} />
            <Route path="/playlist" element={<MiPlaylist />} />
            <Route path="/about" element={<Nosotros />} />

            <Route
              path="/login"
              element={<Login setUsuarioLogueado={setUsuarioLogueado} />}
            />

            {/* Rutas de Admin (Protegidas) */}
            <Route
              path="/admin"
              element={<ProtectorAdmin usuarioLogueado={usuarioLogueado} />}
            >
              <Route index element={<Administrador />} />
              <Route path="formulario" element={<FormularioAdmin />} />
            </Route>

            {/* Error */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Container>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
