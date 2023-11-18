import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Transaction() {
  const [timer, setTimer] = useState(5)
  const navigate = useNavigate()
  useEffect(() => {
    const redirected = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    if (timer == 0) {
      navigate("/")
    }
    return () => {
      clearInterval(redirected)
    }
  }, [timer])
  return (
    <div className="bg-back flex justify-center items-center py-32">
      <div className="bg-accent sm:w-1/2 rounded-md">
        <h1 className="font-bold text-xl text-white py-2 px-2 text-center w-full ">Checkout Successfully</h1>
        <div className="bg-primary text-white p-4 text-center space-y-2">
          <p>Invoice has already sent to your email</p>
          <p>
            Redirected in <span className="text-accent">{timer}</span>
          </p>
          <button
            onClick={() => {
              navigate("/")
            }}
            className="bg-accent px-2 rounded-md py-1 "
          >
            {" "}
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Transaction
