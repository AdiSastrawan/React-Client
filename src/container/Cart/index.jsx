import React, { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import Card from "../../components/Main/sub-components/ProductContent/sub-components/Card";
import image1 from "../../assets/1.png";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import rupiahFormater from "../../formater/rupiahFormater";
import axiosClient from "../../axios-client";
const getCart = async (setData, setLoading, axiosClient) => {
  try {
    const response = await axiosClient.get("/carts");
    setData(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
const updateCart = async (setTotal, axiosClient, item, payload) => {
  try {
    const response = await axiosClient.put(`/carts/${item._id}`, payload);
  } catch (error) {
    console.log(error);
  }
};
function Cart() {
  const axiosClient = useAxiosPrivate();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [total, setTotal] = useState({
    quantities: 0,
    prices: 0,
  });
  const [checkAll, setCheckAll] = useState(false);
  const { auth } = useAuth();
  const [loading, setLoading] = useState(auth ? true : false);
  useEffect(() => {
    if (auth) {
      getCart(setData, setLoading, axiosClient);
    }
  }, []);
  const checkedHandler = (setIsChecked, quantity, item, e) => {
    setIsChecked((prev) => {
      return !prev;
    });
    setTotal((prev) => {
      let temp = { ...prev };
      temp["quantities"] = e.target.checked ? temp["quantities"] + quantity : temp["quantities"] - quantity;
      temp["prices"] = e.target.checked ? temp["prices"] + item.product.price * quantity : temp["prices"] - item.product.price * quantity;
      return temp;
    });
  };
  return (
    <div>
      <ul className="text-white w-full relative ">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="absolute top-20 text-3xl font-black bg-accent rounded-md px-4 items-center flex justify-center py-1 left-14"
        >
          {"<"}
        </button>
        {loading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className=" flex ">
            <div className=" w-3/5 ">
              {auth == undefined ? (
                <h1 className="text-2xl mx-32 text-center my-48">
                  {" "}
                  You must be logged in first to add something to your cart.{" "}
                  <Link className="underline text-accent" to="/login">
                    Click here to login
                  </Link>{" "}
                </h1>
              ) : (
                <div className="bg-back mx-32 my-28">
                  <h1 className="font-bold text-3xl">Cart</h1>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="">Select all</label>
                    <input
                      type="checkbox"
                      onClick={() => {
                        setCheckAll((prev) => {
                          return !prev;
                        });
                      }}
                      checked={checkAll}
                      className=""
                    />
                  </div>
                  <section className="flex flex-col my-5 gap-4 z-0">
                    {data.length < 1 && <h1 className="text-2xl mx-32 font-bold text-center my-48">Cart is Empty</h1>}
                    {data.map((item, i) => {
                      return <CartItem item={item} i={i} key={i} setTotal={setTotal} setCheckAll={setCheckAll} checkedHandler={checkedHandler} data={data} />;
                    })}
                  </section>
                </div>
              )}
            </div>
            <div className=" w-2/5 h-screen ">
              <Card className={"hover:bg-primary mr-32 my-32 w-[360px] fixed"}>
                <h1 className="text-2xl pb-4 font-bold">Total Purchases</h1>
                <div className="flex">
                  <h2>Total Price ({total.quantities} items) :</h2>
                  <h2>{rupiahFormater(total.prices)}</h2>
                </div>
                <div className="border-t my-4  border-white ">
                  <h2 className="text-2xl pt-4 font-semibold">Total Price : {rupiahFormater(total.prices)}</h2>
                </div>
                <button className="bg-accent rounded-md font-semibold py-3 text-xl hover:bg-violet-800 transition-all">Checkout</button>
              </Card>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

function CheckBox({ checkAll, isChecked }) {
  const checkRef = useRef();
  useEffect(() => {
    if (checkAll == true) {
      if (isChecked == false) {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "checked").set.call(checkRef.current, !checkRef.current.checked); //membuat event untuk mengtrigger onclick;
        checkRef.current.dispatchEvent(new Event("click", { bubbles: true })); //mengtrigger event ;
      }
    }
  }, [checkAll]);

  return <input type="checkbox" ref={checkRef} defaultChecked={false} checked={isChecked} className=" border-white bg-transparent" />;
}
function CartItem({ item, setTotal, i, checkAll }) {
  const axiosClient = useAxiosPrivate();
  const [isChecked, setIsChecked] = useState(checkAll);
  const [quantity, setQuantity] = useState(item.quantity);
  useEffect(() => {
    const updateHandler = setTimeout(() => {
      const payload = { quantity: quantity };
      updateCart(setTotal, axiosClient, item, payload);
    }, 1000);
    return () => clearTimeout(updateHandler);
  }, [quantity]);
  return (
    <div key={i} className="flex space-x-2 z-0">
      <CheckBox item={item} isChecked={isChecked} checkAll={checkAll} />
      <div className="flex py-2 bg-primary rounded-md space-x-3">
        <div className="w-1/3 p-2">
          <img src={import.meta.env.VITE_BASE_URL + "/" + item.product.image} alt="" />
        </div>
        <div className="w-2/3 relative p-2">
          <h2>{item.product.name}</h2>
          <h2>{rupiahFormater(item.product.price)}</h2>
          <h2>Size : {item.size.name}</h2>
          <div className="absolute bottom-0 right-0 my-8 mx-5 space-x-1">
            <button
              className="bg-accent py-1 rounded-md w-8 "
              onClick={() => {
                if (quantity > 1) {
                  setQuantity((prev) => {
                    return prev - 1;
                  });
                }
              }}
            >
              -
            </button>
            <input type="number" className="w-14 py-1 rounded-md text-back pl-3 outline-accent " value={quantity} />
            <button
              className="bg-accent py-1 rounded-md w-8 "
              onClick={() => {
                setQuantity((prev) => {
                  return prev + 1;
                });
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Cart;
