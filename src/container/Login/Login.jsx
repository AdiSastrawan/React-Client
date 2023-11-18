import { useContext, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Link, Navigate, useNavigate } from "react-router-dom"
import AuthContext from "../../context/authContext"
import useAuth from "../../hooks/useAuth"
import axiosClient from "../../axios-client"
import Spinner from "../../components/Spinner"

async function loginHandler(payload, setAuth, setLoading, navigate, setErrors) {
  try {
    const response = await axiosClient.post("/login", payload)
    setAuth(response.data.accessToken)
    navigate("/")
  } catch (error) {
    console.log(error)
    setErrors(error.response.data.error)
  } finally {
    setLoading(false)
  }
}

export default function Login() {
  const { setAuth, auth } = useAuth()
  const navigate = useNavigate()
  const [errors, setErrors] = useState()
  const userRef = useRef()
  const passRef = useRef()
  const [loading, setLoading] = useState(false)

  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      username: userRef.current.value,
      password: passRef.current.value,
    }
    loginHandler(payload, setAuth, setLoading, navigate, setErrors)
  }
  if (auth) {
    return <Navigate to={"/"} />
  }
  return (
    <div className="bg-back  min-h-screen flex justify-center items-center ">
      <div className="min-w-[50vw] mx-2 sm:mx-0   text-white">
        <div className="max-h-[520px] pb-20 px-10 my-5 bg-primary rounded-md flex items-center flex-col overflow-y-auto overflow-x-hidden">
          <h2 className="text-white text-2xl py-10 font-bold">Login</h2>
          <form action="" className="flex flex-col space-y-2 w-full" onSubmit={submitHandler}>
            <div className={`w-full bg-red-700 px-2 py-2 rounded-md ${!errors && "hidden"}`}>
              <p className="text-xs text-white">{errors?.message}</p>
            </div>
            <label htmlFor="">Username or email</label>
            <input type="text" ref={userRef} className="text-primary px-2 py-1 rounded-md outline-none" />
            <label htmlFor="">Password</label>
            <input type="password" ref={passRef} className="text-primary px-2 py-1 rounded-md outline-none" />
            <button disabled={loading} type="submit" className="px-2 py-1 bg-accent rounded-md">
              {loading ? <Spinner /> : "Login"}
            </button>
          </form>
          <div className="w-full sm:px-2 pt-2 flex justify-between">
            <Link to={"/reset-password"} className="text-xs text-left hover:text-accent transition-all">
              Forgot Password?
            </Link>
            <div>
              <p className="text-xs text-end">
                {"Don't have any account? "}
                <span>
                  <Link to="/register" className="text-accent hover:text-violet-950 transition-colors underline">
                    Register here
                  </Link>
                </span>
              </p>
            </div>
          </div>
          <div className="w-full h-[1px] my-4 bg-white/90"></div>
        </div>
      </div>
    </div>
  )
}
