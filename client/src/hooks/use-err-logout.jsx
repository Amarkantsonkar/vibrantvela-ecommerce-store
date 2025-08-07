import { useDispatch } from "react-redux";
import { useToast } from "./use-toast";
import { setUserLogout } from "@/redux/store/authSlice";

const userErrorLogout = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleErrorLogout = (error, otherTitle = "Error occured") => {
    if (error?.response?.status === 401) {
      dispatch(setUserLogout());
      toast({
        title: "Session expired.",
        description: "Please login again to continue",
        variant: "destructive",
      });
    } else {
      toast({
        title: otherTitle,
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };
  return handleErrorLogout;
};
export default userErrorLogout;