import { Navigate, Outlet } from "react-router";

const ProtectorAdmin = ({ usuarioLogueado }) => {
  if (!usuarioLogueado || !usuarioLogueado.admin) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectorAdmin;
