import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { setUserLogin } from "@/redux/store/authSlice";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = e.target.elements;

    if (email.value === "" || password.value === "") {
      return toast({
        title: "Please fill all the fields",
        variant: "destructive",
      });
    }

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/login", {
        email: email.value,
        password: password.value,
      });

      const data = await res.data;
      dispatch(setUserLogin(data));

      toast({
        title: data.message,
      });

      navigate("/");
    } catch (error) {
      toast({
        title:
          error?.response?.data?.message ||
          error?.message ||
          "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] max-w-full mx-auto my-24 px-6 py-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl transition-all duration-300">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-2">
        Login to Your Account
      </h1>
      <form className="grid gap-5 mt-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Enter Your Email"
          type="email"
          name="email"
          className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          placeholder="Enter Your Password"
          type="password"
          name="password"
          className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button className="w-full py-2 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-md transition duration-200">
          Login
        </Button>

        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>Don't have an account?</span>
          <Link
            to="/signup"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
