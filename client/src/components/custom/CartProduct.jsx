import { Colors } from "@/constants/Colors";
import { useToast } from "@/hooks/use-toast";
import { addToCart, removeFromCart } from "@/redux/store/cartSlice";
import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import useRazorpay from "@/hooks/use-razorpay";

const CartProduct = ({
  name,
  price,
  _id,
  image,
  quantity,
  stock,
  color,
  blacklisted,
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { generatePayment, verifyPayment } = useRazorpay();

  const handleDecrease = () => {
    if (quantity > 1) {
      dispatch(removeFromCart({ _id, quantity: 1, price, color }));
    } else {
      toast({ title: "Quantity cannot be less than 1" });
    }
  };

  const handleIncrease = () => {
    if (quantity < stock) {
      dispatch(addToCart({ _id, quantity: 1, price, color }));
    } else {
      toast({ title: "Maximum stock reached" });
    }
  };

  const handleRemoveItem = () => {
    dispatch(removeFromCart({ _id, quantity, price, color }));
    toast({ title: "Item removed from cart" });
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (quantity > stock) {
      toast({ title: "Product out of stock" });
      return;
    }
    if (blacklisted) {
      toast({ title: "Product is blacklisted" });
      return;
    }
    if (color === "") {
      toast({ title: "please select a color" });
      return;
    }
    const order = await generatePayment(price * quantity);
    await verifyPayment(
      order,
      [{ id: _id, quantity, color }],
      "123 Main street"
    );
    dispatch(handleRemoveItem())
  };

  return (
    <div className="flex flex-col border border-gray-200 dark:border-zinc-700 rounded-3xl overflow-hidden w-full max-w-full sm:max-w-[18rem] bg-white dark:bg-zinc-900 h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-[13rem] object-cover sm:h-[15rem] transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>
      <div className="flex flex-col justify-between flex-grow px-3 py-3 sm:px-4">
        <div>
          <h2
            className="text-sm sm:text-md font-semibold truncate mb-1"
            title={name}
          >
            {name}
          </h2>
          <span className="font-bold text-base sm:text-lg text-primary">
            ₹{price}
          </span>
        </div>

        <div className="flex flex-col mt-5 gap-4">
          <div className="flex items-center w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-700 rounded-lg px-3 py-2 shadow-sm border border-gray-200 dark:border-zinc-600">
            <button
              aria-label="Decrease quantity"
              className="flex-1 hover:bg-white dark:hover:bg-zinc-600 rounded-lg p-2 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md flex items-center justify-center"
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              <Minus size={14} stroke={Colors.customGray} />
            </button>
            <span className="text-slate-950 dark:text-white text-base font-semibold min-w-[3ch] text-center px-4">
              {quantity}
            </span>
            <button
              aria-label="Increase quantity"
              className="flex-1 hover:bg-white dark:hover:bg-zinc-600 rounded-lg p-2 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
              onClick={handleIncrease}
            >
              <Plus size={14} stroke={Colors.customGray} />
            </button>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              size="sm"
              onClick={handleBuyNow}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-sm"
            >
              Buy Now
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemoveItem}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 flex items-center justify-center gap-1.5 text-sm"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
