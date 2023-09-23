import { useState } from "react";
import image1 from "../../../../assets/1.png";
import Card from "./sub-components/Card";
import CardCaption from "./sub-components/CardCaption";
import CardTitle from "./sub-components/CardTitle";
import Modal from "./sub-components/Modal";
import rupiahFormater from "../../../../formater/rupiahFormater";

export default function ProductContent({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(() => {
      return true;
    });
    const body = document.body;
    body.className = "overflow-hidden";
  };
  return (
    <>
      <Card>
        <img src={import.meta.env.VITE_BASE_URL + "/" + product.image} alt="uwu" />
        <CardTitle className="text-white font-bold text-2xl text-center ">{product.name}</CardTitle>
        <CardCaption className="text-white/90 ">{product.desc}</CardCaption>
        <CardCaption className="text-white font-semibold text-xl ">{rupiahFormater(product.price)}</CardCaption>
        <div className="flex py-2 flex-col gap-2">
          <button className="bg-accent hover:bg-violet-950 transition-colors  py-2 px-4 text-white/90 rounded-lg"> Add to Cart</button>
          <button onClick={openModal} className="bg-primary border-white/50 border-2 hover:border-white  text-white  py-2 px-4 font-medium rounded-lg">
            Details
          </button>
        </div>
      </Card>

      {isOpen && (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className="max-h-[520px] my-5 bg-primary rounded-md flex items-center flex-col overflow-y-auto overflow-x-hidden">
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
                <h2 className="text-xl font-semibold">{rupiahFormater(product.price)}</h2>
                <div className=" space-y-2">
                  <h2 className="font-medium text-lg">Size</h2>
                  <div className="grid grid-cols-5 gap-1 text-base">
                    {product.stock.map((s, i) => {
                      return (
                        <button key={i} className="border-accent/50 border-2 py-1  rounded-md">
                          {s.size_id.name}
                        </button>
                      );
                    })}
                  </div>
                  <h2>Quantity</h2>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 min-w-[40px] bg-violet-500 rounded-md flex justify-center items-center">-</button>
                    <input type="number" className="text-primary rounded-md px-2" defaultValue={1} />
                    <button className="px-3 py-2 min-w-[40px] bg-violet-500 rounded-md flex justify-center items-center">+</button>
                  </div>
                  <button className="bg-accent hover:bg-violet-950 transition-colors  py-2 px-4 text-white/90 rounded-lg"> Add to Cart</button>
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
