import React, { useCallback, useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client";

const getProducts = async (setProducts, setLoading, paginate = 1, setHasMore) => {
  try {
    const response = await axiosClient.get(`/products?display=8&page=${paginate}`);
    setProducts((prev) => {
      console.log(prev);
      return [...new Set([...prev, ...response.data.data])];
    });
    setHasMore(response.data.next != null);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
function useProductFetch() {
  const [paginate, setPaginate] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };
  const pinRef = useRef();
  const lastPostElement = useCallback(
    (node) => {
      if (loading) return;
      if (pinRef.current) pinRef.current.disconnect();
      pinRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPaginate((prev) => prev + 1);
        }
      }, options);
      if (node) pinRef.current.observe(node);
    },
    [loading, hasMore]
  );
  useEffect(() => {
    setData([]);
  }, []);
  useEffect(() => {
    setLoading(true);
    getProducts(setData, setLoading, paginate, setHasMore);
  }, [paginate]);
  return { setPaginate, data, loading, lastPostElement };
}

export default useProductFetch;
