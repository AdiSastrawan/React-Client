import React, { Suspense, useEffect, useRef, useState } from "react";
import CarouselComponent from "./sub-components/CarouselComponent";
import ProductContent from "./sub-components/ProductContent/ProductContent";
import axiosClient from "../../axios-client";
import Spinner from "../Spinner";
import { Outlet } from "react-router-dom";
import useProductFetch from "../../hooks/useProductFetch";

export default function MainContent() {
  const { data, loading, lastPostElement } = useProductFetch();
  console.log(data);
  return (
    <main id="main" className=" bg-back min-h-screen pt-16 z-50">
      <section className="-z-20">
        <CarouselComponent />
      </section>

      <section className="grid grid-cols-3 lg:grid-cols-4 gap-3 px-2 py-5 bg-prime">
        <Suspense fallback={<h1 className="text-white font-bold text-3xl">Loading ...</h1>}>
          {data?.map((product, i) => {
            return <ProductContent product={product} key={i} />;
          })}
        </Suspense>
      </section>
      {loading && (
        <div className=" py-5 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <h2 ref={lastPostElement}>render here bro</h2>
      <Outlet />
    </main>
  );
}
