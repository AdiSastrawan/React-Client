import React, { Suspense, useEffect, useState } from "react";
import CarouselComponent from "./sub-components/CarouselComponent";
import ProductContent from "./sub-components/ProductContent/ProductContent";
import axiosClient from "../../axios-client";
import Spinner from "../Spinner";
import { Outlet } from "react-router-dom";
const getProducts = async (setProducts, setLoading) => {
  try {
    const response = await axiosClient.get("/products");
    setProducts(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
export default function MainContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getProducts(setProducts, setLoading);
  }, []);
  return (
    <main id="main" className=" bg-back min-h-screen pt-16 z-50">
      <section className="-z-20">
        <CarouselComponent />
      </section>
      {loading ? (
        <div className=" py-5 flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <section className="grid grid-cols-3 lg:grid-cols-4 gap-3 px-2 py-5 bg-prime">
          <Suspense fallback={<h1 className="text-white font-bold text-3xl">Loading ...</h1>}>
            {products?.data.map((product, i) => {
              return <ProductContent product={product} key={i} />;
            })}
          </Suspense>
        </section>
      )}
      <Outlet />
    </main>
  );
}
