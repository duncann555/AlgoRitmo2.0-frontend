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
  // 1. ESTADO INICIAL: Verificación del token directa y limpia
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const datos = jwtDecode(token);
      //console.log("🔍 Datos del Token:", datos);
      const ahora = Date.now() / 1000;
      // Si expiró devuelve null, si no, los datos
      return datos.exp < ahora ? null : datos;
    } catch {
      return null;
    }
  });

  // 2. EFECTO: Sincroniza cambios de usuario (Logout/Login)
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
