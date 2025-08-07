// Home.jsx
import React, { useState } from "react";
import FilterMenu from "@/components/custom/FilterMenu";
import HeaderDisplay from "@/components/custom/HeaderDisplay";
import ProductList from "@/components/custom/ProductList";

const Home = () => {
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div style={{ overflowX: "hidden" }}>
      <HeaderDisplay />

      <FilterMenu
        category={category}
        setCategory={setCategory}
        price={price}
        setPrice={setPrice}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <ProductList
        category={category}
        priceFilter={price}
        searchTerm={searchTerm}
        itemsPerPage={10}
      />
    </div>
  );
};

export default Home;
