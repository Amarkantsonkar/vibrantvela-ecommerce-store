// FilterMenu.jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "../ui/input";

const categoryData = {
  trigger: "Category",
  items: [
    "All Category",
    "Mouse",
    "Keyboard",
    "Headphones",
    "Sneakers",
    "Phone Chargers", 
    "Power Banks",
    "Mobile Cases & Covers",
    "Trimmers",
    "Yoga Mats",
    "Office Chairs",
    "Printed T-Shirts",
    "Hoodies",
    "Notebooks",
    "Pet Toys"
  ],
};

const priceData = {
  trigger: "Price", 
  items: [
    "All Price",
    500,
    1000,
    2000,
    5000,
    10000,
    20000,
    50000,
    100000
  ],
};

const FilterMenu = ({
  category,
  setCategory,
  price,
  setPrice,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="w-[93vw] flex flex-col sm:flex-row justify-between items-center gap-3 mx-auto my-10 sm:gap-0">
      {/* Dropdown filters */}
      <div className="flex sm:w-[30%] w-full gap-3">
        {/* Category filter */}
        <Select
          onValueChange={(value) => setCategory(value === "all" ? "" : value)}
        >
          <SelectTrigger id={categoryData.trigger}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All Category</SelectItem>
            {categoryData.items
              .filter((item) => item !== "All Category")
              .map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Price filter */}
        <Select
          onValueChange={(value) => setPrice(value === "all" ? "" : value)}
        >
          <SelectTrigger id={priceData.trigger}>
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All Price</SelectItem>
            {priceData.items
              .filter((item) => item !== "All Price")
              .map((item) => (
                <SelectItem key={item} value={item}>
                  Less than ₹{item.toLocaleString()}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search input */}
      <div className="w-full sm:w-[60%]">
        <Input
          id="search"
          placeholder="Search Here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterMenu;
