import { Outlet } from "react-router-dom";
import MainContent from "../components/Main/MainContent";
import Navbar from "../components/Navbar/Navbar";
import useAuth from "../hooks/useAuth";

export default function Default() {
  const { auth } = useAuth();
  console.log(auth);
  return (
    <div className="bg-back min-h-screen">
      <Navbar />

      <Outlet />
    </div>
  );
}
