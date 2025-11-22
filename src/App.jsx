import { Card, Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/shared/Menu";
import Footer from "./components/shared/Footer";
import Detalle from "./components/pages/Detalle";
import CardCanciones from "./components/pages/Home";
import Administrador from "./components/pages/Administrador";
import Nosotros from "./components/pages/Nosotros";
import Login from "./components/pages/Login";
import Error404 from "./components/shared/Error404";
import FormularioAdmin from "./components/pages/FormularioAdmin";
import { useEffect, useState } from "react";
import ProtectorAdmin from "./components/routes/ProtectorAdmin";
import MiPlaylist from "./components/pages/MiPlaylist";


export default function AppLayout() {
  const sesionUsuario =
    JSON.parse(sessionStorage.getItem("usuarioKey")) || false;
  const [usuarioLogueado, setUsuarioLogueado] = useState(sesionUsuario);

  useEffect(() => {
    sessionStorage.setItem("usuarioKey", JSON.stringify(usuarioLogueado));
  }, [usuarioLogueado]);

  return (
    <>
      <BrowserRouter>
        <Menu
          usuarioLogueado={usuarioLogueado}
          setUsuarioLogueado={setUsuarioLogueado}
        />
        <main className="mb-4">
          <Container>
            <Routes>
              <Route path="/" element={<CardCanciones />} />
              <Route path="/detalles/:id" element={<Detalle />} />
              <Route
                path="/login"
                element={<Login setUsuarioLogueado={setUsuarioLogueado} />}
              />
              <Route
                ute
                path="/admin"
                element={
                  <ProtectorAdmin
                    usuarioLogueado={usuarioLogueado}
                  ></ProtectorAdmin>
                }
              >
                <Route index element={<Administrador />} />
                <Route path="formulario" element={<FormularioAdmin />} />
              </Route>
              <Route path="/playlist" element={<MiPlaylist />} />


              <Route path="/about" element={<Nosotros />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}
