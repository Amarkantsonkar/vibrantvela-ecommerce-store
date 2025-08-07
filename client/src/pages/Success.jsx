import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Success = () => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen px-4">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
        Payment Successful
      </h1>
      <Link
        to={"/"}
        className="mt-4 text-sm sm:text-base lg:text-lg text-blue-500 hover:underline text-center"
      >
        Go to Home (Redirecting you in {count} seconds)
      </Link>
    </div>
  );
};

export default Success;
