import jwtDecode from "jwt-decode";
import Navlist from "./sub-components/Navlist";
import Navlists from "./sub-components/Navlists";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../Spinner";

const sendLogout = async (axiosClient, setAuth, setLoading, setIsMenu) => {
  try {
    await axiosClient.delete("/logout");
    setAuth(undefined);
    setIsMenu(false);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export default function Navbar() {
  const [isMenu, setIsMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();
  const axiosClient = useAxiosPrivate();
  const menuHandler = () => {
    setIsMenu((prev) => {
      return !prev;
    });
  };
  const logoutHandler = () => {
    setLoading(true);
    sendLogout(axiosClient, setAuth, setLoading, setIsMenu);
  };
  return (
    <div className="w-full z-[99999] text-white justify-between items-center flex py-3 px-10 fixed bg-primary">
      {isMenu && (
        <div
          onClick={() => {
            setIsMenu(false);
          }}
          className="fixed top-0 bottom-0 z-[100] right-0 left-0 h-screen bg-transparent cursor-pointer"
        ></div>
      )}
      <Link to="/" className="text-tersier decor lg:text-xl font-bold">
        Logo
      </Link>
      <Navlists className="space-x-4 px-5 items-center">
        <Navlist to={"cart"}>Cart</Navlist>
        {auth != undefined ? (
          <div className="relative w-fit">
            <button className={`bg-accent  ${isMenu ? "rounded-t-md border-b" : "rounded-md"}  outline-1 px-2 py-1`} onClick={menuHandler}>
              {jwtDecode(auth).name}
            </button>
            <div>
              <button
                disabled={loading}
                onClick={logoutHandler}
                className={`${isMenu ? "translate-y-0 opacity-100 z-[200] cursor-pointer" : "-translate-y-5 opacity-0 -z-40"} text-center bg-accent  w-full px-2 py-1 transition-all absolute    rounded-b-md`}
              >
                {loading && <Spinner h={6} w={6} />} <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <Navlist to="login">Login</Navlist>
        )}
      </Navlists>
    </div>
  );
}
