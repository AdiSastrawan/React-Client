import { createBrowserRouter } from "react-router-dom";
import Default from "./layouts/Default";
import Login from "./container/Login/Login";
import Register from "./page/Register";
import PersistLogin from "./layouts/PersistLogin";
import Cart from "./container/Cart";
import MainContent from "./components/Main/MainContent";

const router = createBrowserRouter([
  {
    element: <PersistLogin />,
    children: [
      {
        element: <Default />,
        children: [
          { path: "cart", element: <Cart /> },
          { path: "/", element: <MainContent />, children: [{ path: "login", element: <Login /> }] },
        ],
      },
    ],
  },

  { path: "/register", element: <Register /> },
]);

export default router;
