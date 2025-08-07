import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [enabled, setEnabled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password } = e.target.elements;

    if (
      name.value.trim() === "" ||
      email.value.trim() === "" ||
      phone.value.trim() === "" ||
      password.value.trim() === ""
    ) {
      toast({
        title: "Please fill all the fields",
        // description: "All fields are required",
        variant: "destructive",
      });
    }

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/signup", {
        name: name.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
      });

      const data = await res.data;

      toast({
        title: data.message,
        variant: "success",
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: error.data.response.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] max-w-full mx-auto my-24 px-6 py-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl transition-all duration-300">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-4">
          Register Your Account
        </h1>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Input
            placeholder="Enter Your Name"
            type="text"
            name="name"
            className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            placeholder="Enter Your Phone"
            type="tel"
            name="phone"
            className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            placeholder="Enter Your Password"
            type="password"
            name="password"
            className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" onCheckedChange={(e) => setEnabled(e)} />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 leading-none"
            >
              Accept terms and conditions
            </label>
          </div>

          <Button
            disabled={!enabled}
            className={`w-full py-2 text-sm sm:text-base font-semibold rounded-md transition-colors duration-200 ${
              enabled
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Sign Up
          </Button>

          <div className="flex gap-2 items-center justify-center mt-2 text-xs sm:text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Already have an account?
            </span>
            <Link to="/login">
              <span className="font-medium text-blue-500 dark:text-blue-400 hover:underline cursor-pointer">
                Login
              </span>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
