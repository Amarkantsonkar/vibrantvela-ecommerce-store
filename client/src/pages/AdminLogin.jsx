import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { setUserLogin } from "@/redux/store/authSlice";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (!username || !password) {
      return toast({
        title: "Please enter username and password",
      });
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/admin-login",
        {
          username,
          password,
        }
      );
      const data = await res.data;
      dispatch(setUserLogin(data));
      toast({
        title: data.message,
        success: true,
      });
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[30vw] xl:w-[25vw] mx-auto my-12 sm:my-24 px-6 py-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl transition-all duration-300 ease-in-out">
      <h1 className="text-xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-400 text-center mb-2">
        Admin Login
      </h1>
      <p className="text-sm sm:text-base md:text-lg font-medium text-gray-600 dark:text-gray-300 text-center mb-6">
        Login into your account
      </p>
      <form className="grid gap-5" onSubmit={handleLogin}>
        <Input
          placeholder="Username Here..."
          type="text"
          name="username"
          className="text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          placeholder="Password Here..."
          type="password"
          name="password"
          className="text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 rounded-md text-sm sm:text-base transition duration-200">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
