import axios from "axios";
import { BASE_URL } from "./config";

// ✅ Login API
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

// ✅ Refresh Tokens
export const refresh_tokens = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await axios.post(`${BASE_URL}/refresh-token`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    console.warn("Failed to refresh tokens:", error);
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
};
