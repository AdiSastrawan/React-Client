import React, { useEffect } from "react";
import axiosClient from "../axios-client";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

function useAxiosPrivate() {
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  useEffect(() => {
    //req interceptor berjalan ketika request berlangsung
    const reqInt = axiosClient.interceptors.request.use(
      (config) => {
        const token = auth || "";
        config.headers["Authorization"] = "Bearer " + token; //memasukan akses ke dalam header
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    //res interceptor berjalan ketika request berlangsung
    const resInt = axiosClient.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevReq = error?.config;
        //jika error 403 maka akan dilakukan pengiriman token ulang
        if (error.response.status == 403 || !prevReq.sent) {
          prevReq.sent = true;
          const token = await refresh();
          prevReq.headers["Authorization"] = "Bearer " + token;
          return axiosClient(prevReq);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosClient.interceptors.request.eject(reqInt);
      axiosClient.interceptors.response.eject(resInt);
    };
  }, [auth, refresh]);
  return axiosClient;
}

export default useAxiosPrivate;
