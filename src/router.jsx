import { createBrowserRouter } from "react-router-dom";
import Default from "./layouts/Default";
import Login from "./container/Login/Login";
import Register from "./page/Register";

const router = createBrowserRouter([
  { path: "/", element: <Default />, children: [{ path: "login", element: <Login /> }] },
  { path: "/register", element: <Register /> },
]);

export default router;
