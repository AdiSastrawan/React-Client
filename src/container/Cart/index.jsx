import { useEffect, useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import Spinner from "../../components/Spinner"

import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import rupiahFormater from "../../formater/rupiahFormater"
import CartItem from "../../features/CartItem"
import { ChevronLeftIcon } from "@chakra-ui/icons"
const selectAllCart = async (axiosClient, payload) => {
  try {
    await axiosClient.put(`/carts/select/all`, payload)
    console.log("yosha")
  } catch (error) {
    console.log(error)
  }
}
const getCart = async (setData, setLoading, axiosClient) => {
  try {
    const response = await axiosClient.get("/carts")
    console.log(response.data)
    setData(() => {
      const temp = response.data.map((item) => {
        const product_stock = item.product.stock.filter((st) => {
          return st.size_id == item.size._id
        })[0]
        return { ...item, stock: product_stock.quantity }
      })
      return temp
    })
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}

function Cart() {
  const axiosClient = useAxiosPrivate()
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [total, setTotal] = useState({
    quantities: 0,
    prices: 0,
  })
  const [checkAll, setCheckAll] = useState(false)
  const { auth } = useAuth()
  const [loading, setLoading] = useState(auth ? true : false)
  useEffect(() => {
    if (auth) {
      console.log("fetch", auth)
      getCart(setData, setLoading, axiosClient)
    }
  }, [loading])
  const checkoutHandler = () => {
    navigate("/checkout")
    // setIsCheckout(true);
    // let payload = {
    //   products: array.map((arr) => {
    //     return {
    //       id: arr._id,
    //       product_id: arr.product._id,
    //       name: arr.product.name,
    //       quantity: arr.quantity,
    //       price: arr.product.price,
    //       size: arr.size.name,
    //     };
    //   }),
    // };
    // let parsedPayload = JSON.stringify(payload);
    // sentCheckout(axiosClient, parsedPayload, navigate, setIsCheckout);
  }
  return (
    <div>
      <ul className="text-white w-full relative ">
        <button
          onClick={() => {
            navigate("/")
          }}
          className="absolute top-20 text-2xl sm:text-3xl font-black bg-accent rounded-md px-4 items-center flex justify-center py-1 left-3 sm:left-14"
        >
          <ChevronLeftIcon />
        </button>
        {loading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className=" flex flex-col sm:flex-row">
            <div className=" sm:w-3/5 max-w-fit ">
              {auth == undefined ? (
                <h1 className="text-2xl mx-32 text-center my-48">
                  {" "}
                  You must be logged in first to add something to your cart.{" "}
                  <Link className="underline text-accent" to="/login">
                    Click here to login
                  </Link>{" "}
                </h1>
              ) : (
                <div className="bg-back mx-2 sm:mx-32 mt-32  sm:my-28">
                  <h1 className="font-bold text-3xl">Cart</h1>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="">Select all</label>
                    <input
                      type="checkbox"
                      onClick={() => {
                        selectAllCart(axiosClient, { isSelected: true })
                        setCheckAll((prev) => {
                          return !prev
                        })
                      }}
                      checked={checkAll}
                      className=""
                    />
                  </div>
                  <section className="flex flex-col my-5 gap-4 z-0">
                    {data.length < 1 && <h1 className="text-2xl mx-32 font-bold text-center my-48">Cart is Empty</h1>}
                    {data.map((item, i) => {
                      return <CartItem item={item} i={i} key={i} setTotal={setTotal} setCheckAll={setCheckAll} checkAll={checkAll} setData={setData} data={data} setLoading={setLoading} />
                    })}
                  </section>
                </div>
              )}
            </div>
            <div className=" sm:w-2/5 h-screen ">
              <div className={" sm:mr-32 my-32 sm:w-[360px] sm:fixed bg-primary rounded-md px-4 py-4"}>
                <h1 className="text-2xl pb-4 font-bold">Total Purchases</h1>
                <div className="flex">
                  <h2>Total Price ({total.quantities} items) :</h2>
                  <h2>{rupiahFormater(total.prices)}</h2>
                </div>
                <div className="border-t my-4  border-white ">
                  <h2 className="text-2xl pt-4 font-semibold">Total Price : {rupiahFormater(total.prices)}</h2>
                </div>
                <button
                  disabled={total?.prices <= 0}
                  className={`${total?.prices <= 0 ? "bg-gray-500" : "bg-accent hover:bg-violet-800"} cursor-pointer rounded-md font-semibold py-3 w-full text-xl  transition-all`}
                  onClick={checkoutHandler}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </ul>
    </div>
  )
}

export default Cart
