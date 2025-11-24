import { Navigate, Outlet } from "react-router";

const ProtectorAdmin = ({ usuarioLogueado }) => {
  // Admin = objeto con {admin:true} o lo que uses
  if (!usuarioLogueado || !usuarioLogueado.admin) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectorAdmin;
