import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCart from "./ProductCart";
import { setProducts } from "@/redux/store/productSlice";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const ProductList = ({
  category = "all",
  searchTerm = "",
  priceFilter = "all",
  itemsPerPage = 10,
}) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category, priceFilter]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const priceParam =
          priceFilter && priceFilter !== "all" ? `&price=${priceFilter}` : "";

        const response = await axios.get(
          import.meta.env.VITE_API_URL +
            `/get-products?category=${category}&search=${searchTerm}${priceParam}&page=${currentPage}&limit=${itemsPerPage}`
        );

        const { data, pagination } = response.data;

        dispatch(setProducts(data || []));
        setTotalProducts(pagination.totalProducts || 0);
        setTotalPages(pagination.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
        dispatch(setProducts([]));
        setTotalProducts(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, category, priceFilter, currentPage, dispatch, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {totalProducts > 0 && (
        <div className="flex justify-end mb-2 px-4">
          <div className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            Showing{" "}
            <span className="font-bold">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalProducts)}
            </span>{" "}
            -{" "}
            <span className="font-bold">
              {Math.min(currentPage * itemsPerPage, totalProducts)}
            </span>{" "}
            of <span className="font-bold">{totalProducts}</span> products
          </div>
        </div>
      )}

      <div className="w-full max-w-[95%] lg:max-w-[92%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mx-auto place-content-center my-4 md:my-4 px-4 group">
        {products?.filter((p) => !p.blacklisted).length === 0 && !loading ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center p-6 md:p-10 rounded-xl shadow-lg bg-white/5 backdrop-blur-sm w-full max-w-lg mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/10">
            <div className="text-5xl sm:text-6xl md:text-7xl mb-6 animate-bounce">
              🔍
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-500">
              No products found
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300">
              Please try different search terms or adjust your filters to find
              products
            </p>
          </div>
        ) : (
          products
            ?.filter((product) => !product.blacklisted)
            .map((product) => (
              <ProductCart
                key={product._id}
                {...product}
                className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 "
              />
            ))
        )}
      </div>

      {totalProducts > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(currentPage - page) <= 2
                  );
                })
                .map((page, index, filteredPages) => (
                  <React.Fragment key={page}>
                    {index > 0 && page - filteredPages[index - 1] > 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ProductList;
