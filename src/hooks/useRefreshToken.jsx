import axiosClient from "../axios-client";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { setAuth } = useAuth();
  const refresh = async () => {
    try {
      const response = await axiosClient.post("/token");
      setAuth(response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      console.log(error);
    }
  };
  return refresh;
}

export default useRefreshToken;
