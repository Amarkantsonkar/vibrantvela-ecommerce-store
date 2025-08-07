import axios from "axios";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

const useRazorpay = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const generatePayment = async (amount) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/generate-payment",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = res.data;
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "Payment generation failed");
      }
    } catch (error) {
      console.error("Generate payment error:", error);
      toast({
        title: error.response?.data?.message || "Payment generation failed",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const verifyPayment = async (options, productArray, address) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );
        
        if (!res) {
          toast({
            title: "Failed to load Razorpay",
            variant: "destructive",
          });
          reject(new Error("Failed to load Razorpay"));
          return;
        }

        const paymentObject = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          ...options,
          image:
            "https://wallpapers.com/images/high/black-orange-gaming-headset-cu3zrtb60var9vvf.png",
          handler: async (response) => {
            try {
              const res = await axios.post(
                import.meta.env.VITE_API_URL + "/verify-payment",
                {
                  razorpay_order_id: options.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  amount: options.amount,
                  address,
                  productArray,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              if (res.data.success) {
                toast({
                  title: res.data.message || "Payment successful!",
                });
                navigate("/success");
                resolve(res.data);
              } else {
                throw new Error(res.data.message || "Payment verification failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast({
                title: error.response?.data?.message || "Payment verification failed",
                variant: "destructive",
              });
              reject(error);
            }
          },
          modal: {
            ondismiss: () => {
              toast({
                title: "Payment cancelled",
                variant: "destructive",
              });
              reject(new Error("Payment cancelled by user"));
            },
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        });

        paymentObject.open();
      } catch (error) {
        console.error("Razorpay setup error:", error);
        toast({
          title: "Payment setup failed",
          variant: "destructive",
        });
        reject(error);
      }
    });
  };

  return { generatePayment, verifyPayment };
};

export default useRazorpay;