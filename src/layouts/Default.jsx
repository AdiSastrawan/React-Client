import { Navigate, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"
import useAuth from "../hooks/useAuth"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useEffect, useState } from "react"
import Footer from "../components/Footer"
import jwtDecode from "jwt-decode"
const getCurrentCart = async (axiosPrivate, setTrigger, setCountCart) => {
  try {
    const response = await axiosPrivate.get("/carts")
    setCountCart(response.data.length)
    setTrigger(false)
  } catch (error) {
    console.log(error)
  }
}
export default function Default() {
  const { auth } = useAuth()
  const axiosClient = useAxiosPrivate()
  const [trigger, setTrigger] = useState(false)
  const [countCart, setCountCart] = useState(0)
  useEffect(() => {
    if (auth) {
      getCurrentCart(axiosClient, setTrigger, setCountCart)
    }
  }, [setTrigger, trigger])
  return auth ? (
    jwtDecode(auth).verified == false ? (
      <Navigate to="/verify-account" state={{ email: jwtDecode(auth).email }} />
    ) : (
      <div className="bg-back min-h-screen">
        <Navbar countCart={countCart} />
        {console.log("test")}
        <Outlet context={[setTrigger]} />
        <Footer />
      </div>
    )
  ) : (
    <div className="bg-back min-h-screen">
      <Navbar countCart={countCart} />
      {console.log("test")}
      <Outlet context={[setTrigger]} />
      <Footer />
    </div>
  )
}
