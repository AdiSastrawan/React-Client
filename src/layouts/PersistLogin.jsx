import React, { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import Spinner from "../components/Spinner";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function PersistLogin() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  useEffect(() => {
    let isMounted = true;
    async function verifyToken() {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setLoading(false);
      }
    }
    if (!auth) {
      verifyToken();
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, []);
  return loading ? (
    <div className="bg-back min-h-screen w-full flex justify-center items-center">
      <Spinner />
    </div>
  ) : (
    <Outlet />
  );
}

export default PersistLogin;
