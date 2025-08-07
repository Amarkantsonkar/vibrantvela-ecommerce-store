import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Edit, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/store/productSlice";
import { useToast } from "@/hooks/use-toast";
import userErrorLogout from "@/hooks/use-err-logout";
import { ToastAction } from "@radix-ui/react-toast";
import FilterMenu from "./FilterMenu";

const AllProduct = () => {
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10; // You can adjust this value

  const { toast } = useToast();
  const handleErrorLogout = userErrorLogout();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  // console.log(products);

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category]);

  useEffect(() => {
    const getFilterProducts = async () => {
      try {
        const res = await axios
          .get(
            import.meta.env.VITE_API_URL +
              `/get-products?category=${category}&search=${searchTerm}&page=${currentPage}&limit=${itemsPerPage}`
          )
          .then((res) => {
            console.log(res.data);
            const { data, pagination } = res.data;
            console.log(pagination);
            dispatch(setProducts(data));
            setTotalProducts(pagination.totalProducts);
            setTotalPages(pagination.totalPages);
          });
      } catch (error) {
        dispatch(setProducts([]));
        setTotalProducts(0);
        setTotalPages(1);
      }
    };
    getFilterProducts();
  }, [searchTerm, category, currentPage, dispatch]);

  const removeFromBlacklist = async (id) => {
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/remove-from-blacklist/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { message } = res.data;

      // Update product in Redux store locally
      dispatch(
        setProducts(
          products.map((p) => (p._id === id ? { ...p, blacklisted: false } : p))
        )
      );

      toast({
        title: "Success",
        description: message,
      });
    } catch (error) {
      handleErrorLogout(error, "Error occured while reverting changes");
    }
  };

  const blacklistProduct = async (id) => {
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/blacklist-product/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { message, data } = res.data;

      // Update product in Redux store locally
      dispatch(
        setProducts(
          products.map((p) => (p._id === id ? { ...p, blacklisted: true } : p))
        )
      );

      toast({
        title: "Success",
        description: message,
        action: (
          <ToastAction
            altText="changes"
            onClick={() => {
              removeFromBlacklist(data._id);
            }}
          >
            Undo Changes
          </ToastAction>
        ),
      });
    } catch (error) {
      handleErrorLogout(error, "Error occured while blacklisting product");
    }
  };

  const handleEdit = async (p) => {
    setEditProduct(p);
    setIsEditModelOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updateProduct = {
      ...editProduct,
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
    };

    dispatch(
      setProducts(
        products.map((p) => (p._id === editProduct._id ? updateProduct : p))
      )
    );

    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/update-product/${editProduct._id}`,
        {
          name: updateProduct.name,
          description: updateProduct.description,
          price: updateProduct.price,
          category: updateProduct.category,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { message } = res.data;
      toast({
        title: message,
      });
      setIsEditModelOpen(false);
    } catch (error) {
      return handleErrorLogout(error, "Error occured while updating product");
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-8 py-4">
      {/* heading */}
      <div className="flex justify-between items-center mb-6">
        {/* heading */}
        <h1 className="text-2xl font-bold">Our Products</h1>
        {totalProducts > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            {Math.min((currentPage - 1) * itemsPerPage + 1, totalProducts)} -{" "}
            {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
            {totalProducts} products
          </div>
        )}
      </div>
      {/* search & filter */}
      <div className="mb-6">
        <form className="flex flex-wrap gap-4 items-end">
          {/* search */}
          <div className="flex-1 min-w-[240px]">
            <Label htmlFor="search">Search Products</Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search by name or description"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {/* category */}
          <div className="w-full sm:w-48">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { label: "All Category", value: "all" },
                  { label: "Mouse", value: "mouse" },
                  { label: "Keyboard", value: "keyboard" },
                  { label: "Headphones", value: "headphones" },
                  { label: "Sneakers", value: "sneakers" },
                  { label: "Phone Chargers", value: "phone-chargers" },
                  { label: "Power Banks", value: "power-banks" },
                  { label: "Mobile Cases & Covers", value: "mobile-cases" },
                  { label: "Trimmers", value: "trimmers" },
                  { label: "Yoga Mats", value: "yoga-mats" },
                  { label: "Office Chairs", value: "office-chairs" },
                  { label: "Printed T-Shirts", value: "printed-tshirts" },
                  { label: "Hoodies", value: "hoodies" },
                  { label: "Notebooks", value: "notebooks" },
                  { label: "Pet Toys", value: "pet-toys" }
                ].map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>

      {/* product list */}
      <div className="w-full max-w-[95%] lg:max-w-[100%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mx-auto my-8 md:my-12 px-4">
        {products?.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center p-6 md:p-10 rounded-xl shadow-lg bg-white/5 backdrop-blur-sm w-full max-w-lg mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/10">
            <div className="text-5xl sm:text-6xl md:text-7xl mb-6 animate-bounce">
              🔍
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-500">
              No products found
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300">
              We couldn't find any products matching your criteria. Try
              adjusting your filters or search terms
            </p>
          </div>
        ) : (
          products?.map((p) => (
            <Card
              key={p._id}
              className="group relative flex flex-col bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                  src={p.image.url}
                  alt={p.name}
                  className="w-full h-full object-cover transform transition duration-700 group-hover:scale-110"
                />
                {p.blacklisted && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-20">
                    Blacklisted
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className="flex-grow p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white group-hover:text-green-400 transition-all duration-300">
                    ₹{p.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 px-2 py-1 rounded-full border border-gray-800">
                    {p.category}
                  </span>
                </div>
              </CardContent>

              {/* Actions */}
              <CardFooter className="p-5 pt-0">
                <div className="flex gap-3 w-full">
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:translate-y-[-2px]"
                    onClick={() => handleEdit(p)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={p.blacklisted ? "outline" : "destructive"}
                    className="flex-1 transition-all duration-300 transform hover:translate-y-[-2px]"
                    onClick={() => {
                      !p.blacklisted
                        ? blacklistProduct(p._id)
                        : removeFromBlacklist(p._id);
                    }}
                  >
                    {!p.blacklisted ? "Blacklist" : "Restore"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      {/* Pagination - Fixed visibility issue */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              {/* Previous Button - Always visible */}
              <PaginationItem>
                <PaginationPrevious
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

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 || // always show first page
                    page === totalPages || // always show last page
                    Math.abs(currentPage - page) <= 2 // show near current
                  );
                })
                .map((page, index, filteredPages) => (
                  <React.Fragment key={page}>
                    {/* Add ellipsis if there's a gap */}
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
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}

              {/* Next Button - Always visible */}
              <PaginationItem>
                <PaginationNext
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
      )}
      {/* edit dialog */}
      <Dialog open={isEditModelOpen} onOpenChange={setIsEditModelOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editProduct?.name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editProduct?.description}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={editProduct?.price}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={editProduct?.category}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Keyboard", "Mouse", "Headset"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllProduct;
