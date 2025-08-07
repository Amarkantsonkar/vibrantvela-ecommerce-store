import { Star } from "lucide-react";
import React from "react";
import LinkButton from "./LinkButton";
import { starsGenerator } from "@/constants/helper";

const ProductCart = ({
  name = "Product Title",
  price = 2000,
  rating = 3.5,
  image = {
    url: "https://images.pexels.com/photos/3801990/pexels-photo-3801990.jpeg?auto=compress&cs=tinysrgb&w=400",
    id: "364jhkdbcdj",
  },
}) => {
  return (
    <div className="group relative flex flex-col bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10">
      <img
        src={image.url}
        alt={name}
        className="object-cover w-[30rem] h-[20rem] transition-transform duration-300 hover:scale-105"
      />

      <div className="px-3 grid gap-1 py-2 absolute bg-white dark:bg-zinc-900 w-full bottom-0 translate-y-[3rem] hover:translate-y-0 transform transition-all ease-in-out rounded-xl duration-300 shadow-lg">
        <h2 className="text-lg font-semibold break-words line-clamp-2 min-h-[3rem]">
          {name}
        </h2>
        <div className="flex justify-between items-center">
          <div className="flex">{starsGenerator(rating)}</div>
          <span className="text-sm font-medium text-white dark:text-white">
            ₹{price}
          </span>
        </div>
        <LinkButton
          to={`/product/${name.split(" ").join("-")}`}
          text="View Product"
        />
      </div>
    </div>
  );
};

export default ProductCart;
