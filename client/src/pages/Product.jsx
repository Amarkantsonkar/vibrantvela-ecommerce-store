import ReviewsComponent from "@/components/custom/ReviewsComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Colors } from "@/constants/Colors";
import { starsGenerator } from "@/constants/helper";
import axios from "axios";
import { Circle, Minus, Plus, Package, Truck, Shield, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/redux/store/cartSlice";
import useRazorpay from "@/hooks/use-razorpay";

const Product = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { generatePayment, verifyPayment } = useRazorpay();

  const [productQuantity, setProductQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [availabilityMessage, setavailabilityMessage] = useState("");
  const [purchaseProduct, setPurchaseProduct] = useState(false);
  const [address, setAddress] = useState("");
  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [productColor, setProductColor] = useState("");

  useEffect(() => {
    const fecthProductByName = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL +
            `/get-products-by-name/${productName?.split("-").join(" ")}`
        );
        const { data } = await res.data;
        setProduct(data);
      } catch (error) {}
    };
    fecthProductByName();
  }, [productName]);

  const calculateEmi = (price) => {
    return Math.round(price / 6);
  };

  const checkAvailabity = async () => {
    if (pincode.trim() === "") {
      setavailabilityMessage("please enter a valid pincode");
      return;
    }
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL + `/get-pincode/${pincode}`
      );
      const data = await res.data;
      if (data.success) {
        setavailabilityMessage("Delivery available");
      }
    } catch (error) {
      setavailabilityMessage("Delivery not available for this product");
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (productColor === "") {
      toast({
        title: "Please select a color",
      });
      return;
    }
    if (product.stock === 0) {
      toast({
        title: "Product is out of stock",
        variant: "destructive",
      });
      return;
    }
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0].url,
        quantity: productQuantity,
        color: productColor,
        stock: product.stock,
        blacklisted: product.blacklisted,
      })
    );
    setProductQuantity(1);
    toast({
      title: "Product added to cart",
    });
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (productQuantity > product.stock) {
      toast({
        title: "Product out of stock",
        variant: "destructive",
      });
      return;
    }
    if (product.blacklisted) {
      toast({
        title: "Product is not available for purchase",
        variant: "destructive",
      });
      return;
    }
    if (productColor === "") {
      toast({
        title: "please select a color",
      });
      return;
    }
    if (product.stock === 0) {
      toast({
        title: "Product is out of stock",
        variant: "destructive",
      });
      return;
    }
    if (address.trim() === "") {
      toast({
        title: "Please enter your address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const order = await generatePayment(product.price * productQuantity);
      await verifyPayment(
        order,
        [{ id: product._id, quantity: productQuantity, color: productColor }],
        address
      );
      setPurchaseProduct(false);
    } catch (error) {
      console.error("Buy now error:", error);
    }
  };

  // Stock status helper functions
  const getStockStatus = () => {
    if (product.stock === 0) return 'out-of-stock';
    if (product.stock <= 5) return 'low-stock';
    return 'in-stock';
  };

  const getStockBadge = () => {
    const status = getStockStatus();
    switch (status) {
      case 'out-of-stock':
        return <Badge variant="destructive" className="text-xs">Out of Stock</Badge>;
      case 'low-stock':
        return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-200">Low Stock</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">In Stock</Badge>;
    }
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <>
      <div className="relative pt-20 text-gray-900 dark:text-gray-100 min-h-screen">
        <main className="w-[93vw] lg:w-[70vw] flex flex-col sm:flex-row justify-start items-start gap-10 mx-auto my-10">
          {/* Left side */}
          <div className="grid sm:w-[50%] gap-3">
            <div className="relative">
              <img
                src={product?.images?.[selectedImage]?.url}
                className={`w-full h-[20rem] sm:h-[25rem] lg:h-[30rem] rounded-xl object-center object-cover border dark:border-gray-700 ${isOutOfStock ? 'opacity-60' : ''}`}
                alt="Product"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                  <div className="text-center">
                    <Package className="w-16 h-16 text-white mx-auto mb-2" />
                    <p className="text-white text-xl font-bold">Out of Stock</p>
                    <p className="text-gray-300 text-sm">This item is currently unavailable</p>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product?.images?.map(({ url, id }, index) => (
                <img
                  src={url}
                  key={id}
                  onClick={() => setSelectedImage(index)}
                  className={`w-full h-full object-cover rounded-xl filter hover:brightness-50 cursor-pointer transition-all ease-in-out duration-300 border dark:border-gray-700 ${isOutOfStock ? 'opacity-60' : ''}`}
                  alt={`Thumbnail ${id}`}
                />
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="sm:w-[50%] lg:w-[35%]">
            <div className="pb-5">
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-extrabold text-2xl flex-1">{product?.name}</h2>
                {getStockBadge()}
              </div>
              <p className="text-sm my-2 text-gray-600 dark:text-gray-400">{product?.description}</p>
              <div className="flex items-center">
                {starsGenerator(product?.rating, "0", 15)}
                <span className="text-md ml-1">
                  ({product?.reviews?.length})
                </span>
              </div>
            </div>

            <div className="py-5 border-t border-b dark:border-gray-700">
              <h3 className="font-bold text-xl">
                Rs.{product.price} {!isOutOfStock && (
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                    or Rs.{calculateEmi(product.price)}/month
                  </span>
                )}
              </h3>
              {!isOutOfStock && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Suggested payment with 6 months special financing
                </p>
              )}
              
              {/* Stock Information */}
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {isOutOfStock ? (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <Package className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Currently out of stock</span>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center text-orange-600 dark:text-orange-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Only {product.stock} left in stock - order soon!</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{product.stock} items available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="py-5 border-b dark:border-gray-700">
              <h3 className="font-bold text-lg">Choose Color</h3>
              <div className="flex items-center my-2">
                {product?.colors?.map((color, index) => (
                  <Circle
                    key={index + color}
                    fill={color}
                    stroke={productColor === color ? "#000" : productColor === color ? "#fff" : "transparent"}
                    strokeWidth={2}
                    size={40}
                    onClick={() => !isOutOfStock && setProductColor(color)}
                    className={`cursor-pointer filter hover:brightness-50 transition-all ease-in-out duration-300 mr-2 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className="py-5">
              <div className="flex flex-wrap gap-3 items-center">
                <div className={`flex items-center gap-5 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2 w-fit ${isOutOfStock ? 'opacity-50' : ''}`}>
                  <Minus
                    stroke={Colors.customGray}
                    cursor={isOutOfStock ? "not-allowed" : "pointer"}
                    onClick={() =>
                      !isOutOfStock && setProductQuantity((qty) => (qty > 1 ? qty - 1 : 1))
                    }
                  />
                  <span className="text-slate-950 dark:text-gray-100">
                    {productQuantity}
                  </span>
                  <Plus
                    stroke={Colors.customGray}
                    cursor={isOutOfStock ? "not-allowed" : "pointer"}
                    onClick={() =>
                      !isOutOfStock && setProductQuantity((qty) =>
                        qty < product.stock ? qty + 1 : qty
                      )
                    }
                  />
                </div>
                {!isOutOfStock && product.stock - productQuantity > 0 && (
                  <div className="grid text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <span>
                      Only{" "}
                      <span className="text-customYellow">
                        {product.stock - productQuantity} items{" "}
                      </span>
                      left!
                    </span>
                    <span>Don't miss it</span>
                  </div>
                )}
              </div>

              <div className="grid gap-3 my-5">
                <div className="flex flex-wrap gap-3">
                  <Input
                    placeholder="Enter Your Pincode Here"
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1"
                    disabled={isOutOfStock}
                  />
                  <Button 
                    onClick={checkAvailabity}
                    disabled={isOutOfStock}
                    variant={isOutOfStock ? "secondary" : "default"}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Check Availability
                  </Button>
                </div>
                <p className="text-sm px-2">{availabilityMessage}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={(e) => !isOutOfStock && setPurchaseProduct(true)}
                  disabled={isOutOfStock}
                  className={isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {isOutOfStock ? "Out of Stock" : "Buy Now"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {isOutOfStock ? "Unavailable" : "Add to Cart"}
                </Button>
              </div>

              {/* Out of Stock Message */}
              {isOutOfStock && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                    <div>
                      <h4 className="text-red-800 dark:text-red-200 font-semibold">Currently Out of Stock</h4>
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        This item is temporarily unavailable. Check back later or contact us for restock updates.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {purchaseProduct && !isOutOfStock && (
                <div className="my-4 space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Complete Your Purchase</h4>
                  <Input
                    placeholder="Enter Your Address Here..."
                    onChange={(e) => setAddress(e.target.value)}
                    className="border-blue-300 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleBuyNow} className="flex-1">
                      Confirm Order - Rs.{product.price * productQuantity}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setPurchaseProduct(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {!isOutOfStock && (
                <div className="mt-6 grid gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    <span>Free delivery on orders above Rs.500</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>1 year warranty included</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Review section */}
        {product?._id && <ReviewsComponent productId={product._id} />}
      </div>
    </>
  );
};

export default Product;