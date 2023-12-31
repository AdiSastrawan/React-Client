import { Spinner } from "@chakra-ui/react"
import React, { useRef } from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axiosClient from "../axios-client"
import useAuth from "../hooks/useAuth"

async function loginHandler(payload, setLoading, navigate, setErrors) {
  try {
    const response = await axiosClient.post("/reset-password", payload)

    navigate("/verify-reset-password", { state: { email: payload.email } })
  } catch (error) {
    console.log(error)
    setErrors(error.response.data.error)
  } finally {
    setLoading(false)
  }
}

function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuth()
  const [errors, setErrors] = useState()
  const email = useRef()
  const newPassword = useRef()
  const navigate = useNavigate()
  const confirmNewPassword = useRef()
  const submitHandler = (e) => {
    e.preventDefault()
    const payload = {
      email: email.current.value,
      password: newPassword.current.value,
    }
    loginHandler(payload, setLoading, navigate, setErrors)
  }
  if (errors) {
    if (errors?.value == "email") {
      email.current.classList.add("outline-red-600")
      email.current.focus()
    }
    if (errors?.value == "password") {
      newPassword.current.classList.remove("outline-accent")
      newPassword.current.classList.add("outline-red-600")
      newPassword.current.focus()
      confirmNewPassword.current.classList.remove("outline-accent")
      confirmNewPassword.current.classList.add("outline-red-600")
    }
  }
  return (
    <div className="bg-back min-h-screen flex justify-center items-center text-black">
      <div className="lg:w-1/2">
        <h1 className="text-3xl text-white text-center py-4 font-bold">Password Reset</h1>
        <form className="flex flex-col text-white space-y-2" action="" onSubmit={submitHandler}>
          <div className={`w-full bg-red-700 px-2 py-2 rounded-md ${!errors && "hidden"}`}>
            <p className="text-xs text-white">{errors?.message}</p>
          </div>
          <label htmlFor="email">Email</label>
          <input className="rounded-md px-2 py-1 text-black" type="text" ref={email} name="email" placeholder="Email" />
          <label htmlFor="new_password">New Password</label>
          <input className="rounded-md px-2 py-1 text-black outline-accent" type="password" ref={newPassword} name="new_password" placeholder="Password" />
          <label htmlFor="confirm_password">Confirm Password</label>
          <input className="rounded-md px-2 py-1 text-black outline-accent" type="password" ref={confirmNewPassword} name="confirm_password" placeholder="Password" />

          <button disabled={loading} className="bg-accent rounded-md px-2 py-2">
            {loading ? <Spinner /> : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
