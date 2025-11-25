import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

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
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    try {
      const user = sessionStorage.getItem("usuarioKey");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (usuarioLogueado) {
      sessionStorage.setItem("usuarioKey", JSON.stringify(usuarioLogueado));
    } else {
      sessionStorage.removeItem("usuarioKey");
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
            <Route path="/" element={<Home />} />
            <Route path="/detalles/:id" element={<Detalle />} />
            <Route path="/playlist" element={<MiPlaylist />} />
            <Route path="/about" element={<Nosotros />} />

            <Route
              path="/login"
              element={<Login setUsuarioLogueado={setUsuarioLogueado} />}
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={<ProtectorAdmin usuarioLogueado={usuarioLogueado} />}
            >
              <Route index element={<Administrador />} />
              <Route path="formulario" element={<FormularioAdmin />} />
            </Route>

            <Route path="*" element={<Error404 />} />
          </Routes>
        </Container>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
