import React, { Suspense, useEffect, useState } from "react";
import CarouselComponent from "./sub-components/CarouselComponent";
import ProductContent from "./sub-components/ProductContent/ProductContent";
import axiosClient from "../../axios-client";
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
    <main id="main" className=" bg-back overflow-hidden">
      <section>
        <CarouselComponent />
      </section>
      <section className="grid grid-cols-3 lg:grid-cols-4 gap-3 px-2 py-5 bg-prime">
        {loading ? (
          <h1 className="text-white font-bold text-3xl">Loading ...</h1>
        ) : (
          <Suspense fallback={<h1 className="text-white font-bold text-3xl">Loading ...</h1>}>
            {products?.data.map((product, i) => {
              return <ProductContent product={product} key={i} />;
            })}
          </Suspense>
        )}
      </section>
    </main>
  );
}
