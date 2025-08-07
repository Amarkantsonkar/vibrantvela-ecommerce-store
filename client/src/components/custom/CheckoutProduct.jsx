import { Colors } from "@/constants/Colors";
import React from "react";

const CheckoutProduct = ({
  name = "Custom Designed Keyboard",
  price = 599,
  quantity = 2,
  image = {
    url: "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  color = Colors.customYellow,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg bg-gray-100 dark:bg-zinc-900 shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200">
            {name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="font-semibold">Color:</span>
              <span
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: color }}
              ></span>
            </span>
            <span className="hidden sm:block">|</span>
            <span className="font-semibold">
              Qty:{" "}
              <span className="font-medium text-customYellow">{quantity}</span>
            </span>
            <span className="hidden sm:block">|</span>
            <span className="font-semibold">
              Price:{" "}
              <span className="font-medium text-customYellow">₹{price}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;
