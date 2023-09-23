import jwtDecode from "jwt-decode";
import Navlist from "./sub-components/Navlist";
import Navlists from "./sub-components/Navlists";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { auth } = useAuth();

  return (
    <div className="w-full text-white justify-between flex py-3 px-10 ">
      <h1 className="text-tersier lg:text-xl font-bold">Logo</h1>
      <Navlists className="space-x-4 px-5">
        <Navlist>Cart</Navlist>
        {auth != undefined ? <Navlist>{jwtDecode(auth).name}</Navlist> : <Navlist to="login">Login</Navlist>}
      </Navlists>
    </div>
  );
}
