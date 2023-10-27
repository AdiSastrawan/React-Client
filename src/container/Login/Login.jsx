import { useContext, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../../context/authContext"
import useAuth from "../../hooks/useAuth"
import axiosClient from "../../axios-client"
import Spinner from "../../components/Spinner"

async function loginHandler(payload, setAuth, setLoading, navigate) {
  try {
    const response = await axiosClient.post("/login", payload)
    setAuth(response.data.accessToken)
    document.body.className = ""
    navigate("/")
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}

export default function Login() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const userRef = useRef()
  const passRef = useRef()
  const [loading, setLoading] = useState(false)

  document.body.className = "overflow-hidden"
  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      username: userRef.current.value,
      password: passRef.current.value,
    }
    loginHandler(payload, setAuth, setLoading, navigate)
  }

  return ReactDOM.createPortal(
    <>
      <Link
        to="/"
        onClick={() => {
          document.body.className = ""
        }}
        className="fixed bg-primary/40 left-0 top-0 bottom-0 right-0 "
      ></Link>
      <div className="z-50 w-fit   fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2   text-white">
        <div className="max-h-[520px] pb-20 px-10 my-5 bg-primary rounded-md flex items-center flex-col overflow-y-auto overflow-x-hidden">
          <h2 className="text-white text-2xl py-10 font-bold">Login</h2>
          <form action="" className="flex flex-col space-y-2" onSubmit={submitHandler}>
            <label htmlFor="">Username or email</label>
            <input type="text" ref={userRef} className="text-primary px-2 py-1 rounded-md outline-none" />
            <label htmlFor="">Password</label>
            <input type="password" ref={passRef} className="text-primary px-2 py-1 rounded-md outline-none" />
            <button type="submit" className="px-2 py-1 bg-accent rounded-md">
              {loading ? <Spinner /> : "Login"}
            </button>
          </form>
          <div className="w-full px-2 pt-2">
            <Link to={"/reset-password"} className="text-xs text-left hover:text-accent transition-all">
              Forgot Password?
            </Link>
          </div>
          <div className="w-full h-[1px] my-4 bg-white/90"></div>
          <div>
            <p className="text-base">
              {"Don't have any account? "}
              <span>
                <Link
                  to="/register"
                  onClick={() => {
                    document.body.className = ""
                  }}
                  className="text-accent hover:text-violet-950 transition-colors underline"
                >
                  Register here
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  )
}
