import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import rupiahFormater from "../../formater/rupiahFormater";

const updateCart = async (axiosClient, item, payload) => {
  try {
    await axiosClient.put(`/carts/${item._id}`, payload);
  } catch (error) {
    console.log(error);
  }
};
export default function CartItem({ setData, item, setTotal, i, checkAll }) {
  const axiosClient = useAxiosPrivate();
  const [quantity, setQuantity] = useState(item.quantity);
  useEffect(() => {
    ///debounce click
    const updateHandler = setTimeout(() => {
      const payload = { quantity: quantity };
      updateCart(axiosClient, item, payload);
    }, 1000);
    return () => clearTimeout(updateHandler);
  }, [quantity]);
  return (
    <div key={i} className="flex space-x-2 z-0">
      <CheckBox item={item} i={i} checkAll={checkAll} quantity={quantity} setData={setData} setTotal={setTotal} />
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
                    if (item.checked) {
                      //updating the total when the quantity changes
                      setTotal((prev) => {
                        let tmp = { ...prev };
                        tmp.quantities = tmp.quantities - 1;
                        tmp.prices = tmp.prices - item.product.price;
                        return tmp;
                      });
                    }
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
                  if (item.checked) {
                    //updating the total when the quantity changes
                    setTotal((prev) => {
                      let tmp = { ...prev };
                      tmp.quantities = tmp.quantities + 1;
                      tmp.prices = tmp.prices + item.product.price;
                      return tmp;
                    });
                  }
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
function CheckBox({ checkAll, setTotal, setData, item, i, quantity }) {
  const checkRef = useRef();
  useEffect(() => {
    if (checkAll) {
      //toggle select true then update the data also the total
      setData((prev) => {
        let tmp = [...prev];
        tmp[i].checked = true;
        if (tmp[i].checked) {
          addClickHandler();
        } else {
          subClickHandler();
        }
        return tmp;
      });
    }
  }, [checkAll]);
  const addClickHandler = () => {
    setTotal((prev) => {
      let tmp = { ...prev };
      tmp.quantities = tmp.quantities + quantity;
      tmp.prices = tmp.prices + item.product.price * quantity;
      return tmp;
    });
  };
  const subClickHandler = () => {
    setTotal((prev) => {
      let tmp = { ...prev };
      tmp.quantities = tmp.quantities - quantity;
      tmp.prices = tmp.prices - item.product.price * quantity;
      return tmp;
    });
  };
  const clickHandler = () => {
    setData((prev) => {
      let tmp = [...prev];
      tmp[i].checked = !prev[i].checked;
      if (tmp[i].checked) {
        addClickHandler();
      } else {
        subClickHandler();
      }
      return tmp;
    });
  };
  return <input type="checkbox" ref={checkRef} checked={item.checked} className=" border-white bg-transparent" onClick={clickHandler} />;
}
