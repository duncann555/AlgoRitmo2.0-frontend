import { Navigate, Outlet } from "react-router-dom";

const ProtectorAdmin = ({ usuarioLogueado }) => {
  const rol =
    usuarioLogueado?.rol || usuarioLogueado?.usuario?.rol || null;

  if (!usuarioLogueado || rol !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectorAdmin;
