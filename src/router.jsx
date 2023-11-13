import { createBrowserRouter } from "react-router-dom"
import Default from "./layouts/Default"
import Login from "./container/Login/Login"
import Register from "./page/Register"
import PersistLogin from "./layouts/PersistLogin"
import Cart from "./container/Cart"
import MainContent from "./components/Main/MainContent"
import Transaction from "./container/Transaction"
import Checkout from "./container/Checkout"
import Error from "./container/Error"
import RequireAuth from "./layouts/RequireAuth"
import VerifyAccount from "./page/VerifyAccount"
import ResetPassword from "./page/ResetPassword"
import VerifyResetPassword from "./page/VerifyResetPassword"

const router = createBrowserRouter([
  {
    element: <PersistLogin />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/verify-reset-password", element: <VerifyResetPassword /> },
      { path: "/verify-account", element: <VerifyAccount /> },
      {
        element: <Default />,
        children: [
          { path: "cart", errorElement: <Error />, element: <Cart /> },
          {
            element: <RequireAuth />,
            children: [
              { path: "success", element: <Transaction /> },
              { path: "checkout", element: <Checkout /> },
            ],
          },
          { path: "/", errorElement: <Error />, element: <MainContent /> },
        ],
      },
    ],
  },
])

export default router
