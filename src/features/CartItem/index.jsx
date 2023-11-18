import { useEffect, useRef, useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import rupiahFormater from "../../formater/rupiahFormater"
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, Button, useDisclosure, Toast, useToast } from "@chakra-ui/react"

const updateCart = async (axiosClient, item, payload) => {
  try {
    await axiosClient.put(`/carts/${item._id}`, payload)
  } catch (error) {
    console.log(error)
  }
}
const selectCart = async (axiosClient, item, payload) => {
  try {
    console.log("yosh")
    await axiosClient.put(`/carts/select/${item._id}`, payload)
  } catch (error) {
    console.log(error)
  }
}

const deleteCart = async (axiosClient, item, setIsDelete, toast) => {
  try {
    await axiosClient.delete(`/carts/${item._id}`)
    toast({
      title: "Item Deleted",
      description: "Item sucessfully deleted",
      status: "success",
      duration: 9000,
      position: "bottom-right",
      isClosable: true,
    })
  } catch (error) {
    console.log(error)
  } finally {
    setIsDelete(true)
  }
}
export default function CartItem({ setData, item, setTotal, i, checkAll, setLoading }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const toast = useToast()
  const axiosClient = useAxiosPrivate()
  const [quantity, setQuantity] = useState(parseInt(item.quantity))
  const [errors, setErrors] = useState({})
  useEffect(() => {
    ///debounce click

    const updateHandler = setTimeout(() => {
      const payload = { quantity: quantity }
      updateCart(axiosClient, item, payload)
    }, 1000)
    return () => clearTimeout(updateHandler)
  }, [quantity])
  useEffect(() => {
    if (item.isSelected) {
      setTotal((prev) => {
        let tmp = { ...prev }
        tmp.quantities = tmp.quantities + quantity
        tmp.prices = tmp.prices + item.product.price * quantity
        return tmp
      })
    }
  }, [])
  const deleteCartHandler = () => {
    deleteCart(axiosClient, item, setLoading, toast)
  }
  return (
    <>
      <div key={i} className="flex space-x-2 z-0 items-center ">
        <CheckBox item={item} i={i} checkAll={checkAll} axiosClient={axiosClient} quantity={quantity} setData={setData} setTotal={setTotal} />
        <div className="flex py-2 bg-primary rounded-md min-h-[10rem] space-x-3">
          <div className="w-1/3 p-2">
            <img className="object-contain" src={import.meta.env.VITE_BASE_URL + "/" + item.product.image} alt="" />
          </div>
          <div className="w-2/3 relative p-2">
            <h2 className="line-clamp-2">{item.product.name}</h2>
            <h2>{rupiahFormater(item.product.price)}</h2>
            <h2>Size : {item.size.name}</h2>
            <div className="sm:absolute bottom-0 right-0 my-2 mx-5 flex flex-col space-y-1 space-x-1 justify-center">
              <div>{Object.keys(errors).length !== 0 && <h1 className="  bg-red-500 py-1 px-1 text-sm  rounded-md">{errors.message}</h1>}</div>
              <div className="space-x-1 ">
                <button
                  className="bg-accent py-1 rounded-md w-8 "
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity((prev) => {
                        if (quantity > item.stock) {
                          setErrors((prev) => {
                            return { ...prev, message: `Maximum quantity !`, status: 400 }
                          })
                        } else {
                          setErrors({})
                        }
                        if (item.isSelected) {
                          //updating the total when the quantity changes
                          setTotal((prev) => {
                            let tmp = { ...prev }
                            tmp.quantities = tmp.quantities - 1
                            tmp.prices = tmp.prices - item.product.price
                            return tmp
                          })
                        }
                        return prev - 1
                      })
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  className={`w-14 py-1 rounded-md text-back pl-3 ${Object.keys(errors).length !== 0 ? "outline-1 border-2 border-red-500 outline-red-600" : "outline-accent"} `}
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(() => {
                      if (e.target.value > item.stock) {
                        setErrors((prev) => {
                          return { ...prev, message: `Maximum quantity !`, status: 400 }
                        })
                        return item.stock
                      } else {
                        setErrors({})
                      }
                      if (item.isSelected) {
                        //updating the total when the quantity changes
                        setTotal((prev) => {
                          let tmp = { ...prev }
                          tmp.quantities = parseInt(e.target.value)
                          tmp.prices = parseInt(item.product.price) * parseInt(e.target.value)
                          return tmp
                        })
                      }
                      return parseInt(e.target.value)
                    })
                  }}
                />
                <button
                  className="bg-accent py-1 rounded-md w-8 "
                  onClick={() => {
                    setQuantity((prev) => {
                      if (quantity >= item.stock) {
                        setErrors((prev) => {
                          return { ...prev, message: `Maximum quantity!`, status: 400 }
                        })
                        return item.stock
                      } else {
                        setErrors({})
                      }
                      if (item.isSelected) {
                        //updating the total when the quantity changes
                        setTotal((prev) => {
                          let tmp = { ...prev }
                          tmp.quantities = tmp.quantities + 1
                          tmp.prices = tmp.prices + item.product.price
                          return tmp
                        })
                      }
                      return prev + 1
                    })
                  }}
                >
                  +
                </button>
              </div>
              <h2>Stock : {item.stock}</h2>
            </div>
          </div>
        </div>

        <button onClick={onOpen} type="button" className="px-2 py-1 flex-shrink-0 h-8 rounded-md bg-red-600">
          -
        </button>
      </div>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bgColor={"#0d1117"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
              Delete Cart Item
            </AlertDialogHeader>

            <AlertDialogBody color="white">Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteCartHandler} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
function CheckBox({ checkAll, setTotal, setData, item, i, quantity, axiosClient }) {
  const checkRef = useRef()
  useEffect(() => {
    if (checkAll == true) {
      //toggle select true then update the data also the total
      if (item.isSelected == false) {
        setData((prev) => {
          let tmp = [...prev]
          tmp[i].isSelected = true
          if (tmp[i].isSelected) {
            addClickHandler()
          } else {
            subClickHandler()
          }
          return tmp
        })
      }
    }
  }, [checkAll])
  const addClickHandler = () => {
    setTotal((prev) => {
      let tmp = { ...prev }
      tmp.quantities = tmp.quantities + quantity
      tmp.prices = tmp.prices + item.product.price * quantity
      return tmp
    })
  }
  const subClickHandler = () => {
    setTotal((prev) => {
      let tmp = { ...prev }
      tmp.quantities = tmp.quantities - quantity
      tmp.prices = tmp.prices - item.product.price * quantity
      return tmp
    })
  }
  const clickHandler = () => {
    setData((prev) => {
      let tmp = [...prev]
      tmp[i].isSelected = !item.isSelected
      if (tmp[i].isSelected) {
        addClickHandler()
      } else {
        subClickHandler()
      }
      return tmp
    })
    selectCart(axiosClient, item, { isSelected: !item.isSelected })
  }
  return <input type="checkbox" ref={checkRef} checked={item.isSelected} className=" border-white bg-transparent" onClick={clickHandler} />
}
