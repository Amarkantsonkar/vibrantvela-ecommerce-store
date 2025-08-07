import axios from "axios";
import OrderData from "@/components/custom/OrderData";
import userErrorLogout from "@/hooks/use-err-logout";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const handleErrorLogout = userErrorLogout();

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/get-orders-by-user-id",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { data } = await res.data;
        setOrders(data);
      } catch (error) {
        handleErrorLogout(error);
      }
    };
    getMyOrders();
  }, []);

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 pt-28 pb-16 mx-auto max-w-screen-lg">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h1>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center p-6 md:p-10 rounded-xl shadow-lg bg-white/5 backdrop-blur-sm w-full max-w-lg mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/10">
            <div className="text-5xl sm:text-6xl md:text-7xl mb-6 animate-bounce">
              🛍️
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-500">
              No Orders found
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
          </div>
        ) : (
          orders.map((order) => <OrderData key={order._id} {...order} />)
        )}
      </div>
    </div>
  );
};

export default MyOrder;
