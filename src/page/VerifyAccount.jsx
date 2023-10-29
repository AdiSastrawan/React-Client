import { useCallback, useEffect, useRef, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import jwtDecode from "jwt-decode"
import { ButtonSpinner, Spinner } from "@chakra-ui/react"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const sendVerify = async (axiosClient, navigate, payload, setLoading, setAuth) => {
  try {
    const response = await axiosClient.post("/verifyOTP", payload)
    setAuth(response.data.accessToken)
    navigate("/")
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}
const resendOTP = async (axiosClient) => {
  try {
    const response = await axiosClient.post("/resendOTP")
  } catch (error) {
    console.error(error)
  }
}
export default function VerifyAccount() {
  const { auth, setAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const navigate = useNavigate()
  const firstRef = useRef()
  const secondRef = useRef()
  const thirdRef = useRef()
  const fourthRef = useRef()
  const axiosClient = useAxiosPrivate()
  const changeInputHandler = (e, nextRef) => {
    nextRef.current.focus()
  }
  console.log(auth)
  const pasteHandler = (e) => {
    const pastedText = e.clipboardData.getData("text")
    firstRef.current.value = pastedText[0]
    secondRef.current.value = pastedText[1]
    thirdRef.current.value = pastedText[2]
    fourthRef.current.value = pastedText[3]
  }
  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    console.log(e.target)
    const arr = e.target.getElementsByTagName("input")
    let input = []
    for (let i = 0; i < arr.length; i++) {
      input.push(arr[i].value)
    }
    sendVerify(axiosClient, navigate, { otp: input.join("").toString() }, setLoading, setAuth)
    // console.log("submitted");
    // navigate("/");
  }
  const resendHandler = useCallback(() => {
    resendOTP(axiosClient)
    setLoading(false)
    setTimer(60)
  }, [])
  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevSeconds) => prevSeconds - 1)
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [timer, resendHandler])
  const minutes = Math.floor(timer / 60)
  const remainingSeconds = timer % 60
  if (jwtDecode(auth)?.verified == true) {
    return <Navigate to={"/"} />
  }
  return (
    <div onPaste={pasteHandler} className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-back py-12">
      <div className="relative bg-primary px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl text-white/90">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              {" "}
              <p>We have sent a code to your email {auth && jwtDecode(auth)?.email}</p>{" "}
            </div>
          </div>

          <div>
            <form onSubmit={submitHandler} action="" method="post">
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  <div className="w-16 h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      maxLength={1}
                      name=""
                      id=""
                      ref={firstRef}
                      onChange={(e) => {
                        changeInputHandler(e, secondRef)
                      }}
                    />
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      maxLength={1}
                      ref={secondRef}
                      onChange={(e) => {
                        changeInputHandler(e, thirdRef)
                      }}
                    />
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      maxLength={1}
                      ref={thirdRef}
                      onChange={(e) => {
                        changeInputHandler(e, fourthRef)
                      }}
                    />
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      maxLength={1}
                      ref={fourthRef}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-accent border-none text-white text-sm shadow-sm">
                      {loading ? <ButtonSpinner /> : "Verify Account"}
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't recieve code?</p>{" "}
                    <button disabled={timer > 0} onClick={resendHandler} className={`flex flex-row items-center ${timer > 0 ? "text-secondary" : "text-blue-600"}`}>
                      Resend
                    </button>
                    <span className={`${timer == 0 && "hidden"}`}>
                      {" "}
                      {minutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
