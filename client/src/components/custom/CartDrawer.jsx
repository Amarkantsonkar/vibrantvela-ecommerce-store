import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ShoppingCart, Package, IndianRupee } from "lucide-react";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import CartProduct from "./CartProduct";
import LinkButton from "./LinkButton";

const CartDrawer = () => {
  const { cartItems, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="relative focus:outline-none rounded-md p-1 bg-white dark:bg-gray-900 z-20">
          {totalQuantity > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 py-0 text-xs">
              {totalQuantity}
            </Badge>
          )}
          <ShoppingCart
            className="text-gray-800 dark:text-white hover:scale-105 transition-all-ease-in-out cursor-pointer"
            strokeWidth={1.3}
            size={28}
          />
        </button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            Shopping Cart
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>

          <div className="flex flex-col gap-3 w-full mt-4">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
              <Package className="text-gray-600 dark:text-gray-400" size={18} />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Items:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {totalQuantity}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
              <IndianRupee
                className="text-gray-600 dark:text-gray-400"
                size={18}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Total:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8">
          {cartItems?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center p-6 md:p-10 rounded-xl shadow-lg bg-white/5 backdrop-blur-sm w-full max-w-lg mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/10">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-6 animate-bounce">
                🛒
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-500">
                Your cart is empty
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300">
                Add items to your cart to see them here
              </p>
            </div>
          ) : (
            <div className="w-full px-4 sm:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-stretch">
                {cartItems.map((item) => (
                  <CartProduct key={`${item._id}-${item.color}`} {...item} />
                ))}
              </div>
            </div>
          )}
        </div>

        <DrawerFooter>
          <LinkButton to="/checkout" text="Checkout" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
