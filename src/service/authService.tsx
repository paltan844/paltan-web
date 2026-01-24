import axios from "axios";
import { BASE_URL } from "./config";
import { appAxios } from "./apilnterceptors";


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


export const sendEmailOtp = async (email: string) => {
  if (!email) throw new Error("Email required");

  await axios.post(`${BASE_URL}/auth/send-email-otp`, {
    email,
  });
};


export const verifyEmailOtpAndLogin = async (payload: {
  fullName: string;
  phoneNumber: string;
  email: string;
  otp: string;
}) => {
  const response = await axios.post(
    `${BASE_URL}/auth/verify-email-otp`,
    payload
  );

  const { accessToken, refreshToken, customer } = response.data;

  
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(customer));

  return {
    accessToken,
    refreshToken,
    customer,
  };
};



export const customerLogin = async (phone: string, fullName: string) => {
  const response = await axios.post(`${BASE_URL}/customer/login`, {
    phone,
    fullName,
  });

  const { accessToken, refreshToken, customer } = response.data;


  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  localStorage.setItem("user", JSON.stringify(customer));

  return {
    accessToken,
    refreshToken,
    customer,
  };
};

/*
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
    console.warn("🔴 Token refresh failed:", error);
    return null;
  }
};
*/



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
    console.warn("🔴 Refresh failed", error);
    return null;
  }
};


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

