import React from "react";

const OrderProductTile = ({ quantity, id, color }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 sm:p-2 rounded-lg bg-gray-100 dark:bg-zinc-900 shadow-md">
      <div className="flex flex-row items-start sm:items-center gap-4">
        <img
          src={id?.images[0].url}
          alt={id?.name}
          className="w-20 sm:w-24 rounded-lg object-cover"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200">
            {id?.name}
          </h1>
          <p className="flex flex-wrap gap-2 text-gray-500 dark:text-customGray text-sm sm:text-base">
            <span className="font-semibold">
              Color:{" "}
              <span
                className="inline-block w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              ></span>
            </span>
            <span className="hidden sm:inline-block">|</span>
            <span className="font-semibold">
              Qty: <span className="font-medium text-customYellow">{quantity}</span>
            </span>
            <span className="hidden sm:inline-block">|</span>
            <span className="font-semibold">
              Price: <span className="font-medium text-customYellow">₹{id?.price}</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderProductTile;
