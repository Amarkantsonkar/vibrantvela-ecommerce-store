import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import userErrorLogout from "@/hooks/use-err-logout";
import axios from "axios";

const Settings = () => {
  const { toast } = useToast();
  const handleErrorLogout = userErrorLogout();

  const changeUsername = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const previousUsername = formData.get("previousUsername");
    const newUsername = formData.get("newUsername");

    if (!newUsername) {
      toast({
        title: "Username to change is required",
      });
      return;
    }
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + "/change-username",
        {
          previousUsername,
          newUsername,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = res.data;
      localStorage.setItem("user", JSON.stringify(data.user));
      e.target.reset();
      return toast({
        title: "Success",
        description: data.message,
      });
    } catch (error) {
      return handleErrorLogout(error, "Failed to change username");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const previousPassword = formData.get("previousPassword");
    const newPassword = formData.get("newPassword");

    if (!newPassword || !previousPassword) {
      toast({
        title: "Previous and new password is required",
      });
      return;
    }
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + "/change-password",
        {
          username: JSON.parse(localStorage.getItem("user")).username,
          previousPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.data;
      localStorage.setItem("user", JSON.stringify(data.user));
      e.target.reset();
      return toast({
        title: "Success",
        description: data.message,
      });
    } catch (error) {
      return handleErrorLogout(error, "Failed to change password");
    }
  };

  return (
    <div className="w-[80vw] px-4 py-8 m-10 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-none sm:rounded-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-start items-start gap-8 w-full">
        {/* change username */}
        <div className="w-full sm:w-1/2">
          <h2 className="text-lg sm:text-2xl font-extrabold text-white-700 dark:text-white-400 mb-4">
            Change Username
          </h2>
          <form className="grid gap-4" onSubmit={changeUsername}>
            <Input
              type="text"
              placeholder="Enter previous username"
              name="previousUsername"
              className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="text"
              placeholder="Enter new username"
              name="newUsername"
              className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="w-full py-2 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-md transition duration-200"
            >
              Change Username
            </Button>
          </form>
        </div>

        {/* change password */}
        <div className="w-full sm:w-1/2">
          <h2 className="text-lg sm:text-2xl font-extrabold text-white-700 dark:text-white-400 mb-4">
            Change Password
          </h2>
          <form className="grid gap-4" onSubmit={changePassword}>
            <Input
              type="text"
              placeholder="Enter previous password"
              name="previousPassword"
              className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="text"
              placeholder="Enter new password"
              name="newPassword"
              className="text-sm sm:text-base px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="w-full py-2 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-md transition duration-200"
            >
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
