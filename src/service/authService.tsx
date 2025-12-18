import axios from "axios";
import { BASE_URL } from "./config";
import { appAxios } from "./apilnterceptors";

/* =====================================================
   UPDATE USER (LOCAL ONLY – UI SMOOTHNESS)
===================================================== */
export const updateUserLocation = (
  updateData: {
    liveLocation?: any;
    address?: string;
    pincode?: string;
    city?: string;
    state?: string;
  },
  setUser: (u: any) => void
) => {
  try {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : {};

    const updatedUser = {
      ...user,
      ...updateData,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    return updatedUser;
  } catch (error) {
    console.warn("updateUserLocation failed:", error);
    return null;
  }
};


export const customerLogin = async (phone: string, fullName: string) => {
  const response = await axios.post(`${BASE_URL}/customer/login`, {
    phone,
    fullName,
  });

  const { accessToken, refreshToken, customer } = response.data;

  // 🔐 store tokens
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  // 🧠 store user
  localStorage.setItem("user", JSON.stringify(customer));

  // ✅ RETURN EVERYTHING
  return {
    accessToken,
    refreshToken,
    customer,
  };
};


/* =====================================================
   REFRESH TOKEN (SILENT – APP STYLE)
===================================================== */
export const refresh_tokens = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) return null;

    const response = await axios.post(`${BASE_URL}/refresh-token`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (!accessToken) return null;

    localStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    // 🔴 DO NOT ALERT HERE (interceptor will handle logout)
    console.warn("🔴 Token refresh failed:", error);
    return null;
  }
};

/* =====================================================
   FETCH USER (ON APP LOAD / RELOAD)
===================================================== */
export const refetchUser = async (setUser: (u: any) => void) => {
  try {
    const response = await appAxios.get("/user");

    const user = response.data.user;
    if (!user) return null;

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    return user;
  } catch (error) {
    console.warn("❌ refetchUser failed:", error);
    return null;
  }
};
