import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUserLogout } from "@/redux/store/authSlice";
import { Link } from "react-router-dom";
import { emptyCart } from "@/redux/store/cartSlice";

const LogoutToggle = ({ user }) => {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      ref={menuRef}
    >
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center uppercase"
      >
        {user?.name?.[0] || "U"}
      </button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-zinc-800 border rounded shadow-md z-50">
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-700"
            onClick={() => {
              dispatch(setUserLogout());
              dispatch(emptyCart()); // ✅ Clears cart on logout
            }}
          >
            Logout
          </button>

          <Link
            to="/orders"
            className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            My Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default LogoutToggle;
