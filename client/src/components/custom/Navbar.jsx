import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";
import CartDrawer from "./CartDrawer";
import { User } from "lucide-react";
import LogoutToggle from "./LogoutToggle";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <nav className="fixed top-0 w-full z-50 px-4 sm:px-8 py-4 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-lg">
      <div className="w-[97%] mx-auto flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <ModeToggle />

          {/* Cart icon (fixed size) */}
          <div className="w-10 h-10 flex items-center justify-center">
            <CartDrawer />
          </div>

          {/* User icon or LogoutToggle */}
          <div className="w-10 h-10 flex items-center justify-center">
            {isAuthenticated ? (
              <LogoutToggle user={user} />
            ) : (
              <Link
                to="/login"
                className="group w-full h-full flex items-center justify-center"
              >
                <User
                  size={28}
                  strokeWidth={1.3}
                  className="text-gray-800 dark:text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                />
              </Link>
            )}
          </div>
        </div>

        {/* Center - Logo */}
        <Link
          to="/"
          className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-600 bg-clip-text text-transparent whitespace-nowrap transition-all duration-500 hover:scale-105"
        >
          VibrantVela
        </Link>

        {/* Right Section - Desktop Links */}
        <ul className="hidden sm:flex gap-8 text-base md:text-lg items-center font-medium">
          <li>
            <Link
              to="/about"
              className="relative text-gray-800 dark:text-white transition-colors duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              className="relative text-gray-800 dark:text-white transition-colors duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Help Center
            </Link>
          </li>
        </ul>

        {/* Hamburger Menu */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 dark:text-white focus:outline-none hover:opacity-75 transition-all duration-300 hover:rotate-180"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="flex flex-col sm:hidden gap-4 text-base absolute right-4 top-[72px] w-48 z-50 bg-white dark:bg-zinc-800 shadow-xl rounded-xl px-4 py-4 transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <li>
            <Link
              to="/about"
              className="block w-full py-2 px-4 text-gray-800 dark:text-white hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-500/10 rounded-lg transition-all duration-300 transform hover:translate-x-2"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              className="block w-full py-2 px-4 text-gray-800 dark:text-white hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-500/10 rounded-lg transition-all duration-300 transform hover:translate-x-2"
            >
              Help Center
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
