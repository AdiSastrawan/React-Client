import React, { useEffect, useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import Spinner from "../../components/Spinner"
import rupiahFormater from "../../formater/rupiahFormater"
import { Input, Select } from "@chakra-ui/react"
import axiosClient from "../../axios-client"
import { useNavigate } from "react-router-dom"

const getCheckout = async (axiosClient, setData, setLoading) => {
  try {
    const response = await axiosClient.get("/carts/checkout")
    console.log(response.data)
    setData(response.data)
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}
const sendCheckout = async (axiosClient, payload, setIsClicked, navigate) => {
  try {
    const response = await axiosClient.post(`/transaction`, payload)
    if (response.statuscode == 404) {
      throw new Error(response.data.message)
    }
    navigate("/success")
  } catch (error) {
    console.log(error)
  } finally {
    setIsClicked(false)
  }
}
function Checkout() {
  const axiosClient = useAxiosPrivate()
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [payload, setPayload] = useState({
    country: "",
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    post_code: "",
    phone: "",
  })
  const [isClicked, setIsClicked] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    getCheckout(axiosClient, setData, setLoading)
  }, [])
  const sumQuantity = (data) => {
    let quantities = 0

    data.map((item) => {
      quantities += item.quantity
    })
    return quantities
  }
  const sumPrices = (data) => {
    let prices = 0

    data.map((item) => {
      prices += item.product.price * item.quantity
    })
    return prices
  }
  const changeHandler = (e) => {
    setPayload((prev) => {
      let tmp = { ...prev }
      tmp[e.target.name] = e.target.value
      return tmp
    })
  }
  const payHandler = () => {
    let formdata = {
      information: payload,
      products: data.map((element) => {
        return { id: element._id, name: element.product.name, price: element.product.price, quantity: element.quantity, size: element.size.name, product_id: element.product._id }
      }),
    }
    setIsClicked(true)
    sendCheckout(axiosClient, formdata, setIsClicked, navigate)
  }
  return (
    <div className="min-h-screen pt-16">
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <h1 className="text-white text-2xl font-bold px-20 my-6 ">Checkout</h1>
          <div className="flex px-20 pb-10 text-white gap-2">
            <div className="flex flex-col py-2 rounded-md w-2/3 space-y-3">
              <div className="flex p-2 bg-primary rounded-md space-x-3 flex-col ">
                <h2 className="px-2 font-bold text-xl">Shipment</h2>
                <div className="flex-col flex space-y-1">
                  <label>Country/Region</label>
                  <input value={payload.country} onChange={changeHandler} name="country" type="text" className="px-2 rounded-md text-primary py-2 outline-2 outline-accent" placeholder="Country/Region" />
                  <div className="grid grid-cols-2 gap-2">
                    <label>First Name</label>
                    <label>Last Name</label>
                    <input value={payload.first_name} onChange={changeHandler} type="text" name="first_name" className="px-2 rounded-md py-2 text-primary outline-2 outline-accent" placeholder="First Name" />
                    <input type="text" name="last_name" onChange={changeHandler} value={payload.last_name} className="px-2 rounded-md py-2 text-primary outline-2 outline-accent" placeholder="Last Name" />
                  </div>
                  <label>Address</label>
                  <input type="text" name="address" onChange={changeHandler} value={payload.address} className="px-2 rounded-md py-2 outline-2 text-primary outline-accent" placeholder="Address" />
                  <div className="grid grid-cols-2 gap-2">
                    <label>City</label>
                    <label>Post Code</label>
                    <input type="text" name="city" onChange={changeHandler} value={payload.city} className="px-2 rounded-md py-2 outline-2 text-primary outline-accent" placeholder="City" />
                    <input type="text" name="post_code" onChange={changeHandler} value={payload.post_code} className="px-2 rounded-md py-2 outline-2 text-primary outline-accent" placeholder="Post Code" />
                  </div>
                  <label>Phone</label>
                  <input type="text" name="phone" onChange={changeHandler} value={payload.phone} className="px-2 rounded-md py-2 outline-2 text-primary outline-accent" placeholder="Phone Number" />
                  <label>Shipping method</label>
                  <select className="px-2 text-primary rounded-md py-2 outline-2  outline-accent">
                    <option selected>Idunno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <div className={"mr-10  w-fit fixed  bg-primary rounded-md px-4 py-4"}>
                <h1 className="text-2xl pb-4 font-bold">Total Purchases</h1>
                <div className=" h-[12rem] overflow-y-auto">
                  <div className="overflow-auto">
                    {data.map((item, i) => {
                      return (
                        <div key={i} className="flex py-2 bg-primary rounded-md min-h-[8rem] text-xs space-x-3">
                          <div className="w-1/3 p-2">
                            <img className="object-contain" src={import.meta.env.VITE_BASE_URL + "/" + item.product.image} alt="" />
                          </div>
                          <div className="w-2/3 relative p-1">
                            {" "}
                            <h2 className="line-clamp-2">{item.product.name}</h2>
                            <h2>{rupiahFormater(item.product.price)}</h2>
                            <h2>Size : {item.size.name}</h2>
                            <h2>Quantity : {item.quantity}</h2>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="flex">
                  <h2>Total Price ({sumQuantity(data)} items) :</h2>
                  <h2>{rupiahFormater(sumPrices(data))}</h2>
                </div>
                <div className="border-t my-4  border-white ">
                  <h2 className="text-2xl pt-4 font-semibold">Total Price : {rupiahFormater(sumPrices(data))}</h2>
                </div>
                <button
                  onClick={payHandler}
                  disabled={sumPrices(data) <= 0}
                  className={`${sumPrices(data) <= 0 ? "bg-gray-500" : "bg-accent hover:bg-violet-800"} cursor-pointer rounded-md font-semibold py-3 w-full text-xl  transition-all`}
                >
                  Pay
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Checkout
