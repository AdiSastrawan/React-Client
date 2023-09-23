import React, { useContext, useDebugValue } from "react";
import AuthContext from "../context/authContext";

function useAuth() {
  const auth = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth ? "Logged In" : "Logged Out"));
  return useContext(AuthContext);
}

export default useAuth;
