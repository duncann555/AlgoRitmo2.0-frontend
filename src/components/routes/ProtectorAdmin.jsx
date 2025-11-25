import { Navigate, Outlet } from "react-router-dom";

const ProtectorAdmin = ({ usuarioLogueado }) => {
  if (!usuarioLogueado || !usuarioLogueado.admin) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectorAdmin;
