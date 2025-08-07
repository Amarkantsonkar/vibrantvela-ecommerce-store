import CheckoutProduct from "@/components/custom/CheckoutProduct";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import userErrorLogout from "@/hooks/use-err-logout";
import useRazorpay from "@/hooks/use-razorpay";
import { useToast } from "@/hooks/use-toast";
import { emptyCart } from "@/redux/store/cartSlice";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [address, setAddress] = useState("");
  const { cartItems, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );

  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleErrorLogout = userErrorLogout();
  const { generatePayment, verifyPayment } = useRazorpay();

  const handleCheckout = async () => {
    // Fix: Check if address exists and is not empty
    if (!address || address.trim() === "") {
      toast({
        title: "Please enter your address",
        variant: "destructive",
      });
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    const productArray = cartItems.map((item) => {
      return {
        id: item._id,
        quantity: item.quantity,
        color: item.color,
      };
    });

    try {
      const options = await generatePayment(totalPrice);
      
      // Fix: Await the verifyPayment call and handle it properly
      const paymentResult = await verifyPayment(options, productArray, address);
      console.log("Payment Result:", paymentResult);
      
      // Empty cart after successful payment initiation
      dispatch(emptyCart());
       
    } catch (error) {
      console.error("Checkout error:", error);
      return handleErrorLogout(error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary */}
        <div className="flex-1">
          <Card className="p-6 shadow-md border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex justify-center">
                  <Card className="p-6 shadow-md w-full max-w-md text-center">
                    <h2 className="text-primary text-sm">
                      Nothing To Show, Please add some products
                    </h2>
                  </Card>
                </div>
              ) : (
                cartItems.map((item) => (
                  <CheckoutProduct key={item?._id} {...item} />
                ))
              )}
            </div>
            <hr className="my-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Tax:</span>
                <span className="font-semibold">₹0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Shipping:</span>
                <span className="font-semibold">₹0</span>
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>₹{totalPrice}</span>
            </div>
          </Card>
        </div>

        {/* Billing Information */}
        <div className="flex-1">
          <Card className="p-6 shadow-md border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="w-full mt-1"
                  value={user?.name || ""}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full mt-1"
                  value={user?.email || ""}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="address" className="block text-sm font-medium">
                  Shipping Address
                </Label>
                <Textarea
                  rows="7"
                  id="address"
                  placeholder="123 Main St, City, Bangalore"
                  className="w-full mt-1"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="w-full mt-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Place Your Order
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;