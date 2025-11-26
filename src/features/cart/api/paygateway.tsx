
import { BASE_URL } from "@service/config";
import { navigate } from "@utils/NavigationUtils";
import axios from "axios";
import RazorpayCheckout from "react-native-razorpay";
import { Platform } from "react-native";
import { mmkvStorage, tokenStorage } from "@state/storage";
import { useCartStore } from "@state/cartStore";
import { useAuthStore } from "@state/authStore";


type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};


const getToken = () => tokenStorage.getString("accessToken");


const fullName = mmkvStorage.getItem("userFullName") || "Guest";
const phone = mmkvStorage.getItem("userPhone") || "";


const loadRazorpay = (): Promise<boolean> => {

  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export const startWebPayment = ({
  key,
  amount,
  order_id,
  name,
  description,
  prefill,
}: any): Promise<RazorpaySuccessResponse> => {

  return new Promise((resolve, reject) => {
    if (!(window as any).Razorpay) {
      reject({ error: "Razorpay SDK not loaded" });
      return;
    }

    const options = {
      key,
      amount,
      currency: "INR",
      name,
      description,
      order_id,
      prefill,
      theme: { color: "#F37254" },

      handler: function (response: any) {
        resolve(response);
      },

      modal: {
        ondismiss: function () {
          reject({ error: "Payment Cancelled" });
        },
      },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  });
};

/* ---------------------------------------------------------
   CREATE TRANSACTION (ORDER ID)
--------------------------------------------------------- */
export const createTransaction = async (amount: number, userId: string) => {

  try {
    const token = getToken();

    if (!token) {
      return null;
    }

    const res = await axios.post(
      `${BASE_URL}/order/transaction`,
      { userId, amount: amount * 100 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;

  } catch (error: any) {
    return null;
  }
};


export const createOrders = async (
  key: string,
  amount: number,
  order_id: string,
  cart: any,
  userId: string,
  address: Record<string, any>
) => {

  try {
    const token = getToken();
    let paymentResponse: RazorpaySuccessResponse;

    if (Platform.OS === "web") {

      const sdkLoaded = await loadRazorpay();

      if (!sdkLoaded) return { type: "error", message: "Unable to load Razorpay SDK" };

      paymentResponse = await startWebPayment({
        key,
        amount,
        order_id,
        name: "Paltan",
        description: "Order Payment",
        prefill: { name: fullName, contact: phone },
      });

    }

    else {
      paymentResponse = (await RazorpayCheckout.open({
        description: "Order Payment",
        currency: "INR",
        key,
        amount,
        name: "Paltan",
        order_id,
        image: "https://i.posting.cc/ZRCCXLgg/temp-Imagef-Coi-ZY.avif",
        prefill: { name: fullName, contact: phone },
        theme: { color: "#F37254" },
      })) as RazorpaySuccessResponse;
    }

    const payload = {
      razorpay_order_id: order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
      userId,
      cartItems: cart,
      branch: "686e910cba6c97c2a5301768",
      address,
      paymentType: "RAZORPAY",
    };

    const orderResponse = await axios.post(
      `${BASE_URL}/orders`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const order = orderResponse.data.order;

    if (order) {
      useCartStore.getState().clearCart();
      useAuthStore.getState().setCurrentOrder(order);

      navigate("OrderSuccess", { price: amount / 100, address });

      return { type: "success", order };
    }

    return { type: "error", message: "Order creation failed" };

  } catch (err: any) {
    return {
      type: "error",
      message: err?.response?.data || err?.message,
    };
  }
};
