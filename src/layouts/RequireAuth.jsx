import { Navigate, Outlet, useOutletContext } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function RequireAuth() {
  const { auth } = useAuth()
  const [setTrigger] = useOutletContext()
  return auth ? <Outlet context={[setTrigger]} /> : <Navigate to="/" />
}

export default RequireAuth
