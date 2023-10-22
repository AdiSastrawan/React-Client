import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axiosClient from "../axios-client"
import useAuth from "../hooks/useAuth"

const sendRegister = async (navigate, payload, setAuth, setLoading) => {
  try {
    const response = await axiosClient.post("/register", payload)
    setAuth(response.data.accessToken)
    navigate("/verify-account")
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}

export default function Register() {
  const { auth, setAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const confirm_password = useRef()
  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    let payload = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
      confirm_password: confirm_password.current.value,
    }
    sendRegister(navigate, payload, setAuth, setLoading)
    // console.log(auth);
    // console.log("submitted");
    // navigate("/");
  }

  return (
    <div className="bg-back min-h-screen flex justify-center items-center text-black">
      <div className="lg:w-1/2">
        <h1 className="text-3xl text-white text-center py-4 font-bold">Register</h1>
        <form className="flex flex-col text-white space-y-2" action="" onSubmit={submitHandler}>
          <label htmlFor="username">Username</label>
          <input className="rounded-md px-2 py-1 text-black" type="text" ref={username} name="username" placeholder="Username" />
          <label htmlFor="email">Email</label>
          <input className="rounded-md px-2 py-1 text-black" type="text" ref={email} name="email" placeholder="Email" />
          <label htmlFor="password">Password</label>
          <input className="rounded-md px-2 py-1 text-black" type="password" ref={password} name="password" placeholder="Password" />
          <label htmlFor="confirm_password">Confirm Password</label>
          <input className="rounded-md px-2 py-1 text-black" type="password" ref={confirm_password} name="confirm_password" placeholder="Confirm Password" />
          <button disabled={loading} className="bg-accent rounded-md px-2 py-2">
            {loading ? "..." : "Register"}
          </button>
        </form>
        <div className="w-full h-[1px] bg-white/80 my-4"></div>
        <p className="text-center text-white">
          {" "}
          Already have an account?{" "}
          <span>
            <Link to="/login" className="text-accent underline transition-colors hover:text-purple-900 ">
              Login Here
            </Link>
          </span>
        </p>
      </div>
    </div>
  )
}
