import { useEffect, useRef, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import axiosClient from "../axios-client"
import useAuth from "../hooks/useAuth"
import { Spinner } from "@chakra-ui/react"

const sendRegister = async (navigate, payload, setLoading) => {
  try {
    await axiosClient.post("/register", payload)
    navigate("/verify-account", { state: { email: payload.email } })
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
  const [error, setErrors] = useState({ error: { username: { message: [] }, email: { message: [] }, password: { message: [] }, confirm_password: { message: [] } } })
  const submitHandler = (e) => {
    e.preventDefault()
    setErrors({ error: { username: { message: [] }, email: { message: [] }, password: { message: [] }, confirm_password: { message: [] } } })
    if (username.current.value.length < 5 || username.current.value.length > 20) {
      setErrors((prev) => {
        let tmp = { ...prev }
        tmp.error.username.message.push("Username length must be between 5 to 20 letter")
        return tmp
      })
    }
    if (password.current.value.length < 8 || username.current.value.length > 40) {
      setErrors((prev) => {
        let tmp = { ...prev }
        tmp.error.password.message.push("Password length must be between 8 to 40 letter")
        return tmp
      })
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!emailPattern.test(email.current.value)) {
      setErrors((prev) => {
        let tmp = { ...prev }
        tmp.error.email.message.push("Email is invalid")
        return tmp
      })
    }
    if (password.current.value !== confirm_password.current.value) {
      setErrors((prev) => {
        let tmp = { ...prev }
        tmp.error.confirm_password.message.push("Confirm password must be the same as  password")
        return tmp
      })
    }
    if (error.error.username?.message.length > 0 || error.error.password?.message.length > 0 || error.error.email?.message.length > 0 || error.error.confirm_password?.message.length > 0) {
      console.log("error")
      return 0
    }

    setLoading(true)
    let payload = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
      confirm_password: confirm_password.current.value,
    }
    sendRegister(navigate, payload, setLoading)
    // console.log(auth);
    // console.log("submitted");
    // navigate("/");
  }

  if (auth) {
    return <Navigate to={"/"} />
  }
  return (
    <div className="bg-back min-h-screen flex justify-center items-center text-black">
      <div className="lg:w-1/2 min-w-[50vw] px-10 pb-20 mx-2 bg-primary rounded-md p-4 sm:p-6">
        <h1 className="text-3xl text-white text-center py-4 font-bold">Register</h1>
        <form className="flex flex-col text-white space-y-1" action="" onSubmit={submitHandler}>
          <label htmlFor="username">Username</label>
          <input className="rounded-md px-2 py-1 text-black focus:outline-accent" type="text" ref={username} name="username" placeholder="Username" />
          {error?.error?.username?.message.map((e, i) => {
            return (
              <p key={i} className="text-red-600 text-xs">
                {e}
              </p>
            )
          })}
          <label htmlFor="email">Email</label>
          <input className="rounded-md px-2 py-1 text-black focus:outline-accent" type="text" ref={email} name="email" placeholder="Email" />
          {error?.error?.email?.message.map((e, i) => {
            return (
              <p key={i} className="text-red-600 text-xs">
                {e}
              </p>
            )
          })}
          <label htmlFor="password">Password</label>
          <input className="rounded-md px-2 py-1 text-black focus:outline-accent" type="password" ref={password} name="password" placeholder="Password" />
          {error?.error?.password?.message.map((e, i) => {
            return (
              <p key={i} className="text-red-600 text-xs">
                {e}
              </p>
            )
          })}
          <label htmlFor="confirm_password">Confirm Password</label>
          <input className="rounded-md px-2 py-1 text-black focus:outline-accent" type="password" ref={confirm_password} name="confirm_password" placeholder="Confirm Password" />
          {error?.error?.confirm_password?.message.map((e, i) => {
            return (
              <p key={i} className="text-red-600 text-xs">
                {e}
              </p>
            )
          })}
          <button disabled={loading} className="bg-accent rounded-md px-2 py-2">
            {loading ? <Spinner /> : "Register"}
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
