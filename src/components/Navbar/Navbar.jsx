import jwtDecode from "jwt-decode"
import Navlist from "./sub-components/Navlist"
import Navlists from "./sub-components/Navlists"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import Spinner from "../Spinner"
import { HamburgerIcon } from "@chakra-ui/icons"
import { Button, GenericAvatarIcon, Input, useDisclosure } from "@chakra-ui/react"
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react"
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
  const { isOpen, onClose, onOpen } = useDisclosure()
  const btnRef = useRef()
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
    <>
      <div className="w-full z-[99999] hidden  text-white justify-between items-center sm:flex py-3 px-10 fixed bg-primary">
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
      <div className="w-full z-[99] sm:hidden py-3  bg-primary  fixed">
        <div className={`flex  w-full ${auth ? "justify-between" : "justify-end"} items-center text-white px-5 relative`}>
          <button ref={btnRef} className={`${!auth && "hidden"}`} onClick={onOpen}>
            <HamburgerIcon boxSize="2rem" />
          </button>
          <h2 className="text-2xl font-bold text-center absolute -translate-x-8 left-1/2 w-fit">Logo</h2>
          {auth ? (
            <GenericAvatarIcon boxSize={9} />
          ) : (
            <Link className="text-xl font-medium bg-accent rounded-md px-2 py-1" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
      <div className={`sm:hidden ${!auth && "hidden"}`}>
        <Drawer isOpen={isOpen} placement="top" onClose={onClose} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent>
            <div className="bg-primary w-full h-full flex flex-col text-white">
              <div className="text-2xl p-2 text-center  text-white font-bold ">Logo</div>
              <ul>
                {!auth ? (
                  <li className="py-2 text-lg border-y text-center border-white mx-2">
                    <Link to="/login">Login</Link>
                  </li>
                ) : (
                  <>
                    <li className="py-2 text-lg border-b border-white mx-2 font-medium text-center">{jwtDecode(auth).name}</li>
                    <li className="py-2 text-lg border-b border-white mx-2 font-medium text-center">
                      <Link to={"/cart"} className="relative">
                        Cart<span className={`text-xs bg-accent text-white absolute -top-2 -right-3 rounded-full w-4 h-4 flex justify-center ${!auth && "hidden"}`}>{countCart}</span>
                      </Link>
                    </li>
                    <li className="py-2 text-lg text-center  mx-2">
                      {" "}
                      <button
                        disabled={loading}
                        onClick={() => {
                          onClose()
                          logoutHandler()
                        }}
                        className={`  text-lg font-bold px-2 py-1  text-white rounded-md`}
                      >
                        {loading ? <Spinner /> : <span>Logout</span>}
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}
