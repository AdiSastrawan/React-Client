import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RequireAuth() {
  const { auth } = useAuth();
  return auth ? <Outlet /> : <Navigate to="/" />;
}

export default RequireAuth;
