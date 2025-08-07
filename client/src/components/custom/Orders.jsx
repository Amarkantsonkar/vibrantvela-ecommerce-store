import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import OrderProductTile from "./OrderProductTile";
import userErrorLogout from "@/hooks/use-err-logout";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleErrorLogout = userErrorLogout();

  useEffect(() => {
    const fetchOrders = () => {
      try {
        axios
          .get(
            import.meta.env.VITE_API_URL +
              `/get-all-orders?page=${currentPage}&limit=4`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            console.log(res.data);
            const { data, totalPages, currentPage } = res.data;
            setOrders(data);
            setTotalPages(totalPages);
            setCurrentPage(currentPage);
          });
      } catch (error) {
        return handleErrorLogout(error, error.response.data.message);
      }
    };
    fetchOrders();
  }, [currentPage]);

  const updateOrderStatus = async (status, paymentId) => {
    try {
      await axios.put(
        import.meta.env.VITE_API_URL + `/update-order-status/${paymentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      return handleErrorLogout(error, error.response.data.message);
    }
  };

  return (
    <>
      <div className="width-[93vw] mx-auto px-4 sm:px-8 py-4">
        <h1 className="text-2xl font-bold mb-2">Orders</h1>
        <div className="flex flex-col gap-5 mx-auto">
          <div className="space-y-8">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-bold">Orders Summary</h2>
              <div className="grid space-y-1 gap-2 sm:w-[80vw]">
                {orders.length === 0 ? (
                   <div className="col-span-full flex flex-col items-center justify-center text-center p-6 md:p-10 rounded-xl shadow-lg bg-white/5 backdrop-blur-sm w-full max-w-lg mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/10">
                   <div className="text-5xl sm:text-6xl md:text-7xl mb-6 animate-bounce">
                     📦
                   </div>
                   <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-500">
                     No Orders to Manage
                   </h3>
                   <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300">
                     Currently there are no customer orders in the system. New orders will appear here when customers make purchases.
                   </p>
                 </div>
                ) : (
                  orders.map((item) => (
                    <Card key={item._id} className="space-y-2 p-3 shadow-md">
                      <div className="grid sm:grid-cols-3 gap-2">
                        {item?.products?.map((product) => (
                          <OrderProductTile key={product._id} {...product} />
                        ))}
                      </div>
                      <hr />
                      <div>
                        <p className="flex justify-start items-start gap-2 px-3">
                          <span className="font-bold whitespace-nowrap">
                            Total :
                          </span>
                          <span className="text-sm text-customGray break-words">
                            ₹{item?.amount}
                          </span>
                        </p>

                        <p className="flex justify-start items-start gap-2 px-3">
                          <span className="font-bold whitespace-nowrap">
                            Address :
                          </span>
                          <span className="text-sm text-customGray break-words">
                            {item?.address}
                          </span>
                        </p>

                        <p className="flex justify-start items-start gap-2 px-3">
                          <span className="font-bold whitespace-nowrap">
                            Name :
                          </span>
                          <span className="text-sm text-customGray break-words">
                            {item?.userId?.name}
                          </span>
                        </p>

                        <p className="flex justify-start items-start gap-2 px-3">
                          <span className="font-bold whitespace-nowrap">
                            Email :
                          </span>
                          <span className="text-sm text-customGray break-words">
                            {item?.userId?.email}
                          </span>
                        </p>

                        <p className="flex justify-start items-start gap-2 px-3">
                          <span className="font-bold whitespace-nowrap">
                            Payment Id :
                          </span>
                          <span className="text-sm text-customGray break-words">
                            {item?.razorpayPaymentId}
                          </span>
                        </p>
                      </div>
                      <Select
                        onValueChange={(value) => {
                          alert("Do you really want to update the status?");
                          updateOrderStatus(value, item.razorpayPaymentId);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pending" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">pending</SelectItem>
                          <SelectItem value="packed">packed</SelectItem>
                          <SelectItem value="in transit">in transit</SelectItem>
                          <SelectItem value="completed">completed</SelectItem>
                          <SelectItem value="failed">failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1}
                    style={{
                      opacity: currentPage === 1 ? 0.5 : 1,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  />
                </PaginationItem>

                {/* Show a compact pagination window */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 || // always show first page
                      page === totalPages || // always show last page
                      Math.abs(currentPage - page) <= 2 // show near current
                    );
                  })
                  .map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages}
                    style={{
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
