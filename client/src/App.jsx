import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/provider/theme-provider";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Error from "./pages/Error";
import Success from "./pages/Success";
import AdminLogin from "./pages/AdminLogin";
import RootLayout from "./layout/RootLayout";
import AdminLayout from "./layout/AdminLayout";
import CreateProducts from "./components/custom/CreateProducts";
import AllProduct from "./components/custom/AllProduct";
import Orders from "./components/custom/Orders";
import Analytics from "./components/custom/Analytics";
import Settings from "./components/custom/Settings";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MyOrder from "./pages/MyOrder";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoutes from "./components/custom/ProtectedRoutes";
import AboutUs from "./components/custom/AboutUs";
import HelpCenter from "./components/custom/HelpCenter";

export default function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <RootLayout children={<Home />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/signup",
        element: (
          <ProtectedRoutes>
            <RootLayout children={<Signup />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/login",
        element: (
          <ProtectedRoutes>
            <RootLayout children={<Login />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/product/:productName",
        element: <RootLayout children={<Product />} />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoutes>
            <RootLayout children={<Checkout />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoutes>
            <RootLayout children={<MyOrder />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/admin/login",
        element: (
          <ProtectedRoutes>
            <RootLayout children={<AdminLogin />} />
          </ProtectedRoutes>
        ),
      },

      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoutes>
            <AdminLayout children={<CreateProducts />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/admin/dashboard/all-products",
        element: (
          <ProtectedRoutes>
            <AdminLayout children={<AllProduct />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/admin/dashboard/orders",
        element: (
          <ProtectedRoutes>
            <AdminLayout children={<Orders />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/admin/dashboard/analytics",
        element: (
          <ProtectedRoutes>
            <AdminLayout children={<Analytics />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/admin/dashboard/settings",
        element: (
          <ProtectedRoutes>
            <AdminLayout children={<Settings />} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/about",
        element: <RootLayout children={<AboutUs />} />,
      },
      {
        path: "/help",
        element: <RootLayout children={<HelpCenter />} />,
      },

      {
        path: "/*",
        element: <Error />,
      },
      {
        path: "/success",
        element: <Success />,
      },
    ],
    {
      future: {
        v7_startTransition: true,
      },
    }
  );
  return (
    <>
      <ThemeProvider>
        <Provider store={store}>
          <Toaster />
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
    </>
  );
}
