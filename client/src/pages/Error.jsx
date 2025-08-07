import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
      <h1 className="text-3xl sm:text-5xl font-bold text-center mb-4">
        404 Page Not Found
      </h1>
      <p className="text-sm sm:text-lg text-center mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition"
      >
        Go to HomePage
      </Link>
    </div>
  );
};

export default Error;
