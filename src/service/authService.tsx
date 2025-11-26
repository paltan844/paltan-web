
import axios from "axios";
import { BASE_URL } from "./config";

// ⭐ Update User's Live Location + Address
export const updateUserLocation = (
  updateData: { liveLocation?: any; address?: string },
  setUser: (u: any) => void
) => {
  try {
    const savedUser = localStorage.getItem("user");
    let user = savedUser ? JSON.parse(savedUser) : {};

    // Update user object
    const updatedUser = {
      ...user,
      ...updateData,
    };

    // Save back to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update Zustand / app state
    if (typeof setUser === "function") {
      setUser(updatedUser);
    }

    return updatedUser;
  } catch (error) {
    console.warn("updateUserLocation failed:", error);
    return null;
  }
};


// ----------------------
// CUSTOMER LOGIN
// ----------------------
export const customerLogin = async (phone: string, fullName: string) => {
  const response = await axios.post(`${BASE_URL}/customer/login`, {
    phone,
    fullName,
  });

  const { accessToken, refreshToken, customer } = response.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return customer;
};

// ----------------------
// REFRESH TOKEN (Blinkit-style)
// ----------------------
export const refresh_tokens = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.warn("No refresh token found.");
      return null;
    }

    // 🔥 IMPORTANT: use plain axios, NOT appAxios
    const response = await axios.post(`${BASE_URL}/refresh-token`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (!accessToken) {
      return null;
    }

    // ⭐ Save refreshed tokens
    localStorage.setItem("accessToken", accessToken);

    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    console.warn("🔴 Token refresh failed:", error);

    // ❌ DO NOT clear entire local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // ✔ Correct login route for your app
    window.location.href = "/customerlogin";

    return null;
  }
};
