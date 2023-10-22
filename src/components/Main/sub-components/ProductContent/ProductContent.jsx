import { useRef, useState } from "react";
import Card from "./sub-components/Card";
import CardCaption from "./sub-components/CardCaption";
import CardTitle from "./sub-components/CardTitle";
import Modal from "./sub-components/Modal";
import rupiahFormater from "../../../../formater/rupiahFormater";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";
import jwtDecode from "jwt-decode";
import Spinner from "../../../Spinner";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure, useToast } from "@chakra-ui/react";

const sendCart = async (axiosPrivate, payload, setLoading, setOpen, setSize, setQuantity, onClose, toast) => {
  try {
    const res = await axiosPrivate.post(`/carts?quantity=${payload.quantity}&user=${payload.user}&size=${payload.size}&product=${payload.product}`);
    if (res.status != 200) {
      throw new Error(res);
    }
    document.body.className = "";
    setSize("");
    setQuantity(1);
    toast({
      title: "Item Added to Cart",
      description: "Item sucessfully Added",
      status: "success",
      duration: 9000,
      position: "bottom-right",
      isClosable: true,
    });
    setOpen(false);
  } catch (error) {
    console.log(error);
  } finally {
    onClose();
    setLoading(false);
  }
};

export default function ProductContent({ product }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const cancelRef = useRef();
  const [Open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const openModal = () => {
    setOpen(() => {
      return true;
    });
    const body = document.body;
    body.className = "overflow-hidden";
  };
  const addToCartHandler = () => {
    setLoading(true);
    const payload = {
      quantity: quantity,
      size: size,
      user: jwtDecode(auth).id,
      product: product._id,
    };
    console.log(quantity, size, jwtDecode(auth).id, product._id);
    sendCart(axiosPrivate, payload, setLoading, setOpen, setSize, setQuantity, onClose, toast, setErrors);
  };
  const subHandler = () => {
    if (quantity > 1) {
      setErrors({});
      setQuantity((prev) => {
        return prev - 1;
      });
    }
  };
  const addHandler = () => {
    setErrors({});
    const product_stock = product?.stock?.filter((st) => {
      return st.size_id._id == size;
    });
    if (product_stock[0]?.quantity > quantity) {
      setQuantity((prev) => {
        return prev + 1;
      });
    } else if (product_stock.length < 1) {
      setErrors((prev) => {
        let temp = { ...prev };
        temp.status = 400;
        temp.message = "Please select size first";
        return temp;
      });
    } else {
      setErrors((prev) => {
        let temp = { ...prev };
        temp.status = 400;
        temp.message = " Cannot add more, Run out of stock";
        return temp;
      });
    }
  };

  return (
    <>
      <Card className="hover:bg-primary bg-violetcursor-pointer group bg-back" onClick={openModal}>
        <img src={import.meta.env.VITE_BASE_URL + "/" + product.image} className=" h-[300px] object-cover" alt="uwu" />
        <CardTitle className="group-hover:text-white/75 transition-all text-white font-medium md:text-base text-left h-14 line-clamp-2">{product.name}</CardTitle>
        <CardCaption className="text-white font-semibold text-xl text-left group-hover:text-accent transition-colors">{rupiahFormater(product.price)}</CardCaption>
      </Card>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bgColor={"#0d1117"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
              Add Item to Cart
            </AlertDialogHeader>

            <AlertDialogBody color="white">Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="white"
                _hover={{
                  background: "rgb(76, 29, 149)",
                }}
                bgColor={"#784ED5"}
                onClick={addToCartHandler}
                ml={3}
              >
                {loading ? <Spinner /> : "Add to Cart "}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {Open && (
        <Modal isOpen={Open} setIsOpen={setOpen}>
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
                        <div key={i} className="w-fit flex flex-col items-center">
                          <button
                            onClick={() => {
                              setErrors({});
                              setSize(s.size_id._id);
                              if (quantity > s.quantity) {
                                setQuantity(s.quantity);
                              }
                            }}
                            className={`border-accent/50 border-2 flex space-y-0 w-fit px-4 justify-center items-center py-1 ${size == s.size_id._id && "bg-accent"} rounded-md`}
                          >
                            <h2>{s.size_id.name} </h2>
                          </button>
                          <h2> Stock : {s.quantity}</h2>
                        </div>
                      );
                    })}
                  </div>
                  <h2>Quantity</h2>
                  <div className="flex gap-2">
                    <button onClick={subHandler} className="px-3 py-2 min-w-[40px] bg-violet-500 rounded-md flex justify-center items-center">
                      -
                    </button>
                    <input
                      type="number"
                      className="text-primary rounded-md px-2"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(parseInt(e.target.value));
                      }}
                    />
                    <button onClick={addHandler} className="px-3 py-2 min-w-[40px] bg-violet-500 rounded-md flex justify-center items-center">
                      +
                    </button>
                  </div>
                  {!auth && <h1 className="bg-red-500 py-2 px-2 rounded-md">Login first before you add it to your cart!</h1>}
                  {Object.keys(errors).length !== 0 && <h1 className="bg-red-500 py-2 px-2 rounded-md">{errors.message}</h1>}
                  <button
                    disabled={!auth || quantity === 0 ? true : loading}
                    onClick={() => {
                      if (size.length < 1) {
                        setErrors((prev) => {
                          let temp = { ...prev };
                          temp.status = 400;
                          temp.message = "Please enter size !";
                          return temp;
                        });
                        return;
                      }
                      onOpen();
                    }}
                    className={`${!auth || quantity === 0 ? "bg-gray-500" : "bg-accent hover:bg-violet-950"}  transition-colors min-w-[200px]  py-2 px-4 text-white/90 rounded-lg`}
                  >
                    Add to Cart
                  </button>
                  <p>{product?.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
