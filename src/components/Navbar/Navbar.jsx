import jwtDecode from "jwt-decode"
import Navlist from "./sub-components/Navlist"
import Navlists from "./sub-components/Navlists"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import Spinner from "../Spinner"
import { ButtonSpinner } from "@chakra-ui/react"

const sendLogout = async (axiosClient, setAuth, setLoading, setIsMenu) => {
  try {
    await axiosClient.delete("/logout")
    setAuth(undefined)
    setIsMenu(false)
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}

export default function Navbar({ countCart = 0 }) {
  const [isMenu, setIsMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const { auth, setAuth } = useAuth()

  const axiosClient = useAxiosPrivate()
  const menuHandler = () => {
    setIsMenu((prev) => {
      return !prev
    })
  }

  const logoutHandler = () => {
    setLoading(true)
    sendLogout(axiosClient, setAuth, setLoading, setIsMenu)
  }
  return (
    <div className="w-full z-[99999] text-white justify-between items-center flex py-3 px-10 fixed bg-primary">
      {isMenu && (
        <div
          onClick={() => {
            setIsMenu(false)
          }}
          className="fixed top-0 bottom-0 z-[100] right-0 left-0 h-screen bg-transparent cursor-pointer"
        ></div>
      )}
      <Link to="/" className="text-tersier decor lg:text-xl font-bold">
        Logo
      </Link>
      <Navlists className="space-x-4 px-5 items-center">
        <Navlist className="relative" to={"cart"}>
          Cart<span className={`text-xs bg-accent text-white absolute -top-2 -right-3 rounded-full w-4 h-4 flex justify-center ${!auth && "hidden"}`}>{countCart}</span>
        </Navlist>
        {auth != undefined ? (
          <div className="relative min-w-[8rem]">
            <button className={`bg-accent w-full  ${isMenu ? "rounded-t-md border-b" : "rounded-md"}  outline-1 px-2 py-1`} onClick={menuHandler}>
              {jwtDecode(auth).name}
            </button>
            <div>
              <button
                disabled={loading}
                onClick={logoutHandler}
                className={`${isMenu ? "translate-y-0 opacity-100 z-[200] cursor-pointer" : "-translate-y-5 opacity-0 -z-40"} text-center bg-accent  w-full px-2 py-1 transition-all absolute    rounded-b-md`}
              >
                {loading ? <Spinner /> : <span>Logout</span>}
              </button>
            </div>
          </div>
        ) : (
          <Navlist to="login">Login</Navlist>
        )}
      </Navlists>
    </div>
  )
}
