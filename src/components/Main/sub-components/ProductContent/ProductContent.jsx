import { useState } from "react";
import image1 from "../../../../assets/1.png";
import Card from "./sub-components/Card";
import CardCaption from "./sub-components/CardCaption";
import CardTitle from "./sub-components/CardTitle";
import Modal from "./sub-components/Modal";
import rupiahFormater from "../../../../formater/rupiahFormater";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../Spinner";

const sendCart = async (axiosPrivate, payload, setLoading, setIsOpen, setSize, setQuantity) => {
  try {
    const response = await axiosPrivate.post(`/carts?quantity=${payload.quantity}&user=${payload.user}&size=${payload.size}&product=${payload.product}`);
    document.body.className = "";
    setSize("");
    setQuantity(1);
    setIsOpen(false);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export default function ProductContent({ product }) {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const openModal = () => {
    setIsOpen(() => {
      return true;
    });
    const body = document.body;
    body.className = "overflow-hidden";
  };
  const addToCartHandler = () => {
    if (size.length < 1) {
      setErrors((prev) => {
        let temp = { ...prev };
        temp.status = 400;
        temp.message = "Please enter size !";
        return temp;
      });
      return;
    }
    setLoading(true);
    const payload = {
      quantity: quantity,
      size: size,
      user: jwtDecode(auth).id,
      product: product._id,
    };
    console.log(quantity, size, jwtDecode(auth).id, product._id);
    sendCart(axiosPrivate, payload, setLoading, setIsOpen, setSize, setQuantity);
  };
  const subHandler = () => {
    if (quantity > 1) {
      setQuantity((prev) => {
        return prev - 1;
      });
    }
  };
  const addHandler = () => {
    setQuantity((prev) => {
      return prev + 1;
    });
  };
  return (
    <>
      <Card className="hover:scale-105 cursor-pointer group " onClick={openModal}>
        <img src={import.meta.env.VITE_BASE_URL + "/" + product.image} className="h-[300px] object-contain" alt="uwu" />
        <CardTitle className="group-hover:text-white/75 transition-all text-white font-medium md:text-base text-left h-14 line-clamp-2">{product.name}</CardTitle>
        <CardCaption className="text-white font-semibold text-xl text-left group-hover:text-accent transition-colors">{rupiahFormater(product.price)}</CardCaption>
      </Card>

      {isOpen && (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className="max-h-[520px] mt-10 my-5 bg-primary rounded-md flex items-center flex-col overflow-y-auto overflow-x-hidden">
            <h2 className="pt-4  font-black text-3xl">{product.name}</h2>
            <div className="bg-primary gap-10 px-10 py-5 w-full grid grid-cols-2">
              <div className="flex flex-col gap-2">
                <img src={import.meta.env.VITE_BASE_URL + "/" + product.image} alt="" />
                <div className="grid grid-cols-4 ">
                  <div className="cursor-pointer">
                    <img className="object-contain" src={import.meta.env.VITE_BASE_URL + "/" + product.image} alt="" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl font-semibold ">{rupiahFormater(product.price)}</h2>
                <div className=" space-y-2">
                  <h2 className="font-medium text-lg">Size</h2>
                  <div className="grid grid-cols-5 gap-1 text-base">
                    {product.stock.map((s, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            console.log(s.size_id._id);
                            setSize(s.size_id._id);
                          }}
                          className={`border-accent/50 border-2 py-1 ${size == s.size_id._id && "bg-accent"} rounded-md`}
                        >
                          {s.size_id.name}
                        </button>
                      );
                    })}
                  </div>
                  <h2>Quantity</h2>
                  <div className="flex gap-2">
                    <button onClick={subHandler} className="px-3 py-2 min-w-[40px] bg-violet-500 rounded-md flex justify-center items-center">
                      -
                    </button>
                    <input type="number" className="text-primary rounded-md px-2" value={quantity} />
                    <button onClick={addHandler} className="px-3 py-2 min-w-[40px] bg-violet-500 rounded-md flex justify-center items-center">
                      +
                    </button>
                  </div>
                  {!auth && <h1 className="bg-red-500 py-2 px-2 rounded-md">Login first before you add it to your cart!</h1>}
                  {Object.keys(errors).length !== 0 && <h1 className="bg-red-500 py-2 px-2 rounded-md">{errors.message}</h1>}
                  <button disabled={!auth ? true : loading} onClick={addToCartHandler} className="bg-accent hover:bg-violet-950 transition-colors  py-2 px-4 text-white/90 rounded-lg">
                    {loading ? <Spinner /> : "Add to Cart "}
                  </button>
                  <p>{product.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
