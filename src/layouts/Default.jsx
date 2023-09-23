import { Outlet } from "react-router-dom";
import MainContent from "../components/Main/MainContent";
import Navbar from "../components/Navbar/Navbar";
import useAuth from "../hooks/useAuth";

export default function Default() {
  const { auth } = useAuth();
  console.log(auth);
  return (
    <div className="bg-back overflow-y-hidden overflow-hidden">
      <Navbar />
      <MainContent />
      <Outlet />
    </div>
  );
}
